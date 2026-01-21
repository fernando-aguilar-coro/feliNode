import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioRecorder, requestRecordingPermissionsAsync, setAudioModeAsync, RecordingOptions, IOSOutputFormat, AudioQuality } from 'expo-audio';

// Optimized Configuration for Azure Speech (16kHz, Mono, WAV/PCM)
const AUDIO_PRESET: RecordingOptions = {
    extension: '.wav',
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 256000,
    ios: {
        outputFormat: IOSOutputFormat.LINEARPCM,
        audioQuality: AudioQuality.MAX,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
    android: {
        extension: '.wav',
        outputFormat: 'default' as any,
        audioEncoder: 'default' as any,
        sampleRate: 16000,
    },
    web: { mimeType: 'audio/wav', bitsPerSecond: 128000 },
};

export const useMicrophone = (maxTimeSeconds: number = 30, onRecordingComplete?: (uri: string | null) => void) => {
    const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const audioRecorder = useAudioRecorder(AUDIO_PRESET);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const onRecordingCompleteRef = useRef(onRecordingComplete);

    useEffect(() => { onRecordingCompleteRef.current = onRecordingComplete; }, [onRecordingComplete]);

    // Initial permissions check
    useEffect(() => {
        (async () => {
            try {
                const { status } = await requestRecordingPermissionsAsync();
                console.log("Microphone permission status:", status);
                setPermissionStatus(status);
            } catch (err) {
                console.error("Failed to request permissions:", err);
            }
        })();
    }, []);

    const stopRecording = useCallback(async () => {
        console.log("Stopping recording...");
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (!isRecording && !audioRecorder.isRecording) { // Check both for safety
            console.warn("Attempted to stop but not recording");
            return null;
        }

        try {
            await audioRecorder.stop();
            const uri = audioRecorder.uri;
            console.log("Recording stopped, URI:", uri);

            await setAudioModeAsync({ allowsRecording: false });
            setIsRecording(false);

            if (onRecordingCompleteRef.current) onRecordingCompleteRef.current(uri);
            return uri;
        } catch (err) {
            console.error("Failed to stop recording", err);
            setIsRecording(false); // Force reset state even on error
            return null;
        }
    }, [audioRecorder, isRecording]);

    const startRecording = useCallback(async () => {
        console.log("Starting recording... Permission:", permissionStatus);

        // If permission is not yet determined, try to ask again or return
        if (permissionStatus !== 'granted') {
            const { status } = await requestRecordingPermissionsAsync();
            setPermissionStatus(status);
            if (status !== 'granted') {
                console.warn("Permissions not granted");
                return;
            }
        }

        if (audioRecorder.isRecording || isRecording) {
            console.warn("Already recording");
            return;
        }

        // Clear any existing timer just in case
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        try {
            await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
            audioRecorder.record();
            setIsRecording(true);
            console.log("Recording started");

            // Auto-stop timer
            timerRef.current = setTimeout(() => {
                console.log(`Max recording time (${maxTimeSeconds}s) reached.`);
                stopRecording();
            }, maxTimeSeconds * 1000);

        } catch (err) {
            console.error("Failed to start recording", err);
            setIsRecording(false);
        }
    }, [permissionStatus, audioRecorder, maxTimeSeconds, stopRecording, isRecording]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (audioRecorder.isRecording) {
                console.log("Cleanup: stopping recorder");
                audioRecorder.stop().catch(e => console.error("Cleanup error", e));
            }
        };
    }, [audioRecorder]);

    return {
        isRecording, // Return local state which guarantees re-render
        startRecording,
        stopRecording,
        permissionStatus
    };
};