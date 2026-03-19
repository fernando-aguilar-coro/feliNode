import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import AudioRecord from 'react-native-audio-record';

const MAX_RECORDING_TIME_SECONDS = 30;

/**
 * Single-instance speech recognition hook.
 *
 * Uses expo-speech-recognition exclusively — no AudioRecord running in parallel.
 * The audio file is obtained via recordingOptions.persist = true and delivered
 * through the 'audioend' event, which calls onRecordingComplete.
 */
export const useMicrophone = (
    onRecordingComplete?: (uri: string | null) => void,
    onRecordingStart?: () => void,
) => {
    const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
    const [isRecordingSupported, setIsRecordingSupported] = useState<boolean>(true);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');

    const autoStopTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Keep callbacks in refs to avoid stale closures
    const onRecordingCompleteRef = useRef(onRecordingComplete);
    const onRecordingStartRef = useRef(onRecordingStart);
    useEffect(() => {
        onRecordingCompleteRef.current = onRecordingComplete;
        onRecordingStartRef.current = onRecordingStart;
    }, [onRecordingComplete, onRecordingStart]);

    // Keep isRecording fresh in a ref for use inside event handlers
    const isRecordingRef = useRef(false);
    useEffect(() => {
        isRecordingRef.current = isRecording;
    }, [isRecording]);

    // ── Request permissions on mount ──────────────────────────────────────

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Audio.requestPermissionsAsync();
                setPermissionStatus(status);
                
                const supported = ExpoSpeechRecognitionModule.supportsRecording();
                setIsRecordingSupported(supported);

                if (!supported && status === 'granted') {
                    AudioRecord.init({
                        sampleRate: 16000,
                        channels: 1,
                        bitsPerSample: 16,
                        audioSource: 6, // VoiceRecognition
                        wavFile: 'audio.wav',
                    });
                }
            } catch (err) {
                console.error('[useMicrophone] Permission error:', err);
            }
        })();
    }, []);

    // ── Speech Recognition events ─────────────────────────────────────────

    useSpeechRecognitionEvent('start', () => {
        setTranscript('');
    });

    useSpeechRecognitionEvent('result', (event) => {
        if (event.results?.length) {
            setTranscript(event.results[0]?.transcript ?? '');
        }
    });

    useSpeechRecognitionEvent('error', (event) => {
        console.warn('[useMicrophone] SR error:', event);
    });

    // 'audioend' fires when the audio capture finishes; uri is the persisted file.
    useSpeechRecognitionEvent('audioend', (event) => {
        setIsRecording(false);
        clearAutoStop();
        const uri: string | null = (event as any).uri ?? null;
        onRecordingCompleteRef.current?.(uri);
    });

    // 'end' fires after 'audioend'; nothing extra needed here.
    useSpeechRecognitionEvent('end', () => { /* handled via audioend */ });

    // ── Helpers ───────────────────────────────────────────────────────────

    const clearAutoStop = useCallback(() => {
        if (autoStopTimerRef.current) {
            clearTimeout(autoStopTimerRef.current);
            autoStopTimerRef.current = null;
        }
    }, []);

    // ── Stop ──────────────────────────────────────────────────────────────
    const stopRecording = useCallback(async () => {
        clearAutoStop();
        if (isRecordingSupported) {
            try {
                ExpoSpeechRecognitionModule.stop(); // triggers 'audioend' → onRecordingComplete
            } catch (_) { /* already stopped */ }
        } else {
            setIsRecording(false);
            try {
                let uri = await AudioRecord.stop();
                if (!uri.startsWith('file://')) {
                    uri = 'file://' + uri;
                }
                onRecordingCompleteRef.current?.(uri);
            } catch (err) {
                console.error('[useMicrophone] AudioRecord stop error:', err);
                onRecordingCompleteRef.current?.(null);
            }
        }
    }, [clearAutoStop, isRecordingSupported]);

    // ── Start ─────────────────────────────────────────────────────────────

    const startRecording = useCallback(async () => {
        if (isRecordingRef.current) {
            console.warn('[useMicrophone] Already recording');
            return;
        }

        // Ensure mic permission
        if (permissionStatus !== 'granted') {
            const { status } = await Audio.requestPermissionsAsync();
            setPermissionStatus(status);
            if (status !== 'granted') return;
        }

        const srPerm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!srPerm.granted) {
            console.warn('[useMicrophone] SR permission not granted');
            return;
        }

        try {
            setTranscript('');
            setIsRecording(true);
            onRecordingStartRef.current?.();

            // Configure audio mode for iOS recording
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            if (isRecordingSupported) {
                ExpoSpeechRecognitionModule.start({
                    lang: 'en-US',
                    interimResults: true,
                    continuous: false,          // auto-stops on silence → triggers 'end'/'audioend'
                    recordingOptions: {
                        persist: true,          // saves the audio file; uri arrives in 'audioend'
                        outputFileName: `pronunciation_${Date.now()}.wav`,
                    },
                });
            } else {
                AudioRecord.start();
            }

            // Safety timeout
            autoStopTimerRef.current = setTimeout(() => {
                stopRecording();
            }, MAX_RECORDING_TIME_SECONDS * 1000);

        } catch (err) {
            console.error('[useMicrophone] Failed to start:', err);
            setIsRecording(false);
        }
    }, [permissionStatus, stopRecording, isRecordingSupported]);

    // ── Cleanup ───────────────────────────────────────────────────────────

    useEffect(() => {
        return () => {
            clearAutoStop();
            if (isRecordingRef.current) {
                if (isRecordingSupported) {
                    try { ExpoSpeechRecognitionModule.stop(); } catch (_) { }
                } else {
                    try { AudioRecord.stop(); } catch (_) { }
                }
            }
        };
    }, [clearAutoStop, isRecordingSupported]);

    return { isRecording, transcript, startRecording, stopRecording, permissionStatus };
};