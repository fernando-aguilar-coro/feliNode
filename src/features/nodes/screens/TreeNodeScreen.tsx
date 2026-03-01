import React, { useRef, useMemo } from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNodes } from '../hooks/useNodes';
import { TreeNode } from '../types/NodeTypes';
import { useNavigation } from '@react-navigation/native';
import { TreeCanvas } from '../components/TreeCanvas';
import { PannableCanvasRef } from '../components/PannableCanvas';
import { useAppTheme } from '../../../theme/ThemeContext';
import { audioService } from '../../settings/services/audioService';
import { StreakBadge } from '../../gamification/components/StreakBadge';
import { CurrencyBadge } from '../../gamification/components/CurrencyBadge';
import { useSettingsStore } from '../../../store/SettingsStore';

export const TreeNodeScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<any>();
    const showStreak = useSettingsStore(state => state.showStreak);
    const { nodes, links, canvasWidth, canvasHeight, isLoading, error } = useNodes(400, 600);
    const canvasRef = useRef<PannableCanvasRef>(null);

    const handleNodePress = (node: TreeNode) => {
        audioService.playClickSound();
        if (node.status !== 'locked') {
            navigation.navigate('Lesson', { lessonId: node.id });
        } else {
            console.log('Lesson is locked');
        }
    };

    const handleResetView = () => {
        audioService.playClickSound();
        canvasRef.current?.reset();
    };

    const navigateToStreakDetails = () => {
        audioService.playClickSound();
        navigation.navigate('StreakDetails');
    };

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            overflow: 'hidden',
        },
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
        },
        errorText: {
            color: theme.colors.text,
        },
        fab: {
            position: 'absolute',
            bottom: 30,
            right: 30,
            backgroundColor: theme.colors.primary,
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.colors.black,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
        },
        topRightContainer: {
            position: 'absolute',
            right: 16,
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 8,
            zIndex: 10,
        },
    }), [theme]);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TreeCanvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                nodes={nodes}
                links={links}
                onNodePress={handleNodePress}
            />

            <View style={styles.topRightContainer} pointerEvents="box-none">
                {showStreak && (
                    <TouchableOpacity
                        onPress={navigateToStreakDetails}
                        activeOpacity={0.8}
                    >
                        <StreakBadge />
                    </TouchableOpacity>
                )}
                <CurrencyBadge />
            </View>

            {/* Reset View FAB */}
            <TouchableOpacity style={styles.fab} onPress={handleResetView} activeOpacity={0.7}>
                <MaterialIcons name="my-location" size={24} color={theme.colors.white} />
            </TouchableOpacity>
        </View>
    );
};
