import type { BackupState, EventoDePull, ObservadorDePull } from './progressSync.types';

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
    | {
          etapa: 'inicio';
          /** Medição FÍSICA da chave no storage, não inferência a partir do conteúdo. */
          chaveLocalExiste: boolean;
          /** Houve decisão registrada no conteúdo do estado. */
          decisaoLocalRegistrada: boolean;
          ligado: boolean;
      }
    | { etapa: 'hidratacao'; ok: boolean }
    /** Repassado do ponto da chamada de `cloud.pull()`, dentro do serviço. */
    | EventoDePull
    | { etapa: 'restore'; ok: boolean; decisaoLocalRegistrada: boolean; ligado: boolean; temData: boolean };

export type DependenciasDeAbertura = {
    lerEstado(): Promise<BackupState>;
    /** Medição física da existência da chave de estado. */
    chaveLocalExiste(): Promise<boolean>;
    hidratarJornada(): Promise<unknown>;
    /** Recebe o observador para que o `kind` do pull seja visto no ponto da chamada. */
    restaurar(nowMs: number, observar: ObservadorDePull): Promise<BackupState>;
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
        const [estado, chaveExiste] = await Promise.all([deps.lerEstado(), deps.chaveLocalExiste()]);
        registrar({
            etapa: 'inicio',
            chaveLocalExiste: chaveExiste,
            decisaoLocalRegistrada: estado.decided,
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
        // O observador é repassado ao serviço para que o `kind` do `pull` seja
        // registrado NO PONTO DA CHAMADA. Sem isso, `ok:true` com `ligado:false`
        // sairia igual para "não há registro" e para "há registro com opt-out
        // remoto" — e a validação em aparelho voltaria ambígua.
        const estado = await deps.restaurar(agora(), (evento) => registrar(evento));
        registrar({
            etapa: 'restore',
            ok: true,
            decisaoLocalRegistrada: estado.decided,
            ligado: estado.enabled,
            temData: estado.lastBackupAt !== null,
        });
    } catch (cause) {
        registrar({
            etapa: 'restore', ok: false,
            decisaoLocalRegistrada: false, ligado: false, temData: false,
        });
        console.error('[abertura] Falha ao restaurar o backup:', cause);
    }
}
