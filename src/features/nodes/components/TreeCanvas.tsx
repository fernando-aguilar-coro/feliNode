import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg from 'react-native-svg';
import { TreeNode, TreeLink } from '../types/NodeTypes';
import { BezierLink } from './BezierLink';
import { ModernNode } from './ModernNode';

interface TreeCanvasProps {
    width: number;
    height: number;
    nodes: TreeNode[];
    links: TreeLink[];
    onNodePress: (node: TreeNode) => void;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({ width, height, nodes, links, onNodePress }) => {
    // Memoize nodes and links rendering to prevent unnecessary re-calculations if props don't change
    // profound change: removed Filters, Gradients, and Patterns for raw performance.

    const renderedLinks = useMemo(() => links.map((link, index) => (
        <BezierLink key={`link-${index}`} link={link} />
    )), [links]);

    const renderedNodes = useMemo(() => nodes.map((node) => (
        <ModernNode key={node.id} node={node} onPress={onNodePress} />
    )), [nodes, onNodePress]);

    return (
        <View style={{ width, height, backgroundColor: '#fafafa' }}>
            <Svg width={width} height={height}>
                {/* 1. Render Links First (Background) */}
                {renderedLinks}

                {/* 2. Render Nodes (Foreground) */}
                {renderedNodes}
            </Svg>
        </View>
    );
};
