import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/ThemeContext';

interface ScreenProps {
    children: React.ReactNode;
    style?: ViewStyle;
    backgroundColor?: string;
}

export const Screen: React.FC<ScreenProps> = ({
    children,
    style,
    backgroundColor,
}) => {
    const theme = useAppTheme();
    const finalBackgroundColor = backgroundColor || theme.colors.background;

    const styles = useMemo(() => StyleSheet.create({
        screen: {
            flex: 1,
        },
        content: {
            flex: 1,
            paddingHorizontal: theme.spacing.md, // Ensure dynamic spacing
        },
    }), [theme]); // Use create here, or just object. create is fine inside useMemo

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: finalBackgroundColor }]}>
            <View style={[styles.content, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};
