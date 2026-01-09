import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
export const WelcomeScreen = () => {
    const navigation = useNavigation<any>();

    const navigateToLogin = () => {
        navigation.navigate('Login');
    };

    const navigateToPlacement = () => {
        navigation.navigate('PlacementEvaluation');
    };

    return (
        <SafeAreaView>
            <Text >Welcome to Felinode</Text>
            <Text >Master English the right way.</Text>

            <View >
                <TouchableOpacity onPress={navigateToLogin}>
                    <Text >Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={navigateToPlacement}>
                    <Text >Take Placement Test</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>

    );
};

