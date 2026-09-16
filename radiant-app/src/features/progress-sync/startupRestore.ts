import type { BackupState } from './progressSync.types';

/**
 * Orquestração do restore na abertura, extraída do `RootLayout`.
 *
 * Estava embutida num efeito do React, o que a tornava intestável: o único
 * teste que existia mockava `restoreOnLaunch` e provava apenas que o **mock**
 * seria chamado naquela árvore — nada sobre estado real, ordem real ou early
 * return. O defeito reprovado em aparelho vivia exatamente aí.
 */

/** Só forma e decisão. Nunca payload, nó, identificador de iCloud ou dado do aluno. */
export type EventoDeAbertura =
    | { etapa: 'inicio'; chaveLocalExiste: boolean; decidido: boolean; ligado: boolean }
    | { etapa: 'hidratacao'; ok: boolean }
    | { etapa: 'restore'; ok: boolean; decidido: boolean; ligado: boolean; temData: boolean };

export type DependenciasDeAbertura = {
    lerEstado(): Promise<BackupState>;
    hidratarJornada(): Promise<unknown>;
    restaurar(nowMs: number): Promise<BackupState>;
    agora?(): number;
    registrar?(evento: EventoDeAbertura): void;
};

/**
 * Hidrata a jornada e restaura o backup, **isolando as falhas**.
 *
 * A versão anterior encadeava `catálogo → hidratação → restore` sob um único
 * `.catch`. Qualquer rejeição na hidratação pulava o restore inteiro, em
 * silêncio, com o app abrindo normalmente — indistinguível de "não havia
 * backup". Aqui cada etapa tem o próprio tratamento, e **a falha de uma não
 * cancela a outra**.
 *
 * A ordem continua importando: `LocalProgressAdapter.applyJourney` só mescla
 * trilhas que já existem no storage, então hidratar primeiro é o que faz os nós
 * concluídos voltarem. Mas hidratação que falha não deve custar XP, sequência e
 * agenda, que voltam de qualquer jeito.
 */
export async function restaurarBackupNaAbertura(deps: DependenciasDeAbertura): Promise<void> {
    const registrar = deps.registrar ?? (() => undefined);
    const agora = deps.agora ?? Date.now;

    try {
        const estado = await deps.lerEstado();
        registrar({
            etapa: 'inicio',
            chaveLocalExiste: estado.decided,
            decidido: estado.decided,
            ligado: estado.enabled,
        });
    } catch (cause) {
        console.error('[abertura] Falha ao ler o estado do backup:', cause);
    }

    try {
        await deps.hidratarJornada();
        registrar({ etapa: 'hidratacao', ok: true });
    } catch (cause) {
        // NÃO retorna. Sem a jornada hidratada os nós concluídos não voltam,
        // mas XP, sequência e agenda voltam — e meio progresso restaurado é
        // muito melhor que nenhum.
        registrar({ etapa: 'hidratacao', ok: false });
        console.error('[abertura] Falha ao hidratar a jornada; o restore segue mesmo assim:', cause);
    }

    try {
        const estado = await deps.restaurar(agora());
        registrar({
            etapa: 'restore',
            ok: true,
            decidido: estado.decided,
            ligado: estado.enabled,
            temData: estado.lastBackupAt !== null,
        });
    } catch (cause) {
        registrar({ etapa: 'restore', ok: false, decidido: false, ligado: false, temData: false });
        console.error('[abertura] Falha ao restaurar o backup:', cause);
    }
}
