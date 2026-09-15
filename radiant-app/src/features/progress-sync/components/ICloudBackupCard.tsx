import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';
import type { BackupState } from '../progressSync.types';

type ICloudBackupCardProps = {
    /** `null` enquanto o estado ainda não foi lido: esqueleto, nunca branco. */
    state: BackupState | null;
    onToggle: (enabled: boolean) => void;
    busy?: boolean;
};

function formatDateTime(iso: string): string {
    const date = new Date(iso);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${date.getFullYear()} às ${hh}:${min}`;
}

function errorCopy(error: BackupState['lastError']): string | null {
    switch (error) {
        case 'cloud-unavailable':
            return 'O backup no iCloud ainda não está disponível nesta versão. Seu progresso continua salvo neste aparelho.';
        case 'failed':
            return 'Não foi possível fazer o backup agora. Seu progresso continua salvo neste aparelho; tento de novo na próxima lição.';
        default:
            return null;
    }
}

/**
 * Cartão **Backup no iCloud** do Perfil (spec §7): um interruptor, a data do
 * último backup e um erro que informa sem bloquear. Nenhuma outra tela fala
 * de backup.
 */
export function ICloudBackupCard({ state, onToggle, busy = false }: ICloudBackupCardProps) {
    if (state === null) {
        return (
            <View style={styles.card} accessibilityRole="progressbar" accessibilityLabel="Carregando o backup">
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, styles.skeletonShort]} />
            </View>
        );
    }

    const error = errorCopy(state.lastError);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.copy}>
                    <Text style={styles.eyebrow}>PROGRESSO</Text>
                    <Text style={styles.headline} accessibilityRole="header">Backup no iCloud</Text>
                </View>
                <Switch
                    accessibilityLabel="Backup no iCloud"
                    accessibilityHint="Guarda seu progresso na sua conta do iCloud para reinstalar sem perder nada."
                    value={state.enabled}
                    onValueChange={onToggle}
                    disabled={busy}
                    trackColor={{ true: galaxyColors.nodeCompletedAccent, false: galaxyColors.surfaceActive }}
                />
            </View>
            <Text style={styles.detail}>
                {state.lastBackupAt ? `Último backup em ${formatDateTime(state.lastBackupAt)}` : 'Nenhum backup ainda'}
            </Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: galaxyColors.surface,
        borderRadius: radius.rLg,
        borderWidth: 1,
        borderColor: galaxyColors.border,
        padding: space.s3,
        gap: space.s1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: space.s2,
    },
    copy: {
        flex: 1,
        gap: space.s0,
    },
    eyebrow: {
        ...typography.label,
        color: galaxyColors.textTertiary,
    },
    headline: {
        ...typography.h3,
        color: galaxyColors.textPrimary,
    },
    detail: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
    },
    error: {
        ...typography.caption,
        color: galaxyColors.xpColor,
    },
    skeletonLine: {
        height: 16,
        borderRadius: radius.rSm,
        backgroundColor: galaxyColors.surfaceActive,
    },
    skeletonShort: {
        width: '60%',
    },
});
