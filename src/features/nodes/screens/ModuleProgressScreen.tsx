import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useAppTheme } from '../../../theme/ThemeContext';
import { audioService } from '../../settings/services/audioService';
import { getModuleProgressView, ModuleProgress } from '../services/ModuleProgress.service';
import { ModuleAccordion } from '../components/list/ModuleAccordion';

export const ModuleProgressScreen = () => {
    const theme = useAppTheme();
    const isFocused = useIsFocused();

    const [modules, setModules] = useState<ModuleProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (isFocused) {
            loadData();
        }
    }, [isFocused]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await getModuleProgressView();
            setModules(data);
            if (data.length > 0 && expandedModules.size === 0) {
                // Expand the first module by default if none are expanded
                setExpandedModules(new Set([data[0].id]));
            }
        } catch (error) {
            console.error('Failed to load module progress', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleModule = (moduleId: number) => {
        audioService.playClickSound();
        setExpandedModules(prev => {
            const newSet = new Set(prev);
            if (newSet.has(moduleId)) {
                newSet.delete(moduleId);
            } else {
                newSet.add(moduleId);
            }
            return newSet;
        });
    };

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
        },
        listContent: {
            padding: 16,
            paddingBottom: 40,
        },
    }), [theme]);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={modules}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ModuleAccordion
                        module={item}
                        isExpanded={expandedModules.has(item.id)}
                        onToggle={toggleModule}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};
