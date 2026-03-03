import { create } from 'zustand';
import { TreeNode, TreeLink } from '../features/nodes/types/NodeTypes';
import { ModuleProgress } from '../features/nodes/services/ModuleProgress.service';

interface NodesStoreState {
    refreshTrigger: number;
    triggerRefresh: () => void;

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
}

export const useNodesStore = create<NodesStoreState>((set) => ({
    refreshTrigger: 0,
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),

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
}));
