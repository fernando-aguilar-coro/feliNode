import { useState, useCallback, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useNodesStore } from '../../../store/NodesStore';
import { getModuleProgressView, ModuleProgress } from '../services/ModuleProgress.service';
import { audioService } from '../../settings/services/audio.service';

export const useModuleProgress = () => {
    const isFocused = useIsFocused();
    const modules = useNodesStore(state => state.modules);
    const isLoading = useNodesStore(state => state.isModulesLoading);
    const setModules = useNodesStore(state => state.setModules);
    const setModulesLoading = useNodesStore(state => state.setModulesLoading);

    const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

    const loadData = useCallback(async () => {
        if (useNodesStore.getState().modules.length === 0) {
            setModulesLoading(true);
        }
        try {
            const data = await getModuleProgressView();
            setModules(data);
            
            setExpandedModules(prev => {
                // Expand the first module by default if none are expanded
                if (data.length > 0 && prev.size === 0) {
                    return new Set([data[0].id]);
                }
                return prev;
            });
        } catch (error) {
            console.error('Failed to load module progress', error);
        } finally {
            setModulesLoading(false);
        }
    }, [setModules, setModulesLoading]);

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

    return {
        modules,
        isLoading,
        expandedModules,
        toggleModule,
        refresh: loadData
    };
};
