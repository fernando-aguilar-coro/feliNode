import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { TreeNode } from '../types/NodeTypes';
import { BezierLink } from './BezierLink';
import { ModernNode } from './ModernNode';
import { PannableCanvas, PannableCanvasRef } from './PannableCanvas';
import { useNodesStore } from '../../../store/NodesStore';
import { useAppTheme } from '../../../theme/ThemeContext';

interface TreeCanvasProps {
    width: number;
    height: number;
    onNodePress: (node: TreeNode) => void;
}

const NodeOverlay = React.memo(({ node, onPress }: { node: TreeNode, onPress: () => void }) => {
    const theme = useAppTheme();
    const colors = theme?.colors || {
        textSecondary: '#666',
        text: '#000',
        textLight: '#999',
        background: '#fff'
    };

    let tc = colors.textSecondary;
    if (node.status === 'completed') tc = colors.text;
    else tc = colors.text;

    return (
        <TouchableOpacity
            style={{
                position: 'absolute',
                left: node.x - 50,
                top: node.y - 45,
                width: 100,
                height: 110,
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={{ height: 85, width: '100%' }} />
            <Text
                numberOfLines={2}
                style={{
                    color: tc,
                    fontSize: 14,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    width: '100%',
                    textShadowColor: colors.background,
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                }}
            >
                {node.title}
            </Text>
        </TouchableOpacity>
    );
});

export const TreeCanvas = React.forwardRef<PannableCanvasRef, TreeCanvasProps>(({ width, height, onNodePress }, ref) => {
    const links = useNodesStore(state => state.links);
    const nodes = useNodesStore(state => state.nodes);
    const theme = useAppTheme();

    return (
        <PannableCanvas ref={ref} width={width} height={height}>
            <View style={{ width, height }}>
                <Canvas style={{ width, height }} pointerEvents="none">
                    {links.map((link, index) => (
                        <BezierLink key={`link-${index}`} link={link} />
                    ))}
                    {nodes.map((node) => (
                        <ModernNode key={node.id} node={node} theme={theme} />
                    ))}
                </Canvas>
                <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                    {nodes.map((node) => (
                        <NodeOverlay
                            key={`overlay-${node.id}`}
                            node={node}
                            onPress={() => onNodePress(node)}
                        />
                    ))}
                </View>
            </View>
        </PannableCanvas>
    );
});
