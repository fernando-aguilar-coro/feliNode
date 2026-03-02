import React from 'react';
import { G, Path, Ellipse } from 'react-native-svg';

export interface CatPawShapeProps {
    fillColor: string;
    strokeColor: string;
    strokeWidth: string | number;
    scale?: number;
    opacity?: number;
    rotation?: number;
}

export const CatPawShape: React.FC<CatPawShapeProps> = ({
    fillColor,
    strokeColor,
    strokeWidth,
    scale = 1,
    opacity = 1,
    rotation = 0
}) => {
    return (
        <G transform={`scale(${scale}) rotate(${150 + rotation})`} opacity={opacity}>
            {/* Main Pad (Heart Shape - Rotated 180 degrees) */}
            <Path
                d="M 0 -10 
                   C 6 -10, 21 2, 21 14 
                   C 21 24, 5 22, 0 16 
                   C -5 22, -21 24, -21 14 
                   C -21 2, -6 -10, 0 -10 Z"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {/* 4 Toes (Ellipses) - Separated and less rotated like the image */}
            <Ellipse
                cx="-22" cy="-12" rx="7" ry="10"
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}
                transform="rotate(-25, -22, -12)"
            />
            <Ellipse
                cx="-8" cy="-24" rx="8" ry="12"
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}
                transform="rotate(-8, -8, -24)"
            />
            <Ellipse
                cx="8" cy="-24" rx="8" ry="12"
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}
                transform="rotate(8, 8, -24)"
            />
            <Ellipse
                cx="22" cy="-12" rx="7" ry="10"
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}
                transform="rotate(25, 22, -12)"
            />
        </G>
    );
};
