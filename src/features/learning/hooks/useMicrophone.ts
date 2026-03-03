import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import AudioRecord from 'react-native-audio-record';

// Constant for max recording time (30 seconds)
const MAX_RECORDING_TIME_SECONDS = 30;

export const useMicrophone = (
    onRecordingComplete?: (uri: string | null) => void,
    onRecordingStart?: () => void
) => {
    const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    // Timer ref to clear timeout on stop
    const autoStopTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Store callbacks in refs to avoid stale closures
    const onRecordingCompleteRef = useRef(onRecordingComplete);
    const onRecordingStartRef = useRef(onRecordingStart);

    useEffect(() => {
        onRecordingCompleteRef.current = onRecordingComplete;
        onRecordingStartRef.current = onRecordingStart;
    }, [onRecordingComplete, onRecordingStart]);

    // Initial permissions check and AudioRecord initialization
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Audio.requestPermissionsAsync();

                setPermissionStatus(status);

                if (status === 'granted') {
                    AudioRecord.init({
                        sampleRate: 16000,
                        channels: 1,
                        bitsPerSample: 16,
                        audioSource: 6, // 6 = VoiceRecognition
                        wavFile: 'audio.wav'
                    });
                }
            } catch (err) {
                console.error("Failed to request permissions or init recorder:", err);
            }
        })();
    }, []);

    const stopRecording = useCallback(async () => {


        // Clear auto-stop timer if it exists
        if (autoStopTimerRef.current) {
            clearTimeout(autoStopTimerRef.current);
            autoStopTimerRef.current = null;
        }

        try {
            // Stop recording and get the file path
            let uri = await AudioRecord.stop();


            if (!uri.startsWith('file://')) {
                uri = 'file://' + uri;
            }

            setIsRecording(false);

            // Reset audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: false,
            });

            if (onRecordingCompleteRef.current) {
                onRecordingCompleteRef.current(uri);
            }
            return uri;
        } catch (err) {
            console.error("Failed to stop recording", err);
            setIsRecording(false);
            if (onRecordingCompleteRef.current) {
                onRecordingCompleteRef.current(null);
            }
            return null;
        }
    }, []);

    const startRecording = useCallback(async () => {


        if (permissionStatus !== 'granted') {
            const { status } = await Audio.requestPermissionsAsync();
            setPermissionStatus(status);
            if (status !== 'granted') return;

            // Re-init if permission was just granted
            AudioRecord.init({
                sampleRate: 16000,
                channels: 1,
                bitsPerSample: 16,
                audioSource: 6,
                wavFile: 'audio.wav'
            });
        }

        if (isRecording) {
            console.warn("Already recording");
            return;
        }

        try {
            // Configure audio mode for recording
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            AudioRecord.start();
            setIsRecording(true);


            if (onRecordingStartRef.current) onRecordingStartRef.current();

            // Auto-stop timer
            autoStopTimerRef.current = setTimeout(() => {

                stopRecording();
            }, MAX_RECORDING_TIME_SECONDS * 1000);

        } catch (err) {
            console.error("Failed to start recording", err);
            setIsRecording(false);
        }
    }, [permissionStatus, stopRecording, isRecording]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Cleanup logic if needed. 
            // AudioRecord doesn't have a generic cleanup other than stop,
            // but we can ensure the timer is cleared.
            if (autoStopTimerRef.current) {
                clearTimeout(autoStopTimerRef.current);
            }
        };
    }, []);

    return {
        isRecording,
        startRecording,
        stopRecording,
        permissionStatus
    };
};