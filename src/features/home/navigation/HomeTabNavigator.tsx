import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { PronunciationAssessmentScreen } from '../../learning/screens/PronunciationAssessmentScreen';
import { InfinityLandingScreen } from '../../learning/screens/InfinityLandingScreen';
import { SettingsScreen } from '../../settings/screens/SettingsScreen';
import { GamificationNavigator } from '../../gamification/navigation/GamificationNavigator';
import { useAppTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { audioService } from '../../settings/services/audio.service';

export type HomeTabParamList = {
    HomeMain: undefined;
    InfinityLanding: undefined;
    Pronunciation: undefined;
    Speak: undefined;
    Settings: undefined;
};

const Tab = createMaterialTopTabNavigator<HomeTabParamList>();

export const HomeTabNavigator = () => {
    const theme = useAppTheme();

    useFocusEffect(
        useCallback(() => {
            audioService.playBGM();

            return () => {
                // audioService.stopBGM(); // Pause or stop when navigating away
                audioService.pauseBGM();
            };
        }, [])
    );

    return (
        <Tab.Navigator
            id="home_tabs"
            initialRouteName="HomeMain"
            tabBarPosition="bottom"
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: theme.colors.background,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.text,
                tabBarIndicatorStyle: {
                    backgroundColor: theme.colors.primary,
                    top: 0,
                },
                tabBarShowLabel: true,
                tabBarShowIcon: true,
                tabBarLabelStyle: {
                    fontSize: 10,
                    textTransform: 'capitalize',
                },
                swipeEnabled: true,
            }}
        >
            <Tab.Screen
                name="HomeMain"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Inicio',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="InfinityLanding"
                component={InfinityLandingScreen}
                options={{
                    tabBarLabel: 'Infinito',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="infinite-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Pronunciation"
                component={PronunciationAssessmentScreen}
                options={{
                    tabBarLabel: 'voz',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="mic-outline" size={24} color={color} />
                    ),
                }}
                listeners={{
                    focus: () => audioService.pauseBGM(),
                    blur: () => audioService.playBGM(),
                }}
            />
            <Tab.Screen
                name="Speak"
                component={GamificationNavigator}
                options={{
                    tabBarLabel: 'habla',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="chatbubble-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: 'Ajustes',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings-outline" size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
