import React, { useMemo } from 'react';
import { Path, DashPathEffect } from '@shopify/react-native-skia';
import { usePathLayout } from '../hooks/usePathLayout';

interface PathConnectorProps {
    index: number;
    color?: string;
    isCompleted?: boolean;
}

export const PathConnector = React.memo(({
    index,
    color = '#D1D1D6',
}: PathConnectorProps) => {
    const { createConnectorPath, ITEM_HEIGHT } = usePathLayout();

    const path = useMemo(() => {
        return createConnectorPath(index, ITEM_HEIGHT);
    }, [index, createConnectorPath, ITEM_HEIGHT]);

    return (
        <Path
            path={path}
            color={color}
            style="stroke"
            strokeWidth={3}
            strokeCap="round"
        >
            <DashPathEffect intervals={[6, 12]} phase={0} />
        </Path>
    );
});
