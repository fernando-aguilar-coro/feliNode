import { create } from 'zustand';
import { TreeNode, TreeLink } from '../features/nodes/types/NodeTypes';
import { ModuleProgress, getModuleProgressView } from '../features/nodes/services/ModuleProgress.service';

interface NodesStoreState {
    // Global Tree Data
    nodes: TreeNode[];
    links: TreeLink[];
    canvasWidth: number;
    canvasHeight: number;
    isTreeLoading: boolean;
    treeError: string | null;

    setTreeData: (nodes: TreeNode[], links: TreeLink[], width: number, height: number) => void;
    setTreeLoading: (loading: boolean) => void;
    setTreeError: (error: string | null) => void;

    // Global Modules Data
    modules: ModuleProgress[];
    isModulesLoading: boolean;
    setModules: (modules: ModuleProgress[]) => void;
    setModulesLoading: (loading: boolean) => void;

    // Sync state
    syncProgress: number;
    isSyncingData: boolean;
    setSyncProgress: (progress: number) => void;
    setIsSyncingData: (syncing: boolean) => void;

    fetchModules: (force?: boolean) => Promise<void>;
}

export const useNodesStore = create<NodesStoreState>((set) => ({
    nodes: [],
    links: [],
    canvasWidth: 400,
    canvasHeight: 600,
    isTreeLoading: true,
    treeError: null,

    setTreeData: (nodes, links, canvasWidth, canvasHeight) =>
        set({ nodes, links, canvasWidth, canvasHeight, isTreeLoading: false, treeError: null }),
    setTreeLoading: (isTreeLoading) => set({ isTreeLoading }),
    setTreeError: (treeError) => set({ treeError, isTreeLoading: false }),

    modules: [],
    isModulesLoading: true,
    setModules: (modules) => set({ modules, isModulesLoading: false }),
    setModulesLoading: (isModulesLoading) => set({ isModulesLoading }),

    syncProgress: 0,
    isSyncingData: false,
    setSyncProgress: (syncProgress) => set({ syncProgress }),
    setIsSyncingData: (isSyncingData) => set({ isSyncingData }),

    fetchModules: async (force = false) => {
        const { isModulesLoading, modules } = useNodesStore.getState();
        
        // Prevent concurrent fetches unless forced
        if (isModulesLoading && !force) return;
        
        // Only show loading if we don't have modules yet
        if (modules.length === 0) {
            set({ isModulesLoading: true });
        }

        try {
            console.log('[NodesStore] fetchModules starting...');
            const data = await getModuleProgressView();
            set({ modules: data, isModulesLoading: false });
            console.log('[NodesStore] fetchModules completed, count:', data.length);
        } catch (error) {
            console.error('[NodesStore] Error fetching modules:', error);
            set({ isModulesLoading: false });
        }
    },
}));
