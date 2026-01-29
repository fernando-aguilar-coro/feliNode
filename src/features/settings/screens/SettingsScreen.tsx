import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { List, Switch, Divider, Text, Button, useTheme, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../../store/UserStore';

export const SettingsScreen = () => {
    const logout = useUserStore((state) => state.logout);
    const theme = useTheme();

    // Mock states for UI demonstration
    // TODO: Replace these with actual state from stores (e.g., UserStore, SettingsStore)
    const [sfxEnabled, setSfxEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [streakEnabled, setStreakEnabled] = useState(true);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text variant="headlineMedium" style={styles.title}>Ajustes</Text>

                <List.Section>
                    <List.Subheader>Audio</List.Subheader>
                    <List.Item
                        title="Velocidad de voz (TTS)"
                        description="Normal"
                        left={props => <List.Icon {...props} icon="speedometer" />}
                        // TODO: Implement slider or selector for TTS speed (Slow, Normal, Fast)
                        onPress={() => console.log('TODO: Change TTS Speed')}
                    />
                    <List.Item
                        title="Efectos de sonido"
                        left={props => <List.Icon {...props} icon="volume-high" />}
                        right={() => <Switch value={sfxEnabled} onValueChange={setSfxEnabled} />}
                    // TODO: Bind to global state for SFX
                    />
                    <List.Item
                        title="Voz"
                        description="Seleccionar voz del narrador"
                        left={props => <List.Icon {...props} icon="account-voice" />}
                        // TODO: Implement Voice selection modal
                        onPress={() => console.log('TODO: Select Voice')}
                    />
                </List.Section>

                <Divider />

                <List.Section>
                    <List.Subheader>Aprendizaje</List.Subheader>
                    <List.Item
                        title="Idioma de la Interfaz"
                        description="Español"
                        left={props => <List.Icon {...props} icon="translate" />}
                        // TODO: Implement language switching logic
                        onPress={() => console.log('TODO: Change Language')}
                    />
                    <List.Item
                        title="Nivel de Dificultad"
                        description="Intermedio"
                        left={props => <List.Icon {...props} icon="school" />}
                        // TODO: Implement difficulty adjustment
                        onPress={() => console.log('TODO: Change Difficulty')}
                    />
                </List.Section>

                <Divider />

                <List.Section>
                    <List.Subheader>Interfaz y Apariencia</List.Subheader>
                    <List.Item
                        title="Modo Oscuro"
                        left={props => <List.Icon {...props} icon="theme-light-dark" />}
                        right={() => <Switch value={darkMode} onValueChange={setDarkMode} />}
                    // TODO: Bind to theme context
                    />
                    <List.Item
                        title="Tamaño de Fuente"
                        description="Normal"
                        left={props => <List.Icon {...props} icon="format-size" />}
                        // TODO: Implement font size adjustment
                        onPress={() => console.log('TODO: Change Font Size')}
                    />
                </List.Section>

                <Divider />

                <List.Section>
                    <List.Subheader>Notificaciones</List.Subheader>
                    <List.Item
                        title="Mostrar Racha"
                        description="Ver contador de días seguidos"
                        left={props => <List.Icon {...props} icon="fire" />}
                        right={() => <Switch value={streakEnabled} onValueChange={setStreakEnabled} />}
                    // TODO: Bind to user preference
                    />
                </List.Section>

                <Divider />

                <List.Section>
                    <List.Subheader>Cuenta</List.Subheader>
                    <List.Item
                        title="Usuario"
                        description="usuario@ejemplo.com" // TODO: Get from store or auth context
                        left={props => <Avatar.Icon {...props} icon="account" size={40} />}
                    />
                    <View style={styles.buttonContainer}>
                        <Button
                            mode="outlined"
                            onPress={logout}
                            textColor={theme.colors.error}
                            style={{ borderColor: theme.colors.error }}
                            icon="logout"
                        >
                            Cerrar Sesión
                        </Button>
                    </View>

                </List.Section>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        padding: 16,
        paddingBottom: 0,
        fontWeight: 'bold',
    },
    content: {
        paddingBottom: 20,
    },
    buttonContainer: {
        padding: 16,
    }
});
