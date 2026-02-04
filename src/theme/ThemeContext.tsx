import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import {
    MD3LightTheme,
    MD3DarkTheme,
    PaperProvider,
    adaptNavigationTheme,
} from 'react-native-paper';
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { lightColors, darkColors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { theme as defaultTheme } from './index';

type ThemeType = typeof defaultTheme & {
    dark: boolean;
    colors: typeof lightColors;
};

type ThemeContextType = {
    theme: ThemeType;
    isDark: boolean;
    toggleTheme: () => void;
    setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
    themeMode: 'light' | 'dark' | 'system';
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const { LightTheme: NavLightTheme, DarkTheme: NavDarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('dark');
    const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

    useEffect(() => {
        if (themeMode === 'system') {
            setIsDark(systemColorScheme === 'dark');
        } else {
            setIsDark(themeMode === 'dark');
        }
    }, [themeMode, systemColorScheme]);

    const customColors = isDark ? darkColors : lightColors;

    const paperTheme = {
        ...(isDark ? MD3DarkTheme : MD3LightTheme),
        colors: {
            ...(isDark ? MD3DarkTheme.colors : MD3LightTheme.colors),
            ...customColors,
            primary: customColors.primary,
            background: customColors.background,
            surface: customColors.surface,
            error: customColors.error,
            onSurface: customColors.text,
        },
    };

    const appTheme = {
        ...defaultTheme,
        ...paperTheme,
        colors: {
            ...paperTheme.colors,
            ...customColors,
        },
        spacing,
        typography,
    };

    const toggleTheme = () => {
        setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme: appTheme, isDark, toggleTheme, setThemeMode, themeMode }}>
            <PaperProvider theme={paperTheme}>
                {/* NavigationThemeProvider is optional if we pass theme to NavigationContainer, but good for nested usage */}
                <NavigationThemeProvider value={isDark ? NavDarkTheme : NavLightTheme}>
                    {children}
                </NavigationThemeProvider>
            </PaperProvider>
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(ThemeContext).theme;
export const useThemeControl = () => useContext(ThemeContext);
