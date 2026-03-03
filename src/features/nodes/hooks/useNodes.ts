import { useEffect } from 'react';
import { NodeService } from '../services/NodeService';
import { useNodesStore } from '../../../store/NodesStore';

export const useNodes = (width: number, height: number) => {
    const refreshTrigger = useNodesStore(state => state.refreshTrigger);

    // Select state needed for the screen (exclude large arrays to avoid unnecessary renders)
    const isTreeLoading = useNodesStore(state => state.isTreeLoading);
    const treeError = useNodesStore(state => state.treeError);
    const canvasWidth = useNodesStore(state => state.canvasWidth);
    const canvasHeight = useNodesStore(state => state.canvasHeight);

    const refreshNodes = async () => {
        try {
            useNodesStore.getState().setTreeLoading(true);
            const data = await NodeService.getLayout(width, height);
            useNodesStore.getState().setTreeData(data.nodes, data.links, data.width, data.height);
        } catch (err) {
            console.error('Error loading nodes:', err);
            useNodesStore.getState().setTreeError('Failed to load curriculum tree.');
        }
    };

    useEffect(() => {
        refreshNodes();
    }, [width, height, refreshTrigger]);

    return {
        canvasWidth,
        canvasHeight,
        isLoading: isTreeLoading,
        error: treeError,
        refreshNodes
    };
};
