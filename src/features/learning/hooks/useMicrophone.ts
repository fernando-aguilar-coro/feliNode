import { useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';

/**
 * Hook to manage microphone functionality (recording, stopping, permissions).
 * Uses 'expo-av' for audio operations.
 */
export const useMicrophone = () => {
    // State to store the recording object
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    // State to track if recording is in progress
    const [isRecording, setIsRecording] = useState<boolean>(false);
    // State for permission status
    const [permissionResponse, setPermissionResponse] = useState<Audio.PermissionResponse | null>(null);
    // State for the recorded URI
    const [recordedUri, setRecordedUri] = useState<string | null>(null);

    /**
     * Request microphone permissions on mount.
     */
    useEffect(() => {
        const getPermissions = async () => {
            try {
                const response = await Audio.requestPermissionsAsync();
                setPermissionResponse(response);
            } catch (err) {
                console.error("Error requesting permissions:", err);
            }
        };
        getPermissions();
    }, []);

    /**
     * Cleanup: ensure recording is stopped and unloaded when host component unmounts.
     */
    useEffect(() => {
        return () => {
            if (recording) {
                recording.stopAndUnloadAsync().catch((err) => {
                    console.error("Error cleaning up recording:", err);
                });
            }
        };
    }, [recording]);

    /**
     * Starts audio recording after setting up Audio mode and checking permissions.
     */
    const startRecording = useCallback(async () => {
        try {
            // Check permissions before starting
            if (permissionResponse?.status !== 'granted') {
                const response = await Audio.requestPermissionsAsync();
                setPermissionResponse(response);
                if (response.status !== 'granted') {
                    console.warn("Microphone permission not granted");
                    return;
                }
            }

            // Configure Audio session for recording
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording...');
            // Create a new recording instance with high quality preset
            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(newRecording);
            setIsRecording(true);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }, [permissionResponse]);

    /**
     * Stops current recording and returns the URI of the recorded file.
     */
    const stopRecording = useCallback(async () => {
        if (!recording) return null;

        console.log('Stopping recording...');
        setIsRecording(false);
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            // Set audio mode back to defaults (disable recording capability for UI stability)
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });

            setRecording(null);
            setRecordedUri(uri);
            console.log('Recording stopped and saved at', uri);
            return uri;
        } catch (err) {
            console.error('Failed to stop recording', err);
            return null;
        }
    }, [recording]);

    return {
        isRecording,
        recordedUri,
        permissionStatus: permissionResponse?.status,
        startRecording,
        stopRecording,
    };
};
