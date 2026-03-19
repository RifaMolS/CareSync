import React, { createContext, useState, useContext } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
    const [highContrast, setHighContrast] = useState(false);
    const [fontSize, setFontSize] = useState('normal'); // 'normal', 'large', 'extra-large'

    const toggleContrast = () => setHighContrast(!highContrast);
    const increaseFont = () => setFontSize(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'extra-large' : 'normal');

    const theme = {
        highContrast,
        fontSize,
        bgColor: highContrast ? '#000000' : '#f8f9fa',
        textColor: highContrast ? '#FFD700' : '#212529',
        subTextColor: highContrast ? '#FFFFFF' : '#4b5563',
        mutedTextColor: highContrast ? '#FFD700' : '#6c757d',
        cardBg: highContrast ? '#000000' : '#ffffff',
        cardBorder: highContrast ? '#FFD700' : 'transparent',
        btnPrimary: highContrast ? '#FFD700' : '#0d6efd',
        btnText: highContrast ? '#000000' : '#ffffff',
        accentColor: highContrast ? '#FFD700' : '#6366f1',
    };

    return (
        <AccessibilityContext.Provider value={{ ...theme, toggleContrast, increaseFont }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => useContext(AccessibilityContext);
