/**
 * src/features/push/components/PushOptInCard.tsx
 */

import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import { PushService } from '../services/PushService';
import { space, typography } from '../../../ui/styles';
import { TelemetryService } from '../../telemetry/TelemetryService';

const COLORS = {
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    primary: '#0A84FF',
};

interface Props {
    onDismiss: () => void;
}

export const PushOptInCard = ({ onDismiss }: Props) => {
    const [loading, setLoading] = useState(false);

    const handleEnable = async () => {
        setLoading(true);
        TelemetryService.track('push_optin_accepted');
        await PushService.setOptIn(true);
        // Force a schedule check immediately since they just opted in
        await PushService.scheduleDailyIfEligible({ reason: 'optin_immediate' });
        setLoading(false);
        onDismiss();
    };

    const handleDismiss = async () => {
        TelemetryService.track('push_optin_declined');
        await PushService.setOptIn(false);
        onDismiss();
    };

    return (
        <Card style={styles.card}>
            <Text style={styles.title}>Quer um lembrete suave?</Text>
            <Text style={styles.body}>
                Podemos te avisar em dias em que você decidir estudar. Sem pressão. Sem cobrança.
            </Text>

            <PrimaryButton
                onPress={handleEnable}
                style={styles.primaryBtn}
                disabled={loading}
            >
                {loading ? 'Ativando...' : 'Ativar lembretes'}
            </PrimaryButton>

            <TouchableOpacity onPress={handleDismiss} style={styles.secondaryBtn}>
                <Text style={styles.secondaryText}>Agora não</Text>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: space.s6,
        borderWidth: 1,
        borderColor: 'rgba(10, 132, 255, 0.3)',
        backgroundColor: 'rgba(10, 132, 255, 0.05)',
        alignItems: 'center',
        padding: space.s5,
    },
    title: {
        ...typography.h3,
        color: COLORS.text,
        marginBottom: space.s2,
        textAlign: 'center',
    },
    body: {
        ...typography.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: space.s5,
        fontSize: 14,
        lineHeight: 20,
    },
    primaryBtn: {
        width: '100%',
        marginBottom: space.s3,
    },
    secondaryBtn: {
        padding: space.s2,
    },
    secondaryText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
});
