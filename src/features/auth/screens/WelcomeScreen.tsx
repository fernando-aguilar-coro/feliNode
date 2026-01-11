import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const WelcomeScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            {/* Sección de Texto */}
            <View style={styles.header}>
                <Text style={styles.title}>Welcome to Felinode</Text>
                <Text style={styles.subtitle}>Master English the right way.</Text>
            </View>

            {/* Sección de Botones */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => navigation.navigate('PlacementEvaluation')}
                >
                    <Text style={styles.primaryButtonText}>Take Placement Test / register </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.secondaryButtonText}>Log In</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        justifyContent: 'space-around', // Distribuye el espacio entre el texto y los botones
    },
    header: {
        alignItems: 'center',
        marginTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    translation: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 5,
    },
    buttonContainer: {
        width: '100%',
        gap: 15, // Espacio entre botones (funciona en versiones recientes de RN)
    },
    button: {
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#58cc02', // Un verde estilo "duolingo" o educativo
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#1cb0f6',
        fontSize: 16,
        fontWeight: '600',
    },
});