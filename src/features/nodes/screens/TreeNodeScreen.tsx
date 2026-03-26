import React, { useRef, useMemo, useCallback, useState } from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNodes } from '../hooks/useNodes';
import { TreeNode } from '../types/NodeTypes';
import { useNavigation } from '@react-navigation/native';
import { useNodesStore } from '../../../store/NodesStore';
import { TreeCanvas } from '../components/TreeCanvas';
import { PannableCanvasRef } from '../components/PannableCanvas';
import { useAppTheme } from '../../../theme/ThemeContext';
import { audioService } from '../../settings/services/audio.service';
import { ModuleStatsCards } from '../components/progress/ModuleStatsCards';

export const TreeNodeScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<any>();
    const { canvasWidth, canvasHeight, isLoading, error } = useNodes(400, 600);
    const canvasRef = useRef<PannableCanvasRef>(null);


    const handleNodePress = useCallback((node: TreeNode) => {
        audioService.playClickSound();
        navigation.navigate('Lesson', { lessonId: node.id });
    }, [navigation]);

    const handleResetView = () => {
        audioService.playClickSound();
        const nodes = useNodesStore.getState().nodes;
        if (nodes.length > 0) {
            // Find the lesson with highest order_index
            const latestNode = nodes.reduce((prev, current) => {
                return ((current.order_index ?? 0) > (prev.order_index ?? 0)) ? current : prev;
            }, nodes[0]);

            const windowDimensions = Dimensions.get('window');
            canvasRef.current?.centerOn(latestNode.x, latestNode.y, windowDimensions.width, windowDimensions.height);
        } else {
            canvasRef.current?.reset();
        }
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
                onNodePress={handleNodePress}
            />

            <View style={styles.topRightContainer} pointerEvents="box-none">
                <ModuleStatsCards orientation="column" />
            </View>

            {/* Reset View FAB */}
            <TouchableOpacity style={styles.fab} onPress={handleResetView} activeOpacity={0.7}>
                <MaterialIcons name="my-location" size={24} color={theme.colors.white} />
            </TouchableOpacity>
        </View>
    );
};
