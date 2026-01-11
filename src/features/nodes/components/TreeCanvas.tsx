import React from 'react';
import { View, Text } from 'react-native';
import Svg from 'react-native-svg';
import { TreeNode, TreeLink } from '../types/NodeTypes';
import { LinkLine } from './LinkLine';
import { NodeContent } from './NodeContent';

interface TreeCanvasProps {
    width: number;
    height: number;
    nodes: TreeNode[];
    links: TreeLink[];
    onNodePress: (node: TreeNode) => void;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({ width, height, nodes, links, onNodePress }) => {
    return (
        <View style={{ width, height, backgroundColor: '#f0f0f0' }}>
            <Svg width={width} height={height}>
                {/* 1. Render Links First (Background) */}
                {links.map((link, index) => (
                    <LinkLine key={`link-${index}`} link={link} />
                ))}

                {/* 2. Render Nodes (Foreground) */}
                {nodes.map((node) => (
                    <NodeContent key={node.id} node={node} onPress={onNodePress} />
                ))}
            </Svg>

            {/* 3. Text Labels Overlay (Absolute Positioning for better text handling) */}
            {nodes.map((node) => (
                <View
                    key={`label-${node.id}`}
                    style={{
                        position: 'absolute',
                        left: node.x - 50,
                        top: node.y + 35,
                        width: 100,
                        alignItems: 'center',
                        pointerEvents: 'none' // Let clicks pass through to SVG if overlapping
                    }}
                >
                    <Text style={{ textAlign: 'center', fontSize: 12 }}>{node.title}</Text>
                </View>
            ))}
        </View>
    );
};
