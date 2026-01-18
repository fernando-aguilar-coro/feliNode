import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMicrophone } from '../hooks/useMicrophone';

/**
 * Props for the Microfhone component.
 */
interface MicrophoneProps {
    /** Maximum recording time in seconds. Defaults to 30. */
    maxTimeSeconds?: number;
    /** Callback triggered when recording stops, returns the file URI. */
    onRecordingComplete?: (uri: string | null) => void;
}

/**
 * Visual component for the microphone.
 * Handles user interaction and maximum recording time logic.
 */
export const Microphone: React.FC<MicrophoneProps> = ({
    maxTimeSeconds = 30,
    onRecordingComplete
}) => {
    // Use the custom hook for recording logic
    const { isRecording, startRecording, stopRecording } = useMicrophone();
    // Ref to store the timer ID for automatic stopping
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Effect to handle the maximum recording time.
     * If isRecording starts, it sets a timeout to stop recording automatically.
     */
    useEffect(() => {
        if (isRecording) {
            // Start timer if recording begins
            timerRef.current = setTimeout(async () => {
                console.log(`Max recording time (${maxTimeSeconds}s) reached.`);
                const uri = await stopRecording();
                if (onRecordingComplete) onRecordingComplete(uri);
            }, maxTimeSeconds * 1000);
        } else {
            // Clear timer if recording stops manually
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        }

        // Cleanup timer on unmount
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isRecording, maxTimeSeconds, stopRecording, onRecordingComplete]);

    /**
     * Handles button press to start or stop recording.
     */
    const handlePress = async () => {
        if (isRecording) {
            const uri = await stopRecording();
            if (onRecordingComplete) onRecordingComplete(uri);
        } else {
            await startRecording();
        }
    };

    return (
        <View style={styles.container}>
            {/* Visual button for the microphone */}
            <TouchableOpacity
                onPress={handlePress}
                style={[styles.button, isRecording && styles.recordingButton]}
                activeOpacity={0.7}
            >
                <MaterialCommunityIcons
                    name={isRecording ? "stop" : "microphone"}
                    size={44}
                    color={isRecording ? "#FF5252" : "#FFFFFF"}
                />
            </TouchableOpacity>

            {/* Label indicating the current state */}
            <Text style={[styles.text, isRecording && styles.recordingText]}>
                {isRecording ? "Grabando..." : "Toca para hablar"}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#6C63FF', // Primary color
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        // Shadow for Android
        elevation: 6,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
    },
    recordingButton: {
        backgroundColor: '#FFE5E5', // Light red background when recording
        borderWidth: 2,
        borderColor: '#FF5252',
    },
    text: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    recordingText: {
        color: '#FF5252',
    }
});
