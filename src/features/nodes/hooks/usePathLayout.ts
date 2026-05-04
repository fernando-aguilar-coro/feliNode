import { useMemo, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { Skia, SkPath } from '@shopify/react-native-skia';

// Constant values that don't depend on orientation
export const PATH_CONSTANTS = {
    ITEM_HEIGHT: 240,
    CONNECTOR_STEPS: 20,
    WAVE_FREQUENCY: 0.8,
};

export interface PathLayoutConfig {
    ITEM_HEIGHT: number;
    CONNECTOR_STEPS: number;
    WAVE_FREQUENCY: number;
    SCREEN_WIDTH: number;
    WAVE_AMPLITUDE: number;
    CENTER_X: number;
}

export const usePathLayout = () => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();

    const config = useMemo((): PathLayoutConfig => {
        // Cap amplitude to prevent excessive zig-zag on very wide screens
        const amplitude = Math.min(SCREEN_WIDTH * 0.32, 250);

        return {
            ...PATH_CONSTANTS,
            SCREEN_WIDTH,
            WAVE_AMPLITUDE: amplitude,
            CENTER_X: SCREEN_WIDTH / 2,
        };
    }, [SCREEN_WIDTH]);

    const getPoint = useCallback((index: number) => {
        const x = config.CENTER_X + Math.sin(index * config.WAVE_FREQUENCY) * config.WAVE_AMPLITUDE;
        const y = index * config.ITEM_HEIGHT;
        return {
            x,
            y,
            translateX: x - config.CENTER_X,
        };
    }, [config]);

    const createConnectorPath = useCallback((index: number, height?: number): SkPath => {
        const p = Skia.Path.Make();
        const actualHeight = height ?? config.ITEM_HEIGHT;

        const startPoint = getPoint(index - 1);
        p.moveTo(startPoint.x, 0);

        const steps = config.CONNECTOR_STEPS;
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const currentIdx = (index - 1) + t;
            const pt = getPoint(currentIdx);
            p.lineTo(pt.x, t * actualHeight);
        }

        return p;
    }, [getPoint, config.CONNECTOR_STEPS, config.ITEM_HEIGHT]);

    return {
        ...config,
        getPoint,
        createConnectorPath,
    };
};
