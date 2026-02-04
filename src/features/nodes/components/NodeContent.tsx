import React from 'react';
import { G, Circle } from 'react-native-svg';
import { TreeNode } from '../types/NodeTypes';

interface NodeContentProps {
    node: TreeNode;
    onPress: (node: TreeNode) => void;
}

export const NodeContent: React.FC<NodeContentProps> = ({ node, onPress }) => {
    // Style based on status
    let fillColor = '#ccc'; // Locked
    if (node.status === 'completed') fillColor = '#4caf50'; // Green
    if (node.status === 'available') fillColor = '#2196f3'; // Blue

    return (
        <>
            <G onPress={() => onPress(node)}>
                <Circle
                    cx={node.x}
                    cy={node.y}
                    r="30"
                    fill={fillColor}
                    stroke="#fff"
                    strokeWidth="2"
                />
            </G>
            {/* Using a ForeignObject or just overlaying text is tricky in pure SVG on native.
                For simplicity in this refactor, we are doing strictly SVG elements inside the canvas.
                If text is needed outside, it should be handled by an overlay. 
                For now, let's keep it simple and clean. 
            */}
        </>
    );
};
