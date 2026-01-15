import React from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useNodes } from '../hooks/useNodes';
import { TreeNode } from '../types/NodeTypes';
import { useNavigation } from '@react-navigation/native';
import { TreeCanvas } from '../components/TreeCanvas';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Canvas size - can be adjust based on tree size if we want scrolling
const CANVAS_WIDTH = SCREEN_WIDTH * 2;
const CANVAS_HEIGHT = SCREEN_HEIGHT * 1.5;

export const TreeNodeScreen = () => {
    const navigation = useNavigation<any>();
    const { nodes, links, isLoading, error } = useNodes(CANVAS_WIDTH, CANVAS_HEIGHT);

    const handleNodePress = (node: TreeNode) => {
        if (node.status !== 'locked') {
            navigation.navigate('Lesson', { lessonId: node.id });
        } else {
            // Optional: Show locked message
            console.log('Lesson is locked');
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* Indicador de carga mientras se obtienen los nodos */}
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* Mensaje de error si falla la carga */}
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <ScrollView horizontal style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <TreeCanvas
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    nodes={nodes}
                    links={links}
                    onNodePress={handleNodePress}
                />
            </ScrollView>
        </ScrollView>
    );
};
