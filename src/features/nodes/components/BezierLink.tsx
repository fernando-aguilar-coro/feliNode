import React from 'react';
import { Path } from 'react-native-svg';
import { TreeLink } from '../types/NodeTypes';

interface BezierLinkProps {
    link: TreeLink;
}

export const BezierLink: React.FC<BezierLinkProps> = ({ link }) => {
    const { source, target } = link;

    // Calculate control points for a smooth cubic bezier curve
    // We want the curve to go vertically mostly, assuming a tree structure top-down
    // or horizontal if left-right. Based on the canvas size (2x width), it seems flexible.
    // Let's assume a standard vertical flow for now, or adaptive.
    // If dy > dx, vertical logic often looks better.

    const dx = target.x - source.x;
    const dy = target.y - source.y;

    // Curvature factor
    const tension = 0.5;

    let path = '';

    // Simple S-curve logic
    // M startX startY C cp1x cp1y, cp2x cp2y, endX endY

    // If nodes are far apart vertically, use vertical control points
    const cp1x = source.x;
    const cp1y = source.y + (dy * tension);
    const cp2x = target.x;
    const cp2y = target.y - (dy * tension);

    path = `M${source.x},${source.y} C${cp1x},${cp1y} ${cp2x},${cp2y} ${target.x},${target.y}`;

    return (
        <Path
            d={path}
            stroke="#b0bec5"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="5, 5" // Optional: dashed line for a 'map' feel
        />
    );
};
