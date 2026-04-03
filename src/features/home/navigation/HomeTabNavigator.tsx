import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { PracticeLandingScreen } from '../../learning/screens/PracticeLandingScreen';
import { SettingsScreen } from '../../settings/screens/SettingsScreen';
import { useAppTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { audioService } from '../../settings/services/audio.service';

export type HomeTabParamList = {
    HomeMain: undefined;
    InfinityLanding: undefined;
    Settings: undefined;
};

const Tab = createMaterialTopTabNavigator<HomeTabParamList>();

export const HomeTabNavigator = () => {
    const { t } = useTranslation();
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
                    tabBarLabel: t('home.tabs.learn'),
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="compass-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="InfinityLanding"
                component={PracticeLandingScreen}
                options={{
                    tabBarLabel: t('home.tabs.practice'),
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="sparkles-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: t('home.tabs.settings'),
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings-outline" size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
