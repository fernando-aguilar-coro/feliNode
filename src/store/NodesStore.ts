import { create } from 'zustand';

interface NodesStoreState {
    refreshTrigger: number;
    triggerRefresh: () => void;
}

export const useNodesStore = create<NodesStoreState>((set) => ({
    refreshTrigger: 0,
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
