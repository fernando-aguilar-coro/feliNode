import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { PathNode } from './PathNode';
import { PathConnector } from './PathConnector';

interface LessonItemProps {
    item: {
        id: string;
        backgroundColor: string;
        translateX: number;
        lessonIndex?: number;
        isFirstInModule?: boolean;
        data: {
            id: string;
            title: string;
            status: 'available' | 'completed' | 'current';
        };
    };
    showConnector: boolean;
    connectorColor: string;
    onPress: (lessonId: string) => void;
    itemHeight: number;
}

export const LessonItem = React.memo(({
    item,
    showConnector,
    connectorColor,
    onPress,
    itemHeight,
}: LessonItemProps) => {
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: item.backgroundColor,
                    height: itemHeight,
                },
            ]}
        >
            <View
                style={[
                    styles.nodeWrapper,
                    { transform: [{ translateX: item.translateX }] },
                ]}
            >
                <PathNode lesson={item.data} onPress={onPress} />
            </View>

            {showConnector && (
                <View
                    style={[
                        styles.connectorOverlay,
                        {
                            top: -(itemHeight / 2),
                            height: itemHeight,
                        },
                    ]}
                    pointerEvents="none"
                >
                    <Canvas style={styles.canvas} pointerEvents="none">
                        <PathConnector
                            index={item.lessonIndex!}
                            color={connectorColor}
                        />
                    </Canvas>
                </View>
            )}
        </View>
    );
}, (prev, next) =>
    prev.item.id === next.item.id &&
    prev.item.data.status === next.item.data.status &&
    prev.connectorColor === next.connectorColor &&
    prev.showConnector === next.showConnector
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    nodeWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    connectorOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    canvas: {
        flex: 1,
    },
});