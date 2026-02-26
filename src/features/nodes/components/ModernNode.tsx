import React, { useMemo } from 'react';
import { G, Circle, Text as SvgText } from 'react-native-svg';
import { TreeNode } from '../types/NodeTypes';
import { useAppTheme } from '../../../theme/ThemeContext';

interface ModernNodeProps {
    node: TreeNode;
    onPress: (node: TreeNode) => void;
}

export const ModernNode: React.FC<ModernNodeProps> = React.memo(({ node, onPress }) => {
    const theme = useAppTheme();

    // Use useMemo to avoid recalculating colors/styles on every render unless dependencies change
    const { strokeColor, fillColor, textColor, strokeWidth } = useMemo(() => {
        let sc = theme.colors.border; // Default locked / base
        let fc = theme.colors.surface;
        let tc = theme.colors.textSecondary; // Ghost/Locked text
        let sw = "2.5";

        if (node.status === 'completed') {
            sc = theme.colors.success; // Green
            fc = theme.colors.surface; // Or maybe keep surface? 
            // Let's make it look solid or distinct
            tc = theme.colors.text;
            sw = "2.5"; // Slightly thicker
        } else if (node.status === 'available') {
            sc = theme.colors.info; // Blue
            fc = theme.colors.surface;
            tc = theme.colors.text;
            sw = "3"; // Thickest for available
        } else {
            // Locked
            sc = theme.colors.border;
            fc = theme.colors.background; // Darker/Lighter background for locked
            tc = theme.colors.textLight;
            sw = "1.5";
        }

        return { strokeColor: sc, fillColor: fc, textColor: tc, strokeWidth: sw };
    }, [node.status, theme]);

    // Truncate title if too long
    const titleLines = useMemo(() => {
        const words = node.title.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        words.forEach(word => {
            if ((currentLine + word).length > 20 && currentLine !== '') {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine += word + ' ';
            }
        });
        if (currentLine) {
            lines.push(currentLine.trim());
        }
        return lines;
    }, [node.title]);
    const lineHeight = 14;
    // Optical center adjustment + center the block of text vertically
    const startY = node.y + 2 - ((titleLines.length - 1) * lineHeight) / 2;

    return (
        <G onPress={() => onPress(node)}>
            {/* Main Circle */}
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

            {/* Title */}
            {titleLines.map((line, index) => (
                <SvgText
                    key={index}
                    x={node.x}
                    y={startY + index * lineHeight}
                    fill={textColor}
                    fontSize="14"
                    fontWeight={node.status !== 'locked' ? "bold" : "normal"}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                >
                    {line}
                </SvgText>
            ))}
        </G>
    );
});
