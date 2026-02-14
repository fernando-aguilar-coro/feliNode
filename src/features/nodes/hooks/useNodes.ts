import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { NodeService } from '../services/NodeService';
import { TreeNode, TreeLink } from '../types/NodeTypes';

export const useNodes = (width: number, height: number) => {
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [links, setLinks] = useState<TreeLink[]>([]);
    const [canvasWidth, setCanvasWidth] = useState(width);
    const [canvasHeight, setCanvasHeight] = useState(height);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshNodes = async () => {
        try {
            setIsLoading(true);
            const data = await NodeService.getLayout(width, height);
            setNodes(data.nodes);
            setLinks(data.links);
            setCanvasWidth(data.width);
            setCanvasHeight(data.height);
            setError(null);
        } catch (err) {
            console.error('Error loading nodes:', err);
            setError('Failed to load curriculum tree.');
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            refreshNodes();
        }, [width, height])
    );

    return {
        nodes,
        links,
        canvasWidth,
        canvasHeight,
        isLoading,
        error,
        refreshNodes
    };
};
