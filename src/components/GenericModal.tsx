import React, { useMemo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, useTheme, Modal, Portal } from 'react-native-paper';

export interface GenericModalProps {
    visible: boolean;
    title: string;
    description?: string;
    subtitle?: string;
    icon?: ReactNode;
    primaryButtonText?: string;
    primaryButtonIcon?: string;
    onPrimaryPress?: () => void;
    secondaryButtonText?: string;
    onSecondaryPress?: () => void;
    dismissable?: boolean;
    children?: ReactNode;
}

export const GenericModal: React.FC<GenericModalProps> = ({
    visible,
    title,
    description,
    subtitle,
    icon,
    primaryButtonText,
    primaryButtonIcon,
    onPrimaryPress,
    secondaryButtonText,
    onSecondaryPress,
    dismissable = false,
    children,
}) => {
    const theme = useTheme();

    const styles = useMemo(() => StyleSheet.create({
        modalContainer: {
            backgroundColor: theme.colors.background,
            padding: 24,
            margin: 20,
            borderRadius: 16,
        },
        iconContainer: {
            alignSelf: 'center',
            marginBottom: icon ? 16 : 24,
        },
        title: {
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 24,
            fontSize: 24,
            color: theme.colors.onBackground,
        },
        card: {
            marginBottom: 32,
        },
        description: {
            textAlign: 'center',
            color: theme.colors.onBackground,
            lineHeight: 22,
            marginBottom: subtitle ? 12 : 0,
        },
        subtitle: {
            textAlign: 'center',
            fontStyle: 'italic',
            color: theme.colors.onSurfaceVariant,
        },
        buttonContainer: {
            marginTop: 24,
            gap: 12,
        },
        button: {
            paddingVertical: 6,
        },
        buttonLabel: {
            fontSize: 16,
            fontWeight: 'bold',
        },
    }), [theme, icon, subtitle]);

    return (
        <Portal>
            <Modal
                visible={visible}
                dismissable={dismissable}
                contentContainerStyle={styles.modalContainer}
                onDismiss={onSecondaryPress}
            >
                {icon && (
                    <View style={styles.iconContainer}>
                        {icon}
                    </View>
                )}

                <Text style={styles.title}>
                    {title}
                </Text>

                {children ? (
                    <View style={{ maxHeight: 400 }}>
                        {children}
                    </View>
                ) : (
                    description && (
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text style={styles.description}>
                                    {description}
                                </Text>
                                {subtitle && (
                                    <Text style={styles.subtitle}>
                                        {subtitle}
                                    </Text>
                                )}
                            </Card.Content>
                        </Card>
                    )
                )}

                {(primaryButtonText || secondaryButtonText) && (
                    <View style={styles.buttonContainer}>
                        {primaryButtonText && onPrimaryPress && (
                            <Button
                                mode="contained"
                                onPress={onPrimaryPress}
                                style={styles.button}
                                labelStyle={styles.buttonLabel}
                                icon={primaryButtonIcon}
                            >
                                {primaryButtonText}
                            </Button>
                        )}
                        {secondaryButtonText && onSecondaryPress && (
                            <Button
                                mode="text"
                                onPress={onSecondaryPress}
                                labelStyle={styles.buttonLabel}
                                textColor={theme.colors.onSurfaceVariant}
                            >
                                {secondaryButtonText}
                            </Button>
                        )}
                    </View>
                )}
            </Modal>
        </Portal>
    );
};
