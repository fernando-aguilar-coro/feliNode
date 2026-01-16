import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../../store/UserStore';
import { TreeNodeScreen } from '../../nodes/screens/TreeNodeScreen';
import { AppButton } from '../../../components';
import { theme } from '../../../theme';

export const HomeScreen = () => {
    // Obtenemos la función de logout y la información del usuario del store
    const logout = useUserStore((state) => state.logout);
    const user = useUserStore((state) => state.user);

    // Determinamos si el usuario es un invitado si su nombre es 'Guest User'
    // o si el objeto usuario no existe (aunque Navigation.tsx garantiza que exista si estamos aquí)
    const isGuest = user?.name === 'Guest User' || !user;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {/* 
                  Si es invitado, mostramos 'Iniciar Sesión'. 
                  En ambos casos llamamos a logout() para limpiar el estado y volver a la pantalla de bienvenida/login.
                */}
                <AppButton
                    title={isGuest ? "Iniciar Sesión" : "Cerrar Sesión"}
                    onPress={logout}
                    variant={isGuest ? "primary" : "outline"}
                    style={[
                        styles.authButton,
                        !isGuest && { borderColor: theme.colors.error } // Color rojo suave para cerrar sesión
                    ]}
                    // Para el texto de 'Cerrar Sesión' usamos el color de error si no es invitado
                    {...(!isGuest && { color: theme.colors.error })}
                />
            </View>
            <View style={styles.content}>
                <TreeNodeScreen />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 10,
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    authButton: {
        height: 40, // Un poco más compacto para el header
        paddingHorizontal: 15,
    },
    content: {
        flex: 1,
    },
});

