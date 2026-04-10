// src/components/ui/PrimaryButton.tsx

import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { AppButton } from './AppButton';

interface PrimaryButtonProps {
    onPress: () => void;
    children: string;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: TextStyle;
}

export function PrimaryButton({
    onPress,
    children,
    disabled = false,
    style,
    textStyle,
}: PrimaryButtonProps) {
    return (
        <AppButton
            onPress={onPress}
            disabled={disabled}
            style={style}
            textStyle={textStyle}
        >
            {children}
        </AppButton>
    );
}
