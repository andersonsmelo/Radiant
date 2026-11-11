import React from 'react';
import { StyleSheet, Switch, Text, View, useWindowDimensions } from 'react-native';

import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { GroupedList } from '../../../ui/components/GroupedList';
import { isLargeTextScale } from '../../../ui/accessibility/useLargeTextLayout';
import type { BackupState } from '../progressSync.types';

type ICloudBackupCardProps = {
    /** `null` enquanto o estado ainda não foi lido: esqueleto, nunca branco. */
    state: BackupState | null;
    onToggle: (enabled: boolean) => void;
    busy?: boolean;
    /** Capacidade do binário, distinta de falha temporária de conta/rede. */
    available?: boolean;
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
            return 'Não foi possível acessar o iCloud agora. Seu progresso continua salvo neste aparelho.';
        case 'failed':
            return 'Não foi possível fazer o backup agora. Seu progresso continua salvo neste aparelho; tento de novo na próxima lição.';
        case 'incompatible':
            // Não é defeito nem falha passageira: há um backup na nuvem feito
            // por uma versão mais nova do app. Ele NÃO foi sobrescrito, e dizer
            // isso importa — a ação útil é atualizar, não tentar de novo.
            return 'Seu backup no iCloud foi feito por uma versão mais nova do Radiant. Ele está guardado e intacto; atualize o app para usá-lo. Seu progresso continua salvo neste aparelho.';
        default:
            return null;
    }
}

/**
 * Cartão **Backup no iCloud** do Perfil (spec §7): um interruptor, a data do
 * último backup e um erro que informa sem bloquear. Nenhuma outra tela fala
 * de backup.
 */
export function ICloudBackupCard({ state, onToggle, busy = false, available = true }: ICloudBackupCardProps) {
    const { fontScale } = useWindowDimensions();
    const large = isLargeTextScale(fontScale);
    if (!available) return <GroupedList header="Progresso" footer="Por enquanto, o progresso fica salvo neste aparelho.">
        <View style={styles.row} accessible accessibilityLabel="Backup no iCloud. Em breve" accessibilityState={{ disabled: true }}>
            <Text key={`unavailable-${fontScale}`} style={styles.detail}>Backup no iCloud</Text>
            <Text key={`soon-${fontScale}`} style={styles.detail}>Em breve</Text>
        </View>
    </GroupedList>;
    if (state === null) return <GroupedList header="Progresso"><View style={styles.row} accessibilityRole="progressbar" accessibilityLabel="Carregando o backup">
        <Text key={`loading-${fontScale}`} style={styles.detail}>Carregando backup…</Text>
    </View></GroupedList>;
    const error = errorCopy(state.lastError);
    return <GroupedList header="Progresso"><View style={styles.content}>
        <View style={[styles.row, large && styles.stacked]}>
            <Text key={`label-${fontScale}`} style={styles.label}>Backup no iCloud</Text>
            <Switch accessibilityLabel="Backup no iCloud" accessibilityHint="Guarda seu progresso no iCloud. Desligar não apaga o progresso."
                value={state.enabled} onValueChange={onToggle} disabled={busy}
                trackColor={{ true: galaxyColors.nodeCompletedAccent, false: galaxyColors.surfaceActive }} />
        </View>
        <Text key={`date-${fontScale}`} style={styles.detail}>{state.lastBackupAt ? `Último backup em ${formatDateTime(state.lastBackupAt)}` : 'Nenhum backup ainda'}</Text>
        {error ? <Text key={`error-${fontScale}`} style={styles.detail} accessibilityRole="alert">{error}</Text> : null}
    </View></GroupedList>;
}
const styles = StyleSheet.create({
    content: { paddingVertical: space.s2, gap: space.s1 },
    row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s2, flexWrap: 'wrap' },
    stacked: { flexDirection: 'column', alignItems: 'flex-start' },
    label: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textPrimary, flexShrink: 1 },
    detail: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
});
