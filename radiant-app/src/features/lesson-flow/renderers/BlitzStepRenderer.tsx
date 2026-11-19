import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, AppState, StyleSheet, Text, View } from 'react-native';
import type { BlitzPayload } from '../../../types/learningActivity';
import { useReducedMotionPreferenceState } from '../../../ui/accessibility/useReducedMotionPreference';
import { useScreenFocused } from '../../../ui/useScreenFocused';
import { radius, space } from '../../../ui/styles';
import { semanticColors } from '../../../ui/semantic-colors';
import { galaxyColors } from '../../../ui/theme';
import { statementStem } from './TrueFalseStepRenderer';
import { decodeBlitzValue } from './InteractionAnswerValue';
import { EnterView, TapChip, f2Styles } from './TapChip';

type Props = { payload: BlitzPayload; value?: string; onChange: (value: string) => void; submitted?: boolean };

/** Tempo por afirmação, em segundos, e quanto a marca de certo ou errado fica na tela antes de a próxima entrar. */
export const BLITZ_SECONDS = 10;
export const BLITZ_ADVANCE_MS = 900;

/**
 * Rodada rápida de verdadeiro ou falso. Uma afirmação por vez: o toque mostra a
 * marca (ícone e texto) e a contagem de acertos seguidos, e a próxima entra
 * sozinha. O relógio de 10 s nasce desligado com leitor de tela ou "reduzir
 * movimento", e o aluno o desliga com "Sem tempo"; sem relógio, o avanço
 * automático também cede a um botão com leitor de tela, para a marca ser lida.
 * Tempo esgotado conta como não respondida (`null`), nunca como acerto.
 */
