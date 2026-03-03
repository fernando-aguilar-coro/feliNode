import React from 'react';
import { Group, Path, Skia } from '@shopify/react-native-skia';

export interface CatPawShapeProps {
    fillColor: string;
    strokeColor: string;
    strokeWidth: number | string;
    scale?: number;
    opacity?: number;
    rotation?: number; // In degrees
}

const mainPadPath = Skia.Path.MakeFromSVGString(
    "M 0 -10 C 6 -10, 21 2, 21 14 C 21 24, 5 22, 0 16 C -5 22, -21 24, -21 14 C -21 2, -6 -10, 0 -10 Z"
)!;

// Helper to create toes
const createToePath = (cx: number, cy: number, rx: number, ry: number) => {
    const p = Skia.Path.Make();
    p.addOval({ x: cx - rx, y: cy - ry, width: rx * 2, height: ry * 2 });
    return p;
};

const toe1 = createToePath(-22, -12, 7, 10);
const toe2 = createToePath(-8, -24, 8, 12);
const toe3 = createToePath(8, -24, 8, 12);
const toe4 = createToePath(22, -12, 7, 10);

export const CatPawShape: React.FC<CatPawShapeProps> = React.memo(({
    fillColor,
    strokeColor,
    strokeWidth,
    scale = 1,
    opacity = 1,
    rotation = 0
}) => {
    const sw = typeof strokeWidth === 'string' ? parseFloat(strokeWidth) : strokeWidth;
    // Skia transforms: handled in sequence from left to right usually, but transform prop applies them as listed
    const transform = [{ scale }, { rotate: (150 + rotation) * Math.PI / 180 }];

    return (
        <Group transform={transform} opacity={opacity}>
            {/* Main Pad */}
            <Path path={mainPadPath} color={fillColor} style="fill" />
            <Path path={mainPadPath} color={strokeColor} style="stroke" strokeWidth={sw} strokeJoin="round" strokeCap="round" />

            {/* Toes */}
            {/* We apply rotation on the individual toes around their explicit centers */}
            <Group transform={[{ translateX: -22 }, { translateY: -12 }, { rotate: -25 * Math.PI / 180 }, { translateX: 22 }, { translateY: 12 }]}>
                <Path path={toe1} color={fillColor} style="fill" />
                <Path path={toe1} color={strokeColor} style="stroke" strokeWidth={sw} />
            </Group>

            <Group transform={[{ translateX: -8 }, { translateY: -24 }, { rotate: -8 * Math.PI / 180 }, { translateX: 8 }, { translateY: 24 }]}>
                <Path path={toe2} color={fillColor} style="fill" />
                <Path path={toe2} color={strokeColor} style="stroke" strokeWidth={sw} />
            </Group>

            <Group transform={[{ translateX: 8 }, { translateY: -24 }, { rotate: 8 * Math.PI / 180 }, { translateX: -8 }, { translateY: 24 }]}>
                <Path path={toe3} color={fillColor} style="fill" />
                <Path path={toe3} color={strokeColor} style="stroke" strokeWidth={sw} />
            </Group>

            <Group transform={[{ translateX: 22 }, { translateY: -12 }, { rotate: 25 * Math.PI / 180 }, { translateX: -22 }, { translateY: 12 }]}>
                <Path path={toe4} color={fillColor} style="fill" />
                <Path path={toe4} color={strokeColor} style="stroke" strokeWidth={sw} />
            </Group>
        </Group>
    );
});
