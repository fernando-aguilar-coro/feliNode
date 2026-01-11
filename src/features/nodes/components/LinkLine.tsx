import React from 'react';
import { Line } from 'react-native-svg';
import { TreeLink } from '../types/NodeTypes';

interface LinkLineProps {
    link: TreeLink;
}

export const LinkLine: React.FC<LinkLineProps> = ({ link }) => {
    return (
        <Line
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
            stroke="#999"
            strokeWidth="2"
        />
    );
};
