import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../../components/ui/AppButton';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { SAMPLE_MINUTES, type ConversionMoment } from '../ConversionService';

type Props = {
    moment: ConversionMoment;
    sampleAvailable: boolean;
    onLearnMore: () => void;
    /** Sem ele não há amostra: as vidas novas precisam chegar à tela que montou o convite. */
    onSample?: () => void;
    busy?: boolean;
};

const LEARN_MORE_HINT = 'Abre os planos e os preços da Apple. Nada é cobrado sem a sua confirmação.';

/**
 * Convite de assinatura da F8 (ADR 2026-11-15): diz o que o aluno ganha, uma
 * vez, sem preço, prazo nem culpa. Quem o monta mantém a saída de sempre
 * ("Voltar", "Continuar") como ação principal; não há animação.
 */
export function ConversionInvite({ moment, sampleAvailable, onLearnMore, onSample, busy }: Props) {
    if (moment === 'unit-complete') {
        return (
            <View style={styles.box}>
                <Text style={styles.body}>Na próxima unidade, com o Radiant Ilimitado, errar não gasta vida.</Text>
                <AppButton label="Conhecer o Ilimitado" variant="ghost" onPress={onLearnMore} accessibilityHint={LEARN_MORE_HINT} />
            </View>
        );
    }
    return (
        <View style={styles.box}>
            <Text style={styles.title}>Com o Radiant Ilimitado, errar não gasta vida.</Text>
            <Text style={styles.body}>Você seguiria agora, sem esperar a próxima vida. As aulas são as mesmas nos dois planos.</Text>
            <AppButton label="Conhecer o Ilimitado" variant="secondary" onPress={onLearnMore} accessibilityHint={LEARN_MORE_HINT} />
            {sampleAvailable && onSample ? (
                <>
                    <AppButton label={`Experimentar ${SAMPLE_MINUTES} min sem gastar vidas`} variant="ghost" disabled={busy} onPress={onSample} />
                    <Text style={styles.caption}>Só uma vez, sem custo. Depois, suas vidas voltam cheias.</Text>
                </>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    box: { gap: space.s2 },
    title: { ...typography.bodyStrong, color: galaxyColors.textPrimary, textAlign: 'center' },
    body: { ...typography.bodyRegular, color: galaxyColors.textSecondary, textAlign: 'center' },
    caption: { ...typography.caption, color: galaxyColors.textSecondary, textAlign: 'center' },
});
