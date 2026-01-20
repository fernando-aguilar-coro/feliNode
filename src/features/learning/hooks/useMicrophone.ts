import { useState, useEffect, useCallback } from 'react';
import {
    useAudioRecorder,
    RecordingPresets,
    requestRecordingPermissionsAsync,
    setAudioModeAsync,
    PermissionStatus,
    RecordingOptions,
    IOSOutputFormat,
    AudioQuality
} from 'expo-audio';

// Constants for permissions
const PERMISSION_GRANTED = 'granted';

const WAV_RECORDING_PRESET: RecordingOptions = {
    isMeteringEnabled: true,
    extension: '.wav',
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 256000,
    android: {
        extension: '.wav',
        outputFormat: 'default' as any, // Cast to avoid strict type issues if 'default' isn't fully overlapping with enum in some versions
        audioEncoder: 'default' as any,
        sampleRate: 16000,
    },
    ios: {
        extension: '.wav',
        outputFormat: IOSOutputFormat.LINEARPCM,
        audioQuality: AudioQuality.MAX,
        sampleRate: 16000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
    web: {
        mimeType: 'audio/wav',
        bitsPerSecond: 128000,
    },
};

/**
 * Hook to manage microphone functionality (recording, stopping, permissions).
 * Migrated to use 'expo-audio'.
 */
export const useMicrophone = () => {
    // Permission state
    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | null>(null);

    // State to track if we are logically recording (for UI)
    const [isRecording, setIsRecording] = useState(false);

    // State for the recorded URI
    const [recordedUri, setRecordedUri] = useState<string | null>(null);

    // Initialize recorder
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY, (status) => {
        // Optional: you can sync isRecording with status.isRecording here if desired
        // but for now we manage it manually for simplicity or use the recorder state hook if needed.
    });

    /**
     * Request microphone permissions on mount.
     */
    useEffect(() => {
        const getPermissions = async () => {
            try {
                // Check or request permissions
                const { status } = await requestRecordingPermissionsAsync();
                setPermissionStatus(status);
            } catch (err) {
                console.error("Error requesting permissions:", err);
            }
        };
        getPermissions();
    }, []);

    /**
     * Starts audio recording.
     */
    const startRecording = useCallback(async () => {
        try {
            // Check permissions
            if (permissionStatus !== PERMISSION_GRANTED) {
                const { status } = await requestRecordingPermissionsAsync();
                setPermissionStatus(status);
                if (status !== PERMISSION_GRANTED) {
                    console.warn("Microphone permission not granted");
                    return;
                }
            }

            // Configure audio mode
            await setAudioModeAsync({
                allowsRecording: true,
                playsInSilentMode: true,
            });

            console.log('Starting recording...');
            // Prepare and record
            // Use same preset as hook init or explicit
            await audioRecorder.prepareToRecordAsync(WAV_RECORDING_PRESET);
            audioRecorder.record();

            setIsRecording(true);
            setRecordedUri(null); // Clear previous
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }, [permissionStatus, audioRecorder]);

    /**
     * Stops current recording and returns the URI.
     */
    const stopRecording = useCallback(async () => {
        if (!isRecording) return null;

        console.log('Stopping recording...');
        setIsRecording(false);
        try {
            await audioRecorder.stop();
            const uri = audioRecorder.uri;

            // Reset audio mode
            await setAudioModeAsync({
                allowsRecording: false,
            });

            setRecordedUri(uri);
            console.log('Recording stopped and saved at', uri);
            return uri;
        } catch (err) {
            console.error('Failed to stop recording', err);
            return null;
        }
    }, [isRecording, audioRecorder]);

    return {
        isRecording,
        recordedUri,
        permissionStatus,
        startRecording,
        stopRecording,
    };
};
