import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import type { HeartsSnapshot } from '../hearts/hearts.types';
import { conversionService, type ConversionMoment, type ConversionService } from './ConversionService';

type Invite = { sampleAvailable: boolean };
type InviteService = Pick<ConversionService, 'peekInvite' | 'markInviteSeen' | 'takeSample'>;

/**
 * Pede o convite do dia a cada vez que `active` passa a verdadeiro (a folha
 * abriu sem vidas, a comemoração apareceu). Fora disso, nada: o convite nunca
 * abre tela própria. O dia só é consumido quando o convite chega à tela; se a
 * folha fechar antes da decisão, nada é gravado. Com a chave desligada,
 * `peekInvite` devolve `null`.
 */
export function useConversionInvite(
    moment: ConversionMoment,
    active: boolean,
    service: InviteService = conversionService,
    nowMs: () => number = Date.now,
): { invite: Invite | null; takeSample: () => Promise<HeartsSnapshot | null> } {
    const [invite, setInvite] = useState<Invite | null>(null);
    // O relógio não reinicia a decisão: só abrir e fechar a pausa reinicia.
    const clock = useRef(nowMs);
    clock.current = nowMs;

    useEffect(() => {
        if (!active) return;
        let alive = true;
        void service.peekInvite(moment, clock.current()).then((next) => {
            if (!alive || next === null) return;
            setInvite(next);
            void service.markInviteSeen(moment, clock.current());
        });
        return () => {
            alive = false;
            setInvite(null);
        };
    }, [active, moment, service]);

    const takeSample = useCallback(async () => {
        const snapshot = await service.takeSample(clock.current());
        if (snapshot) setInvite((current) => (current ? { sampleAvailable: false } : current));
        return snapshot;
    }, [service]);

    return { invite, takeSample };
}

/** Maior espera que o `setTimeout` aceita; acima disso ele dispara na hora. */
const MAX_TIMER_MS = 2 ** 31 - 1;

/**
 * Chama `onExpire` quando `unlimitedUntil` vence, para a tela reler as vidas.
 * Sem isso, a amostra de 30 min acabava no meio da aula com o HUD ainda em ∞, e
 * a primeira vida perdida depois dela não era anunciada (revisão da F8). Datas
 * além do limite do timer (assinatura) ficam com a releitura que já existe.
 */
export function useUnlimitedExpiry(unlimitedUntil: string | null, onExpire: () => void, nowMs: () => number = Date.now): void {
    useEffect(() => {
        if (unlimitedUntil === null) return;
        const expiresAt = Date.parse(unlimitedUntil);
        if (!Number.isFinite(expiresAt)) return;
        // O timer dorme com o app no fundo; a volta confere o relógio.
        const subscription = AppState.addEventListener('change', (status) => {
            if (status === 'active' && nowMs() >= expiresAt) onExpire();
        });
        const remaining = expiresAt - nowMs();
        const timer = remaining > MAX_TIMER_MS ? null : setTimeout(onExpire, Math.max(0, remaining) + 1);
        return () => {
            subscription.remove();
            if (timer !== null) clearTimeout(timer);
        };
    }, [nowMs, onExpire, unlimitedUntil]);
}
