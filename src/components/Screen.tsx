import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

interface ScreenProps {
    children: React.ReactNode;
    style?: ViewStyle;
    backgroundColor?: string;
}

export const Screen: React.FC<ScreenProps> = ({
    children,
    style,
    backgroundColor = theme.colors.background,
}) => {
    return (
        <SafeAreaView style={[styles.screen, { backgroundColor }]}>
            <View style={[styles.content, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.md,
    },
});
