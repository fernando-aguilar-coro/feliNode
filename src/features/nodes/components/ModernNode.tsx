import React, { useMemo } from 'react';
import { Group } from '@shopify/react-native-skia';
import { TreeNode } from '../types/NodeTypes';
import { useAppTheme } from '../../../theme/ThemeContext';
import { CatPawShape } from './CatPawShape';

interface ModernNodeProps {
    node: TreeNode;
    theme?: any;
}

export const ModernNode: React.FC<ModernNodeProps> = React.memo(({ node, theme: propTheme }) => {
    const contextTheme = useAppTheme();
    const theme = propTheme || contextTheme;
    const colors = theme?.colors || {
        border: '#ccc',
        surface: '#fff',
        success: '#0f0',
        info: '#00f',
        background: '#fff'
    };

    const { strokeColor, fillColor, strokeWidth } = useMemo(() => {
        let sc = colors.border;
        let fc = 'transparent';
        let sw = 2.5;

        if (node.status === 'completed') {
            sc = colors.success;
            fc = 'transparent';
            sw = 2.5;
        } else {
            // Gris oscuro en modo oscuro, gris claro en modo claro
            sc = theme?.dark ? "#e8ffe8ff" : "#5c655cff";
            fc = 'transparent';
            sw = 3;
        }

        return { strokeColor: sc, fillColor: fc, strokeWidth: sw };
    }, [node.status, colors, theme?.dark]);

    const { rotationOffset, scaleMultiplier } = useMemo(() => {
        let hash = 2166136261;
        const str = String(node.id) + node.title;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }

        const pseudoRand = (seed: number) => {
            let t = seed + 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };

        const rotationOffset = (pseudoRand(hash) * 60);
        const scaleMultiplier = 0.8 + (pseudoRand(hash + 1) * 0.1);

        return { rotationOffset, scaleMultiplier };
    }, [node.id, node.title]);

    const nodeTransform = [{ translateX: node.x }, { translateY: node.y }];

    return (
        <Group transform={nodeTransform}>
            <CatPawShape
                fillColor="transparent"
                strokeColor={strokeColor}
                strokeWidth={1.5}
                scale={1.2 * scaleMultiplier}
                opacity={0.3}
                rotation={rotationOffset}
            />
            <CatPawShape
                fillColor={fillColor}
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                scale={1 * scaleMultiplier}
                rotation={rotationOffset}
            />
        </Group>
    );
});

