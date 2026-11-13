import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { AppButton } from '../../../components/ui/AppButton';
import { StarfieldBackground } from '../../../ui/components/StarfieldBackground';
import { space, typography } from '../../../ui/styles';
import { galaxyColors } from '../../../ui/theme';
import { LeagueService, type LeagueBoard } from '../LeagueService';
import { formatTimeLeft } from '../leagueWeek';
import type { LeagueEntry, LeagueScope } from '../league.types';

type Reading = { state: 'loading' } | { state: 'ready'; board: LeagueBoard };

/** Um rótulo só por linha: posição, apelido e XP, e "você" no do aluno (não só a cor). */
export function entryLabel(entry: LeagueEntry): string {
    return `${entry.rank}º lugar, ${entry.isLocalPlayer ? 'você' : entry.alias}, ${entry.xp} XP`;
}

function EntryRow({ entry }: { entry: LeagueEntry }) {
    const mine = entry.isLocalPlayer;
    return (
        <View testID={mine ? 'league-row-local' : `league-row-${entry.rank}`} accessible accessibilityLabel={entryLabel(entry)}
            style={[styles.row, mine && styles.rowMine]}>
            <Text style={[styles.rank, mine && styles.strong]}>{entry.rank}º</Text>
            <Text style={[styles.alias, mine && styles.strong]} numberOfLines={2}>
                {mine ? `Você (${entry.alias})` : entry.alias}
            </Text>
            <Text style={[styles.xp, mine && styles.strong]}>{entry.xp} XP</Text>
        </View>
    );
}

