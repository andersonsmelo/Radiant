import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import TelemetryDebugScreen from '../features/telemetry/screens/TelemetryDebugScreen';
import { AppConfig } from '../config';
import { Card } from '../components/ui/Card';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { layout, space, typography } from '../ui/styles';

export default function TelemetryRoute() {
    if (!AppConfig.ENABLE_TELEMETRY_DEBUG_SCREEN) {
        return (
            <SafeAreaView style={styles.screen}>
                <View style={[layout.container, layout.center, styles.content]}>
                    <Card style={styles.card}>
                        <Text style={styles.title}>Diagnóstico restrito</Text>
                        <Text style={styles.body}>
                            Esta tela fica disponível apenas em builds de desenvolvimento ou homologação.
                        </Text>
                        <PrimaryButton onPress={() => router.replace('/(tabs)')} style={styles.button}>
                            Voltar
                        </PrimaryButton>
                    </Card>
                </View>
            </SafeAreaView>
        );
    }

    return <TelemetryDebugScreen />;
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
        padding: space.s3,
    },
    card: {
        width: '100%',
        maxWidth: 420,
        alignItems: 'center',
        gap: space.s3,
    },
    title: {
        ...typography.h3,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    body: {
        ...typography.caption,
        color: '#8E8E93',
        textAlign: 'center',
    },
    button: {
        width: '100%',
    },
});
