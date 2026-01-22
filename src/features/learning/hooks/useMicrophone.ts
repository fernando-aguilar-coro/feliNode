import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

// Constant for max recording time (30 seconds)
const MAX_RECORDING_TIME_SECONDS = 30;

export const useMicrophone = (
    onRecordingComplete?: (uri: string | null) => void,
    onRecordingStart?: () => void
) => {
    const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    // Use ref for recording instance to allow access in closures (timers/cleanup)
    const recordingRef = useRef<Audio.Recording | null>(null);

    // Store callbacks in refs to avoid stale closures
    const onRecordingCompleteRef = useRef(onRecordingComplete);
    const onRecordingStartRef = useRef(onRecordingStart);

    useEffect(() => {
        onRecordingCompleteRef.current = onRecordingComplete;
        onRecordingStartRef.current = onRecordingStart;
    }, [onRecordingComplete, onRecordingStart]);

    // Initial permissions check
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Audio.requestPermissionsAsync();
                console.log("Microphone permission status:", status);
                setPermissionStatus(status);
            } catch (err) {
                console.error("Failed to request permissions:", err);
            }
        })();
    }, []);

    const stopRecording = useCallback(async () => {
        console.log("Stopping recording...");

        const recording = recordingRef.current;
        if (!recording) {
            console.warn("Attempted to stop but no recording instance found");
            return null;
        }

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            console.log("Recording stopped, URI:", uri);

            // Clean up ref
            recordingRef.current = null;
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
            recordingRef.current = null;
            if (onRecordingCompleteRef.current) {
                onRecordingCompleteRef.current(null);
            }
            return null;
        }
    }, []);

    const startRecording = useCallback(async () => {
        console.log("Starting recording... Permission:", permissionStatus);

        if (permissionStatus !== 'granted') {
            const { status } = await Audio.requestPermissionsAsync();
            setPermissionStatus(status);
            if (status !== 'granted') return;
        }

        if (isRecording || recordingRef.current) {
            console.warn("Already recording");
            return;
        }

        try {
            // Configure audio mode for recording
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // Create and start recording
            // HIGH_QUALITY preset uses .m4a/AAC on both iOS and Android (usually)
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            recordingRef.current = recording;
            setIsRecording(true);
            console.log("Recording started");

            if (onRecordingStartRef.current) onRecordingStartRef.current();

            // Auto-stop timer
            setTimeout(() => {
                if (recordingRef.current) {
                    console.log(`Max recording time (${MAX_RECORDING_TIME_SECONDS}s) reached.`);
                    stopRecording();
                }
            }, MAX_RECORDING_TIME_SECONDS * 1000);

        } catch (err) {
            console.error("Failed to start recording", err);
            setIsRecording(false);
        }
    }, [permissionStatus, stopRecording, isRecording]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recordingRef.current) {
                console.log("Cleanup: stopping recorder");
                recordingRef.current.stopAndUnloadAsync().catch(e => console.error("Cleanup error", e));
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