const common = {
    // Brand
    primary: '#7db0b0',
    secondary: '#5d554f74',

    // Base
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // Status
    success: '#00B894',
    error: '#D63031',
    warning: '#F39C12',
    info: '#0984E3',
};

export const lightColors = {
    ...common,
    background: '#FFFFFF',
    surface: '#F5F6FA',
    text: '#2D3436',
    textSecondary: '#636E72',
    textLight: '#B2BEC3',
    border: '#DFE6E9',
};

export const darkColors = {
    ...common,
    background: '#121212',
    surface: '#1E1E1E',
    text: '#E1E1E1',
    textSecondary: '#A0A0A0',
    textLight: '#606060',
    border: '#2C2C2C',
};

// Default to light for backwards compatibility during refactor
export const colors = lightColors;
