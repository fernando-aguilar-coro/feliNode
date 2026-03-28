import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { InfinityPairItem } from '../hooks/useInfinityPairs';

interface PairCardProps {
    item: InfinityPairItem | null;
    isMatched: boolean;
    isSelected: boolean;
    isError: boolean;
    onPress: (item: InfinityPairItem) => void;
}

export const PairCard: React.FC<PairCardProps> = React.memo(({
    item,
    isMatched,
    isSelected,
    isError,
    onPress,
}) => {
    const theme = useAppTheme();

    if (!item) {
        return <View style={[styles.itemEmpty, { borderColor: theme.colors.border }]} />;
    }

    let backgroundColor = theme.colors.surface;
    let borderColor = theme.colors.border;
    let opacity = 1;

    if (isMatched) {
        backgroundColor = theme.colors.success + '30';
        borderColor = theme.colors.success;
        opacity = 0.45;
    } else if (isError) {
        backgroundColor = theme.colors.error + '25';
        borderColor = theme.colors.error;
    } else if (isSelected) {
        backgroundColor = theme.colors.primary + '25';
        borderColor = theme.colors.primary;
    }

    return (
        <TouchableOpacity
            style={[styles.item, { backgroundColor, borderColor, opacity }]}
            onPress={() => onPress(item)}
            disabled={isMatched}
            activeOpacity={0.75}
        >
            <AppText
                style={{
                    color: isSelected ? theme.colors.primary : theme.colors.text,
                    textAlign: 'center',
                    fontWeight: isSelected ? '700' : '500',
                    fontSize: 13,
                }}
                numberOfLines={3}
            >
                {item.text}
            </AppText>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    item: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 2,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 60,
    },
    itemEmpty: {
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        width: '100%',
        minHeight: 60,
        opacity: 0.2,
    },
});
