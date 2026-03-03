import React, { useMemo } from 'react';
import { Path, Skia, DashPathEffect } from '@shopify/react-native-skia';
import { TreeLink } from '../types/NodeTypes';

interface BezierLinkProps {
    link: TreeLink;
}

export const BezierLink: React.FC<BezierLinkProps> = React.memo(({ link }) => {
    const { source, target } = link;

    const path = useMemo(() => {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const tension = 0.5;

        const cp1x = source.x;
        const cp1y = source.y + (dy * tension);
        const cp2x = target.x;
        const cp2y = target.y - (dy * tension);

        const p = Skia.Path.Make();
        p.moveTo(source.x, source.y);
        p.cubicTo(cp1x, cp1y, cp2x, cp2y, target.x, target.y);
        return p;
    }, [source.x, source.y, target.x, target.y]);

    return (
        <Path
            path={path}
            color="#b0bec5"
            style="stroke"
            strokeWidth={3}
            strokeCap="round"
        >
            <DashPathEffect intervals={[5, 5]} />
        </Path>
    );
});
