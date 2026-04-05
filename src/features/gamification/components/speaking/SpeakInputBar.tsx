import { useTranslation } from 'react-i18next';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../../theme/ThemeContext';
import { useSpeakStore } from '../../../../store/useSpeakStore';

interface Props {
    onSend: () => void;
}

export function SpeakInputBar({ onSend }: Props) {
    const { t } = useTranslation();
    const theme = useAppTheme();
    const value = useSpeakStore(state => state.inputText);
    const onChangeText = useSpeakStore(state => state.setInputText);
    const disabled = useSpeakStore(state => state.isLoading);

    const canSend = (value || '').trim().length > 0 && !disabled;
    const handleSend = () => onSend();

    return (
        <View style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={t('gamification.speak.placeholder')}
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                editable={!disabled}
                multiline
                maxLength={500}
            />
            <TouchableOpacity
                style={[styles.btn, { opacity: canSend ? 1 : 0.4 }]}
                onPress={handleSend}
                disabled={!canSend}
                activeOpacity={0.8}
            >
                <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 6,
        gap: 8,
    },
    input: {
        flex: 1,
        fontFamily: 'Nunito-Regular',
        fontSize: 15,
        maxHeight: 90,
        paddingTop: 4,
        paddingBottom: 4,
    },
    btn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFBA08',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
