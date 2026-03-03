import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { AppText } from '../../../components';
import { theme } from '../../../theme';

interface AudioPlayerProps {
    uri: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ uri }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Cleanup sound on unmount or when sound changes
    useEffect(() => {
        return () => {
            if (sound) {

                sound.unloadAsync();
            }
        };
    }, [sound]);

    // Load sound when URI changes
    useEffect(() => {
        let isMounted = true;

        const loadSound = async () => {
            if (!uri) return;

            try {
                // Previous sound cleanup handled by cleanup effect mostly, 
                // but if we are replacing 'sound' state, the old one needs unloading.
                // However, the cleanup effect runs on dependnecy change (sound change), 
                // so it might be cleaner to just create new one and let setSound trigger cleanup of old one?
                // Actually, cleanup effect runs on unmount OR before re-running effect due to dependency change.
                // But setSound makes 'sound' change. 
                // Let's rely on React cleanup for the previous state instance? 
                // No, we need to be careful. The 'sound' variable in the effect cleanup is the OLD state.
                // So yes, simple cleanup effect is correct.


                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri },
                    { shouldPlay: false },
                    (status) => {
                        if (status.isLoaded) {
                            setIsPlaying(status.isPlaying);
                            if (status.didJustFinish) {
                                newSound.setPositionAsync(0);
                                newSound.pauseAsync(); // Ensure state update reflects paused
                            }
                        }
                    }
                );

                if (isMounted) {
                    setSound(newSound);
                } else {
                    newSound.unloadAsync();
                }

            } catch (error) {
                console.error("Error loading sound", error);
            }
        };

        if (uri) loadSound();

        return () => { isMounted = false; };
    }, [uri]);


    const togglePlayback = async () => {
        if (!sound) return;

        try {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
        } catch (error) {
            console.error("Error toggling playback", error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={togglePlayback}
                activeOpacity={0.7}
                disabled={!sound}
            >
                <MaterialCommunityIcons
                    name={isPlaying ? "pause" : "play"}
                    size={32}
                    color="#FFFFFF"
                />
            </TouchableOpacity>
            <AppText style={styles.text} variant="sm">
                {isPlaying ? "Reproduciendo..." : "Escuchar grabación"}
            </AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginVertical: 10,
    },
    button: {
        backgroundColor: theme.colors.primary,
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    text: {
        color: theme.colors.text,
        fontWeight: '500',
    }
});
