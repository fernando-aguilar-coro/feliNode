import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useNodesStore } from '../../../store/NodesStore';
import { useAppTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { PathNode } from '../components/PathNode';
import { ModuleHeader } from '../components/ModuleHeader';
import { PathConnector } from '../components/PathConnector';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Canvas } from '@shopify/react-native-skia';

import { usePathLayout, PATH_CONSTANTS } from '../hooks/usePathLayout';

const { ITEM_HEIGHT } = PATH_CONSTANTS;
const HEADER_HEIGHT = 240;

const getModuleColor = (index: number, isDark: boolean) => {
    const colors = isDark
        ? ['#151414ff', '#424040ff']
        : ['#ffffffff', '#f2f5fdff'];
    return colors[Math.abs(index % 2)];
};

type PathItem =
    | { type: 'header'; id: string; title: string; description?: string; index: number }
    | { type: 'lesson'; id: string; data: any; translateX: number };

export const CoursePathScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<any>();
    const { modules, isLoading } = useModuleProgress();
    const isSyncingData = useNodesStore(state => state.isSyncingData);
    const syncProgress = useNodesStore(state => state.syncProgress);
    const listRef = useRef<FlatList>(null);
    const { getPoint, ITEM_HEIGHT } = usePathLayout();

    const bgColors: readonly [string, string, ...string[]] = useMemo(() => {
        return theme.dark
            ? ['#0D0D0D', '#141414']
            : ['#FFFFFF', '#FAFAFA'];
    }, [theme.dark]);

    const flattenedData = useMemo(() => {
        const result: (PathItem & {
            backgroundColor: string;
            prevBackgroundColor?: string;
            moduleIndex: number;
            lessonIndex?: number;
            isFirstInModule?: boolean;
            isFirstEver?: boolean;
        })[] = [];

        let globalLessonIndex = 0;
        let currentFound = false;

        const sortedModules = [...modules].sort((a, b) => a.order_index - b.order_index);

        sortedModules.forEach((mod, modIdx) => {
            const moduleBg = getModuleColor(modIdx, theme.dark);
            const prevModuleBg = modIdx === 0 ? moduleBg : getModuleColor(modIdx - 1, theme.dark);

            result.push({
                type: 'header',
                id: `module-${mod.id}`,
                title: mod.title,
                description: mod.description,
                index: modIdx + 1,
                moduleIndex: modIdx,
                backgroundColor: moduleBg,
                prevBackgroundColor: prevModuleBg
            });

            const sortedLessons = [...mod.lessons].sort((a, b) => a.order_index - b.order_index);

            sortedLessons.forEach((lesson, lessonInModIdx) => {
                let status: 'completed' | 'available' | 'current' = lesson.status;

                if (status === 'available' && !currentFound) {
                    status = 'current';
                    currentFound = true;
                }

                const point = getPoint(globalLessonIndex);
                const translateX = point.translateX;

                result.push({
                    type: 'lesson',
                    id: lesson.id,
                    data: { ...lesson, status },
                    translateX,
                    moduleIndex: modIdx,
                    backgroundColor: moduleBg,
                    lessonIndex: globalLessonIndex,
                    isFirstInModule: lessonInModIdx === 0,
                    isFirstEver: globalLessonIndex === 0
                });

                globalLessonIndex++;
            });
        });

        return result;
    }, [modules, theme.dark, getPoint]);

    const handleLessonPress = (lessonId: string) => {
        navigation.navigate('Lesson', { lessonId });
    };

    const getItemLayout = (data: any, index: number) => {
        let offset = 0;
        for (let i = 0; i < index; i++) {
            const item = data[i];
            offset += item.type === 'header' ? HEADER_HEIGHT : ITEM_HEIGHT;
        }
        const length = data[index].type === 'header' ? HEADER_HEIGHT : ITEM_HEIGHT;
        return { length, offset, index };
    };

    const hasScrolledRef = useRef(false);
    useEffect(() => {
        if (!isLoading && flattenedData.length > 0 && !hasScrolledRef.current) {
            const currentIndex = flattenedData.findIndex(
                item => item.type === 'lesson' && item.data.status === 'current'
            );

            if (currentIndex !== -1) {
                hasScrolledRef.current = true;
                // Use a small timeout to ensure the list is fully rendered
                setTimeout(() => {
                    listRef.current?.scrollToIndex({
                        index: currentIndex,
                        animated: true,
                        viewPosition: 0.5
                    });
                }, 100);
            }
        }
    }, [isLoading, flattenedData]);

    if (modules.length === 0 && (isLoading || isSyncingData)) {
        if (isSyncingData) {
            return (
                <LinearGradient colors={bgColors} style={styles.center}>
                    <View style={styles.progressContainer}>
                        <AppText weight="bold" color={theme.colors.text} align="center">
                            Preparando tus lecciones...
                        </AppText>
                        <View style={[styles.progressBarBackground, { backgroundColor: theme.dark ? '#333' : '#E5E5EA' }]}>
                            <View style={[styles.progressBarFill, { width: `${Math.max(5, syncProgress * 100)}%`, backgroundColor: theme.colors.primary }]} />
                        </View>
                        <AppText variant="sm" color={theme.colors.textSecondary} align="center">
                            {Math.round(syncProgress * 100)}%
                        </AppText>
                    </View>
                </LinearGradient>
            );
        }
        return (
            <LinearGradient colors={bgColors} style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </LinearGradient>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={bgColors} style={StyleSheet.absoluteFill} />
            <FlatList
                ref={listRef}
                data={flattenedData}
                keyExtractor={(item) => item.id}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        listRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.5 });
                    });
                }}
                renderItem={({ item }) => {
                    if (item.type === 'header') {
                        return (
                            <View style={{ backgroundColor: item.backgroundColor, height: HEADER_HEIGHT, justifyContent: 'center', zIndex: 10 }}>
                                <View style={[StyleSheet.absoluteFill, { backgroundColor: item.prevBackgroundColor, bottom: '50%' }]} />
                                <ModuleHeader
                                    title={item.title}
                                    description={item.description}
                                    index={item.index}
                                />
                            </View>
                        );
                    }

                    // Never draw a connector for the first lesson of a module —
                    // that crossing through the header was causing the weird effects.
                    const showConnector = item.lessonIndex !== undefined
                        && item.lessonIndex > 0
                        && !item.isFirstInModule;

                    return (
                        <View style={[styles.lessonItemContainer, { backgroundColor: item.backgroundColor, zIndex: 20 }]}>
                            <View style={[styles.nodeWrapper, { transform: [{ translateX: item.translateX }] }]}>
                                <PathNode
                                    lesson={item.data}
                                    onPress={handleLessonPress}
                                />
                            </View>
                            {showConnector && (
                                <View style={styles.connectorOverlay} pointerEvents="none">
                                    <Canvas style={{ flex: 1 }} pointerEvents="none">
                                        <PathConnector
                                            index={item.lessonIndex!}
                                            color={item.data.status === 'completed' ? theme.colors.primary : (theme.dark ? '#2C2C2E' : '#D1D1D6')}
                                        />
                                    </Canvas>
                                </View>
                            )}
                        </View>
                    );
                }}
                getItemLayout={getItemLayout}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: ITEM_HEIGHT,
    },
    nodeWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    lessonItemContainer: {
        width: '100%',
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    connectorOverlay: {
        position: 'absolute',
        top: -ITEM_HEIGHT / 2,
        left: 0,
        right: 0,
        height: ITEM_HEIGHT,
    },
    progressContainer: {
        width: '80%',
        alignItems: 'center',
        gap: 16,
    },
    progressBarBackground: {
        width: '100%',
        height: 12,
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 6,
    }
});
