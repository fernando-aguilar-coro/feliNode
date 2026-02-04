import React, { useRef, useMemo } from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNodes } from '../hooks/useNodes';
import { TreeNode } from '../types/NodeTypes';
import { useNavigation } from '@react-navigation/native';
import { TreeCanvas } from '../components/TreeCanvas';
import { PannableCanvasRef } from '../components/PannableCanvas';
import { useAppTheme } from '../../../theme/ThemeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Canvas size
const CANVAS_WIDTH = SCREEN_WIDTH * 2;
const CANVAS_HEIGHT = SCREEN_HEIGHT * 1.5;

export const TreeNodeScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<any>();
    const { nodes, links, isLoading, error } = useNodes(CANVAS_WIDTH, CANVAS_HEIGHT);
    const canvasRef = useRef<PannableCanvasRef>(null);

    const handleNodePress = (node: TreeNode) => {
        if (node.status !== 'locked') {
            navigation.navigate('Lesson', { lessonId: node.id });
        } else {
            console.log('Lesson is locked');
        }
    };

    const handleResetView = () => {
        canvasRef.current?.reset();
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
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                nodes={nodes}
                links={links}
                onNodePress={handleNodePress}
            />

            {/* Reset View FAB */}
            <TouchableOpacity style={styles.fab} onPress={handleResetView} activeOpacity={0.7}>
                <MaterialIcons name="my-location" size={24} color={theme.colors.white} />
            </TouchableOpacity>
        </View>
    );
};
