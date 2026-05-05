import { useState, useCallback, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useNodesStore } from '../../../store/NodesStore';
import { audioService } from '../../settings/services/audio.service';
import { LessonService } from '../../learning/services/Lesson.service';

export const useModuleProgress = () => {
    const isFocused = useIsFocused();
    const modules = useNodesStore(state => state.modules);
    const isLoading = useNodesStore(state => state.isModulesLoading);
    const fetchModules = useNodesStore(state => state.fetchModules);

    const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

    const loadData = useCallback(async () => {
        await fetchModules();
        
        // Auto-expand first module if needed
        if (expandedModules.size === 0 && modules.length > 0) {
            setExpandedModules(new Set([modules[0].id]));
        }
    }, [fetchModules, modules.length, expandedModules.size]);

    useEffect(() => {
        if (isFocused) {
            loadData();
        }
    }, [isFocused, loadData]);

    const toggleModule = useCallback((moduleId: number) => {
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
    }, []);

    const markLessonAsCompleted = useCallback(async (lessonId: string) => {
        try {
            await LessonService.markAsCompletedManually(lessonId);
            await fetchModules(true); // Force reload after manual change
        } catch (error) {
            console.error('Failed to mark lesson as completed', error);
        }
    }, [fetchModules]);

    return {
        modules,
        isLoading,
        expandedModules,
        toggleModule,
        markLessonAsCompleted,
        refresh: () => fetchModules(true)
    };
};
