import React, { useMemo } from 'react';
import { G, Text as SvgText } from 'react-native-svg';
import { TreeNode } from '../types/NodeTypes';
import { useAppTheme } from '../../../theme/ThemeContext';
import { CatPawShape } from './CatPawShape';

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
            fc = theme.colors.surface;
            tc = theme.colors.text;
            sw = "2.5";
        } else if (node.status === 'available') {
            sc = theme.colors.info; // Blue
            fc = theme.colors.surface;
            tc = theme.colors.text;
            sw = "3";
        } else {
            // Locked
            sc = theme.colors.border;
            fc = theme.colors.background;
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
    // Offset the text so it starts below the cat paw (approx 42 units down from node center)
    const startY = node.y + 42;

    // Deterministic random variance based on tree node identity
    const { rotationOffset, scaleMultiplier } = useMemo(() => {
        // Use a better hash function (FNV-1a) to avoid seed clumping
        let hash = 2166136261;
        const str = String(node.id) + node.title;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }

        // Better pseudo-random generator: Mulberry32 (avoids clustering issues of Math.sin)
        const pseudoRand = (seed: number) => {
            let t = seed + 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };

        // Rotation range: 0 to 60 degrees. (CatPawShape starts slightly rotated left)
        const rotationOffset = (pseudoRand(hash) * 60);

        const scaleMultiplier = 0.8 + (pseudoRand(hash + 1) * 0.1);

        return { rotationOffset, scaleMultiplier };
    }, [node.id, node.title]);

    return (
        <G onPress={() => onPress(node)}>
            {/* Inner Ring / Halo effect for Available/Completed */}
            {node.status !== 'locked' && (
                <G x={node.x} y={node.y}>
                    <CatPawShape
                        fillColor="none"
                        strokeColor={strokeColor}
                        strokeWidth="1.5"
                        scale={1.2 * scaleMultiplier}
                        opacity={0.3}
                        rotation={rotationOffset}
                    />
                </G>
            )}

            {/* Main Cat Paw Print */}
            <G x={node.x} y={node.y}>
                <CatPawShape
                    fillColor={fillColor}
                    strokeColor={strokeColor}
                    strokeWidth={strokeWidth}
                    scale={1 * scaleMultiplier}
                    rotation={rotationOffset}
                />
            </G>

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

