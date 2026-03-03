import React from 'react';
import { View } from 'react-native';
import Svg from 'react-native-svg';
import { TreeNode, TreeLink } from '../types/NodeTypes';
import { BezierLink } from './BezierLink';
import { ModernNode } from './ModernNode';
import { PannableCanvas, PannableCanvasRef } from './PannableCanvas';
import { useNodesStore } from '../../../store/NodesStore';

interface TreeCanvasProps {
    width: number;
    height: number;
    onNodePress: (node: TreeNode) => void;
}

export const TreeCanvas = React.forwardRef<PannableCanvasRef, TreeCanvasProps>(({ width, height, onNodePress }, ref) => {
    // Memoize nodes and links rendering to prevent unnecessary re-calculations if props don't change
    // profound change: removed Filters, Gradients, and Patterns for raw performance.
    const links = useNodesStore(state => state.links);
    const nodes = useNodesStore(state => state.nodes);

    return (
        <PannableCanvas ref={ref} width={width} height={height}>
            <View style={{ width, height }}>
                <Svg width={width} height={height}>
                    {/* 1. Render Links First (Background) */}
                    {links.map((link, index) => (
                        <BezierLink key={`link-${index}`} link={link} />
                    ))}

                    {/* 2. Render Nodes (Foreground) */}
                    {nodes.map((node) => (
                        <ModernNode key={node.id} node={node} onPress={onNodePress} />
                    ))}
                </Svg>
            </View>
        </PannableCanvas>
    );
});
