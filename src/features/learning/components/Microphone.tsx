import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMicrophone } from '../hooks/useMicrophone';

interface MicrophoneProps {
    onRecordingComplete?: (uri: string | null) => void;
    onRecordingStart?: () => void;
}

export const Microphone: React.FC<MicrophoneProps> = ({ onRecordingComplete, onRecordingStart }) => {
    const { isRecording, startRecording, stopRecording } = useMicrophone(onRecordingComplete, onRecordingStart);

    const handlePress = () => isRecording ? stopRecording() : startRecording();

    return (
        <View style={styles.container}>
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
            <Text style={[styles.text, isRecording && styles.recordingText]}>
                {isRecording ? "Grabando..." : "Toca para hablar"}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
    button: {
        backgroundColor: '#6C63FF', width: 80, height: 80, borderRadius: 40,
        alignItems: 'center', justifyContent: 'center', elevation: 6,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27, shadowRadius: 4.65,
    },
    recordingButton: { backgroundColor: '#FFE5E5', borderWidth: 2, borderColor: '#FF5252' },
    text: { marginTop: 12, fontSize: 14, fontWeight: '600', color: '#666' },
    recordingText: { color: '#FF5252' }
});
