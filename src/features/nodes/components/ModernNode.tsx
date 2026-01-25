import React from 'react';
import { G, Circle, Text as SvgText } from 'react-native-svg';
import { TreeNode } from '../types/NodeTypes';

interface ModernNodeProps {
    node: TreeNode;
    onPress: (node: TreeNode) => void;
}

export const ModernNode: React.FC<ModernNodeProps> = React.memo(({ node, onPress }) => {
    // Minimalist Styling
    let strokeColor = '#cfd8dc'; // Default locked
    let fillColor = '#ffffff';
    let textColor = '#b0bec5';
    let strokeWidth = "2";

    if (node.status === 'completed') {
        strokeColor = '#43e97b'; // Green
        textColor = '#2d3436';
        strokeWidth = "2.5";
    } else if (node.status === 'available') {
        strokeColor = '#4facfe'; // Blue
        textColor = '#2d3436';
        strokeWidth = "3";
    }

    // Truncate title if too long
    const title = node.title.length > 20 ? node.title.substring(0, 18) + '...' : node.title;

    return (
        <G onPress={() => onPress(node)}>
            {/* Main Circle - Clean, no shadow, solid colors */}
            <Circle
                cx={node.x}
                cy={node.y}
                r="35"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />

            {/* Inner Ring for "Double Border" effect on Available/Completed */}
            {node.status !== 'locked' && (
                <Circle
                    cx={node.x}
                    cy={node.y}
                    r="30"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1"
                    opacity="0.3"
                />
            )}

            {/* Title - Rendered directly in SVG for performance */}
            {/* Split title into lines if possible, or just simplistic centering */}
            <SvgText
                x={node.x}
                y={node.y + 4} // Optical center adjustment
                fill={textColor}
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
            >
                {title}
            </SvgText>
        </G>
    );
});
