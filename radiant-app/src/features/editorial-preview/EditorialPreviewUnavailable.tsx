import React from 'react';
import { Text, View } from 'react-native';
import { AppButton } from '../../components/ui/AppButton';
import { layout } from '../../ui/styles';
import { router } from 'expo-router';

export default function EditorialPreviewUnavailable() {
    return <View style={[layout.screen, layout.container, layout.center]}>
        <Text accessibilityRole="header">Prévia indisponível</Text>
        <AppButton label="Voltar à trilha" onPress={() => router.replace('/(tabs)')} />
    </View>;
}
