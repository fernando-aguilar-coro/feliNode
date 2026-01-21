import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { AppText } from '../../../components';
import { theme } from '../../../theme';

interface AudioPlayerProps {
    uri: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ uri }) => {
    const player = useAudioPlayer(uri);

    // expo-audio player object typically has a 'playing' property but it might not be reactive directly on the object property access in render.
    // However, the hook usually triggers re-renders on status change, or we need to subscribe.
    // Based on typical Expo Audio hook behavior (like useAudioRecorder in useMicrophone.ts),
    // let's try to trust the hook or use a simple toggle.

    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (player) {
            const subscription = player.addListener('playbackStatusUpdate', (status) => {
                setIsPlaying(status.playing);
                // Auto rewind if finished (optional, but good UX)
                if (status.didJustFinish) {
                    player.seekTo(0);
                    player.pause();
                }
            });
            return () => subscription.remove();
        }
    }, [player]);


    const togglePlayback = () => {
        if (player.playing) {
            player.pause();
        } else {
            player.play();
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={togglePlayback}
                activeOpacity={0.7}
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
