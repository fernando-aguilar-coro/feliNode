import React, {
    useMemo,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { useModuleProgress } from '../hooks/useModuleProgress';
import { useNodesStore } from '../../../store/NodesStore';
import { useAppTheme } from '../../../theme/ThemeContext';
import { AppText } from '../../../components/AppText';
import { ModuleHeader } from '../components/ModuleHeader';
import { LessonItem } from '../components/LessonItem';
import { usePathLayout, PATH_CONSTANTS } from '../hooks/usePathLayout';

// ─── Constants ────────────────────────────────────────────────────────────────

const HEADER_HEIGHT = 240;
const { ITEM_HEIGHT } = PATH_CONSTANTS;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getModuleColor = (index: number, isDark: boolean): string => {
    const colors = isDark
        ? ['#151414ff', '#424040ff']
        : ['#ffffffff', '#f2f5fdff'];
    return colors[Math.abs(index % 2)];
};

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonStatus = 'completed' | 'available' | 'current';

type HeaderItem = {
    type: 'header';
    id: string;
    title: string;
    description?: string;
    index: number;
    moduleIndex: number;
    backgroundColor: string;
    prevBackgroundColor: string;
};

type LessonItem_ = {
    type: 'lesson';
    id: string;
    data: {
        id: string;
        title: string;
        status: 'available' | 'completed' | 'current';
    };
    translateX: number;
    moduleIndex: number;
    backgroundColor: string;
    lessonIndex: number;
    isFirstInModule: boolean;
};

type PathItem = HeaderItem | LessonItem_;

// ─── Component ────────────────────────────────────────────────────────────────

export const CoursePathScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation<any>();
    const { modules, isLoading } = useModuleProgress();
    const isSyncingData = useNodesStore(state => state.isSyncingData);
    const syncProgress = useNodesStore(state => state.syncProgress);
    const { getPoint, ITEM_HEIGHT: itemHeight } = usePathLayout();

    const listRef = useRef<FlatList>(null);
    const hasScrolledRef = useRef(false);

    // ── Background gradient ──────────────────────────────────────────────────

    const bgColors = useMemo<readonly [string, string, ...string[]]>(
        () => theme.dark
            ? ['#0D0D0D', '#141414']
            : ['#FFFFFF', '#FAFAFA'],
        [theme.dark],
    );

    // ── Flatten modules → list items ─────────────────────────────────────────

    const flattenedData = useMemo<PathItem[]>(() => {
        const result: PathItem[] = [];
        let globalLessonIndex = 0;
        let currentFound = false;

        const sortedModules = [...modules].sort((a, b) => a.order_index - b.order_index);

        for (let modIdx = 0; modIdx < sortedModules.length; modIdx++) {
            const mod = sortedModules[modIdx];
            const moduleBg = getModuleColor(modIdx, theme.dark);
            const prevModuleBg = modIdx === 0
                ? moduleBg
                : getModuleColor(modIdx - 1, theme.dark);

            result.push({
                type: 'header',
                id: `module-${mod.id}`,
                title: mod.title,
                description: mod.description,
                index: modIdx + 1,
                moduleIndex: modIdx,
                backgroundColor: moduleBg,
                prevBackgroundColor: prevModuleBg,
            });

            const sortedLessons = [...mod.lessons].sort((a, b) => a.order_index - b.order_index);

            for (let lessonInModIdx = 0; lessonInModIdx < sortedLessons.length; lessonInModIdx++) {
                const lesson = sortedLessons[lessonInModIdx];

                let status: LessonStatus = lesson.status;
                if (status === 'available' && !currentFound) {
                    status = 'current';
                    currentFound = true;
                }

                result.push({
                    type: 'lesson',
                    id: lesson.id,
                    data: { ...lesson, status },
                    translateX: getPoint(globalLessonIndex).translateX,
                    moduleIndex: modIdx,
                    backgroundColor: moduleBg,
                    lessonIndex: globalLessonIndex,
                    isFirstInModule: lessonInModIdx === 0,
                });

                globalLessonIndex++;
            }
        }

        return result;
    }, [modules, theme.dark, getPoint]);

    // ── Precompute offsets → O(1) getItemLayout ──────────────────────────────

    const itemOffsets = useMemo(() => {
        const offsets: number[] = [];
        let offset = 0;
        for (const item of flattenedData) {
            offsets.push(offset);
            offset += item.type === 'header' ? HEADER_HEIGHT : itemHeight;
        }
        offsets.push(offset); // total height sentinel
        return offsets;
    }, [flattenedData, itemHeight]);

    const getItemLayout = useCallback(
        (_: any, index: number) => ({
            length: flattenedData[index]?.type === 'header' ? HEADER_HEIGHT : itemHeight,
            offset: itemOffsets[index] ?? 0,
            index,
        }),
        [flattenedData, itemOffsets, itemHeight],
    );

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleLessonPress = useCallback((lessonId: string) => {
        navigation.navigate('Lesson', { lessonId });
    }, [navigation]);

    const handleScrollToIndexFailed = useCallback(({ index }: { index: number }) => {
        setTimeout(() => {
            listRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5,
            });
        }, 500);
    }, []);

    // ── Auto-scroll to current lesson ────────────────────────────────────────

    useEffect(() => {
        if (isLoading || flattenedData.length === 0 || hasScrolledRef.current) return;

        const currentIndex = flattenedData.findIndex(
            item => item.type === 'lesson' && item.data.status === 'current',
        );

        if (currentIndex === -1) return;

        hasScrolledRef.current = true;
        const timer = setTimeout(() => {
            listRef.current?.scrollToIndex({
                index: currentIndex,
                animated: true,
                viewPosition: 0.5,
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [isLoading, flattenedData]);

    // ── renderItem ───────────────────────────────────────────────────────────

    const renderItem = useCallback(({ item }: { item: PathItem }) => {
        if (item.type === 'header') {
            return (
                <View
                    style={[
                        styles.headerContainer,
                        { backgroundColor: item.backgroundColor },
                    ]}
                >
                    {/* Top-half filled with previous module color for smooth transition */}
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: item.prevBackgroundColor,
                                bottom: '50%',
                            },
                        ]}
                    />
                    <ModuleHeader
                        title={item.title}
                        description={item.description}
                        index={item.index}
                    />
                </View>
            );
        }

        // Connectors are hidden for the first lesson of every module to avoid
        // overdrawing through the module header.
        const showConnector =
            item.lessonIndex > 0 &&
            !item.isFirstInModule;

        const connectorColor =
            item.data.status === 'completed'
                ? theme.colors.primary
                : theme.dark ? '#2C2C2E' : '#D1D1D6';

        return (
            <LessonItem
                item={item}
                showConnector={showConnector}
                connectorColor={connectorColor}
                onPress={handleLessonPress}
                itemHeight={itemHeight}
            />
        );
    }, [theme, handleLessonPress, itemHeight]);

    // ── Loading / syncing states ──────────────────────────────────────────────

    if (modules.length === 0 && (isLoading || isSyncingData)) {
        return (
            <LinearGradient colors={bgColors} style={styles.center}>
                {isSyncingData ? (
                    <View style={styles.progressContainer}>
                        <AppText weight="bold" color={theme.colors.text} align="center">
                            Preparando tus lecciones...
                        </AppText>
                        <View
                            style={[
                                styles.progressBarBackground,
                                { backgroundColor: theme.dark ? '#333' : '#E5E5EA' },
                            ]}
                        >
                            <View
                                style={[
                                    styles.progressBarFill,
                                    {
                                        width: `${Math.max(5, syncProgress * 100)}%`,
                                        backgroundColor: theme.colors.primary,
                                    },
                                ]}
                            />
                        </View>
                        <AppText variant="sm" color={theme.colors.textSecondary} align="center">
                            {Math.round(syncProgress * 100)}%
                        </AppText>
                    </View>
                ) : (
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                )}
            </LinearGradient>
        );
    }

    // ── Main render ───────────────────────────────────────────────────────────

    return (
        <View style={styles.container}>
            <LinearGradient colors={bgColors} style={StyleSheet.absoluteFill} />
            <FlatList
                ref={listRef}
                data={flattenedData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                getItemLayout={getItemLayout}
                onScrollToIndexFailed={handleScrollToIndexFailed}
                // ── Performance ──────────────────────────────────────────────
                removeClippedSubviews
                maxToRenderPerBatch={8}
                updateCellsBatchingPeriod={50}
                windowSize={5}
                initialNumToRender={12}
                // ─────────────────────────────────────────────────────────────
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    headerContainer: {
        height: HEADER_HEIGHT,
        justifyContent: 'center',
        zIndex: 10,
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
    },
});