function Message({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
    return (
        <View style={styles.message} accessibilityLiveRegion="polite">
            <Text style={styles.messageTitle} accessibilityRole="header">{title}</Text>
            <Text style={styles.detail}>{body}</Text>
            {children}
        </View>
    );
}

/**
 * Liga da semana, na rota `/league` (ADR 2026-11-13). Mostra o que o Game
 * Center devolve e nada além: sem dado real, a tela diz isso. Sem animação,
 * então não há movimento a reduzir.
 */
export default function LeagueScreen() {
    const [scope, setScope] = useState<LeagueScope>('global');
    const [reading, setReading] = useState<Reading>({ state: 'loading' });
    const [signInMissing, setSignInMissing] = useState(false);
    const generation = useRef(0);

    const load = useCallback(() => {
        const own = ++generation.current;
        setReading({ state: 'loading' });
        void LeagueService.loadBoard(scope).then(board => {
            if (generation.current === own) setReading({ state: 'ready', board });
        });
    }, [scope]);

    useFocusEffect(useCallback(() => {
        load();
        const stop = LeagueService.onAuthenticationChanged(load);
        return () => { generation.current++; stop(); };
    }, [load]));

    const signIn = useCallback(async () => {
        const shown = await LeagueService.presentSignIn();
        setSignInMissing(!shown);
    }, []);

    const board = reading.state === 'ready' ? reading.board : null;
    const endsAt = board && (board.kind === 'ready' || board.kind === 'empty') ? board.endsAt : null;
    const timeLeft = formatTimeLeft(endsAt, new Date());

    let body: React.ReactNode;
    if (!board) {
        body = (
            <View style={styles.message}>
                <ActivityIndicator color={galaxyColors.navBlue} accessibilityRole="progressbar" accessibilityLabel="Carregando a liga" />
                <Text style={styles.detail}>Carregando a liga…</Text>
            </View>
        );
    } else if (board.kind === 'needsSignIn' || (board.kind === 'unavailable' && board.reason === 'not-authenticated')) {
        body = (
            <Message title="Entre no Game Center para participar"
                body="A liga compara o XP que você ganha na semana com o de outros alunos, pelo Game Center da Apple. Aparece só o seu apelido. Sem ele, seu estudo continua igual.">
                {board.kind === 'needsSignIn' && !signInMissing
                    ? <AppButton label="Entrar no Game Center" variant="galaxy" onPress={() => { void signIn(); }}
                        accessibilityLabel="Entrar no Game Center" />
                    : <>
                        <Text style={styles.detail}>Para entrar, abra Ajustes, toque em Game Center e use sua conta Apple. Depois volte aqui.</Text>
                        <AppButton label="Tentar de novo" variant="galaxy" onPress={load} accessibilityLabel="Tentar de novo" />
                    </>}
            </Message>
        );
    } else if (board.kind === 'unavailable' && board.reason === 'leaderboard-not-found') {
        body = <Message title="A liga ainda não abriu" body="O placar da semana ainda não está disponível. Seu XP continua contando no seu nível." />;
    } else if (board.kind === 'unavailable') {
        body = (
            <Message title="Game Center indisponível"
                body="A liga usa o Game Center da Apple, que não está disponível neste aparelho agora. Seu estudo continua igual.">
                <AppButton label="Tentar de novo" variant="galaxy" onPress={load} accessibilityLabel="Tentar de novo" />
            </Message>
        );
    } else if (board.kind === 'offline') {
        body = (
            <Message title="Sem conexão"
                body="A liga precisa de internet para mostrar as posições. O XP da semana fica guardado e é enviado quando a conexão voltar.">
                <AppButton label="Tentar de novo" variant="galaxy" onPress={load} accessibilityLabel="Tentar de novo" />
            </Message>
        );
    } else if (board.kind === 'empty') {
        body = scope === 'friends'
            ? <Message title="Nenhum amigo pontuou nesta semana" body="Quando amigos seus do Game Center ganharem XP no Radiant, eles aparecem aqui." />
            : <Message title="Ninguém pontuou nesta semana ainda" body="Conclua uma aula para entrar na liga da semana." />;
    } else {
        body = (
            <View accessibilityRole="list">
                {board.top.map(entry => <EntryRow key={`top-${entry.rank}-${entry.alias}`} entry={entry} />)}
                {board.neighbors.length > 0 ? <>
                    <Text style={styles.gap} accessibilityLabel="Posições intermediárias omitidas">⋯</Text>
                    {board.neighbors.map(entry => <EntryRow key={`near-${entry.rank}-${entry.alias}`} entry={entry} />)}
                </> : null}
                {board.local === null
                    ? <Text style={styles.detail}>Você ainda não pontuou nesta semana. Uma aula concluída coloca você na lista.</Text>
                    : null}
                <Text style={styles.footnote}>{board.totalPlayers === 1 ? '1 participante' : `${board.totalPlayers} participantes`} nesta semana.</Text>
            </View>
        );
    }

    const scopes: [LeagueScope, string][] = [['global', 'Todos'], ['friends', 'Amigos']];

    return (
        <View style={styles.root} testID="league-screen">
            <StarfieldBackground backgroundColor={galaxyColors.background} starCount={120} />
            <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={space.s1}
                        style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
                        <IconSymbol name="chevron.left" size={20} color={galaxyColors.navBlue} />
                        <Text style={styles.backLabel}>Voltar</Text>
                    </Pressable>
                    <Text style={styles.title} accessibilityRole="header">Liga da semana</Text>
                    <Text style={styles.detail}>
                        {timeLeft ? `${timeLeft}. ` : ''}Quem ganha mais XP na semana sobe. Toda segunda a liga recomeça.
                    </Text>
                    <View style={styles.scopes} accessibilityRole="tablist">
                        {scopes.map(([value, label]) => {
                            const selected = scope === value;
                            return (
                                <Pressable key={value} onPress={() => setScope(value)} accessibilityRole="tab"
                                    accessibilityState={{ selected }} accessibilityLabel={label}
                                    style={[styles.scope, selected && styles.scopeSelected]}>
                                    <Text style={[styles.scopeLabel, selected && styles.strong]}>{label}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
                <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {body}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: galaxyColors.background },
    safe: { flex: 1 },
    header: { paddingHorizontal: space.s3, paddingTop: space.s1, paddingBottom: space.s3, gap: space.s2 },
    back: { minHeight: 48, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: space.s0 },
    pressed: { opacity: 0.7 },
    backLabel: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.navBlue },
    title: { ...typography.h2, lineHeight: undefined, color: galaxyColors.textPrimary },
    detail: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary },
    footnote: { ...typography.caption, lineHeight: undefined, color: galaxyColors.textSecondary, paddingTop: space.s3 },
    scopes: { flexDirection: 'row', gap: space.s2 },
    scope: {
        minHeight: 44, minWidth: 44, justifyContent: 'center', paddingHorizontal: space.s3,
        borderWidth: StyleSheet.hairlineWidth, borderColor: galaxyColors.border, borderRadius: space.s3,
    },
    scopeSelected: { borderColor: galaxyColors.navBlue, borderWidth: 2 },
    scopeLabel: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textPrimary },
    scroll: { flex: 1 },
    content: { paddingHorizontal: space.s3, paddingBottom: space.s6 },
    message: { gap: space.s3, paddingVertical: space.s4 },
    messageTitle: { ...typography.bodyStrong, lineHeight: undefined, color: galaxyColors.textPrimary },
    row: {
        minHeight: 44, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: space.s2,
        paddingVertical: space.s2, paddingHorizontal: space.s2,
        borderBottomWidth: StyleSheet.hairlineWidth, borderColor: galaxyColors.border,
    },
    rowMine: { borderWidth: 2, borderColor: galaxyColors.navBlue, borderRadius: space.s2 },
    rank: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary, minWidth: 44 },
    alias: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textPrimary, flexShrink: 1, flexGrow: 1 },
    xp: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textPrimary },
    strong: { fontWeight: '700', color: galaxyColors.textPrimary },
    gap: { ...typography.bodyRegular, lineHeight: undefined, color: galaxyColors.textSecondary, textAlign: 'center', paddingVertical: space.s1 },
});
