import React, { useRef, useMemo, useCallback, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNodes } from '../hooks/useNodes';
import { TreeNode } from '../types/NodeTypes';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNodesStore } from '../../../store/NodesStore';
import { TreeCanvas } from '../components/TreeCanvas';
import { PannableCanvasRef } from '../components/PannableCanvas';
import { useAppTheme } from '../../../theme/ThemeContext';
import { audioService } from '../../settings/services/audio.service';
import { ModuleStatsCards } from '../components/progress/ModuleStatsCards';
import { getModuleProgressView, ModuleProgress } from '../services/ModuleProgress.service';
import { ModuleLessonsList } from '../components/ModuleLessonsList';
import { Modal, Portal, Button } from 'react-native-paper';


export const TreeNodeScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const { canvasWidth, canvasHeight, error } = useNodes(400, 600);
    const canvasRef = useRef<PannableCanvasRef>(null);

    const [selectedModule, setSelectedModule] = useState<ModuleProgress | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);


    const handleNodePress = useCallback(async (node: TreeNode) => {
        audioService.playClickSound();
        try {
            const allModules = await getModuleProgressView();
            const moduleData = allModules.find(m => m.id.toString() === node.id);
            if (moduleData) {
                setSelectedModule(moduleData);
                setIsModalVisible(true);
            }
        } catch (err) {
            console.error('Failed to load module lessons:', err);
        }
    }, []);

    const handleLessonPress = (lessonId: string) => {
        setIsModalVisible(false);
        audioService.playClickSound();
        navigation.navigate('Lesson', { lessonId });
    };

    const handleResetView = () => {
        audioService.playClickSound();
        const nodes = useNodesStore.getState().nodes;
        if (nodes.length > 0) {
            // Find completed nodes
            const completedNodes = nodes.filter(n => n.status === 'completed');

            let latestNode;
            if (completedNodes.length > 0) {
                // Find the completed node with highest order_index
                latestNode = completedNodes.reduce((prev, current) => {
                    return ((current.order_index ?? 0) > (prev.order_index ?? 0)) ? current : prev;
                }, completedNodes[0]);
            } else {
                // Fallback: nothing completed? start at beginning (lowest order_index)
                latestNode = nodes.reduce((prev, current) => {
                    return ((current.order_index ?? 0) < (prev.order_index ?? 0)) ? current : prev;
                }, nodes[0]);
            }

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
            bottom: Math.max(insets.bottom + 16, 30),
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
            top: Math.max(insets.top + 8, 16),
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
                <Text style={styles.errorText}>{t('nodes.tree.errorTitle')}: {error}</Text>
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

            {/* Lessons Modal */}
            <Portal>
                <Modal
                    visible={isModalVisible}
                    onDismiss={() => setIsModalVisible(false)}
                    contentContainerStyle={{
                        backgroundColor: theme.colors.background,
                        padding: 24,
                        margin: 20,
                        borderRadius: 16,
                    }}
                >
                    <Text style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginBottom: 24,
                        fontSize: 24,
                        color: theme.colors.text,
                    }}>
                        {selectedModule ? t('nodes.progress.module', { index: selectedModule.order_index, title: selectedModule.title }) : ''}
                    </Text>

                    <View style={{ maxHeight: 400 }}>
                        {selectedModule && (
                            <ModuleLessonsList
                                lessons={selectedModule.lessons}
                                onLessonPress={handleLessonPress}
                            />
                        )}
                    </View>

                    <View style={{ marginTop: 24, gap: 12 }}>
                        <Button
                            mode="contained"
                            onPress={() => setIsModalVisible(false)}
                            style={{ paddingVertical: 6 }}
                            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                        >
                            {t('common.close')}
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};