export function BlitzStepRenderer({ payload, value, onChange, submitted = false }: Props) {
    const { statements } = payload;
    const answers = decodeBlitzValue(value).slice(0, statements.length);
    const reduced = useReducedMotionPreferenceState();
    // `null` até o sistema responder: enquanto isso o relógio não começa.
    const [screenReader, setScreenReader] = useState<boolean | null>(null);
    const [noTime, setNoTime] = useState(false);
    const [remaining, setRemaining] = useState(BLITZ_SECONDS);
    const [marking, setMarking] = useState(false);
    // O relógio só corre com o app ativo e a tela em foco; o tempo em segundo plano não esgota a afirmação.
    const focused = useScreenFocused();
    const [appActive, setAppActive] = useState(AppState.currentState !== 'background' && AppState.currentState !== 'inactive');
    useEffect(() => {
        const subscription = AppState.addEventListener('change', state => setAppActive(state === 'active'));
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        let alive = true;
        AccessibilityInfo.isScreenReaderEnabled().then(on => { if (alive) setScreenReader(on); }).catch(() => { if (alive) setScreenReader(false); });
        // Ligar o leitor de tela no meio da rodada para o relógio e o avanço automático.
        const subscription = AccessibilityInfo.addEventListener?.('screenReaderChanged', on => { if (alive) setScreenReader(on); });
        return () => { alive = false; subscription?.remove?.(); };
    }, []);

    const index = answers.length;
    const current = statements[index];
    const timed = screenReader === false && reduced.resolved && !reduced.reducedMotionEnabled && !noTime;
    // Depois da última afirmação não há próxima: a marca dela fica até conferir.
    const showingMark = answers.length > 0 && (marking || !current);
    const lastIndex = answers.length - 1;

    // Índice já respondido: um segundo toque (ou o tempo esgotado) antes do novo desenho não o regrava.
    const answeredIndex = useRef(-1);
    useEffect(() => {
        if (answers.length <= answeredIndex.current) answeredIndex.current = answers.length - 1;
        if (answers.length === 0) setMarking(false);
    }, [answers.length]);

    let streak = 0;
    for (let at = answers.length - 1; at >= 0 && answers[at] === statements[at].isTrue; at -= 1) streak += 1;

    const answer = (given: boolean | null) => {
        if (submitted || !current || showingMark || answeredIndex.current >= index) return;
        answeredIndex.current = index;
        const hit = given === current.isTrue;
        const seguidas = hit ? streak + 1 : 0;
        AccessibilityInfo.announceForAccessibility(`${given === null ? 'Tempo esgotado.' : hit ? 'Acertou.' : 'Não é isso.'} ${current.explanation} ${seguidas} ${seguidas === 1 ? 'seguida' : 'seguidas'}.`);
        onChange(JSON.stringify([...answers, given]));
        setRemaining(BLITZ_SECONDS);
        setMarking(true);
    };

    useEffect(() => {
        if (!timed || !focused || !appActive || showingMark || !current || submitted) return undefined;
        const tick = setInterval(() => setRemaining(left => left - 1), 1000);
        return () => clearInterval(tick);
    }, [timed, focused, appActive, showingMark, current, submitted]);
    useEffect(() => {
        if (timed && remaining <= 0 && current && !showingMark) answer(null);
        // `answer` lê o estado do render em que `remaining` chegou a zero.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remaining]);
    useEffect(() => {
        // Com leitor de tela o aluno avança no próprio ritmo, pelo botão "Próxima".
        if (!marking || screenReader === true) return undefined;
        const advance = setTimeout(() => setMarking(false), BLITZ_ADVANCE_MS);
        return () => clearTimeout(advance);
    }, [marking, screenReader]);

    const next = () => {
        setMarking(false);
        if (current) AccessibilityInfo.announceForAccessibility(`Afirmação ${index + 1} de ${statements.length}: ${current.text}`);
    };

    const shown = showingMark ? statements[lastIndex] : current;
    const given = answers[lastIndex];
    const hit = showingMark && given === statements[lastIndex].isTrue;

    return (
        <EnterView>
            <Text style={f2Styles.prompt}>{payload.prompt}</Text>
            <Text style={f2Styles.secondary}>{`Afirmação ${showingMark ? lastIndex + 1 : Math.min(index + 1, statements.length)} de ${statements.length}`}</Text>
            <Text testID="blitz-streak" style={f2Styles.gold}>{`${streak} ${streak === 1 ? 'seguida' : 'seguidas'}`}</Text>

            {shown ? <Text style={f2Styles.section}>{shown.text}</Text> : null}

            {!showingMark && current && !submitted ? (
                <EnterView key={current.id}>
                    {timed ? (
                        <View style={f2Styles.column}>
                            <View testID="blitz-time-bar" accessibilityRole="progressbar" accessibilityLabel="Tempo desta afirmação"
                                accessibilityValue={{ min: 0, max: BLITZ_SECONDS, now: Math.max(remaining, 0), text: `${Math.max(remaining, 0)} segundos` }} style={styles.track}>
                                <View style={[styles.fill, { width: `${(Math.max(remaining, 0) / BLITZ_SECONDS) * 100}%` }]} />
                            </View>
                            <Text style={f2Styles.secondary}>{`Tempo: ${Math.max(remaining, 0)} s`}</Text>
                        </View>
                    ) : <Text style={f2Styles.secondary}>Sem relógio nesta rodada.</Text>}
                    <View style={f2Styles.wrap}>
                        <TapChip testID="blitz-verdadeiro" label="Verdadeiro" accessibilityLabel={`Verdadeiro: ${current.text}`}
                            accessibilityHint="Responde esta afirmação. A resposta não pode ser trocada." onPress={() => answer(true)} />
                        <TapChip testID="blitz-falso" label="Falso" accessibilityLabel={`Falso: ${current.text}`}
                            accessibilityHint="Responde esta afirmação. A resposta não pode ser trocada." onPress={() => answer(false)} />
                        {timed ? (
                            <TapChip testID="blitz-sem-tempo" label="Sem tempo" accessibilityLabel="Sem tempo"
                                accessibilityHint="Desliga o relógio pelo resto desta rodada." onPress={() => setNoTime(true)} />
                        ) : null}
                    </View>
                </EnterView>
            ) : null}

            {showingMark ? (
                <View style={f2Styles.column} accessible accessibilityLabel={
                    `Afirmação ${lastIndex + 1}: ${statementStem(statements[lastIndex].text)}. ${given === null ? 'Tempo esgotado, sem resposta.'
                        : `Você marcou ${given ? 'verdadeiro' : 'falso'}. ${hit ? 'Acertou.' : 'Não é isso.'}`} ${statements[lastIndex].explanation}`}>
                    <TapChip label={given === null ? 'Tempo esgotado' : `${given ? 'Verdadeiro' : 'Falso'}: ${hit ? 'acertou' : 'não é isso'}`}
                        accessibilityLabel={given === null ? 'Tempo esgotado' : `Você marcou ${given ? 'verdadeiro' : 'falso'}`} disabled selected
                        verdict={hit ? 'correct' : 'incorrect'} />
                    <Text style={f2Styles.secondary}>{statements[lastIndex].explanation}</Text>
                </View>
            ) : null}
            {marking && screenReader === true && current && !submitted ? (
                <TapChip testID="blitz-proxima" label="Próxima" accessibilityLabel="Próxima afirmação"
                    accessibilityHint="Passa para a próxima afirmação da rodada." onPress={next} />
            ) : null}
        </EnterView>
    );
}

const styles = StyleSheet.create({
    track: { height: space.s2, borderRadius: radius.rMd, backgroundColor: galaxyColors.border, overflow: 'hidden' },
    fill: { height: space.s2, borderRadius: radius.rMd, backgroundColor: semanticColors.galaxy.reward },
});
