import { useCallback, useEffect, useState } from 'react';

import type { HeartsSnapshot } from '../hearts/hearts.types';
import { conversionService, type ConversionMoment, type ConversionService } from './ConversionService';

type Invite = { sampleAvailable: boolean };

/**
 * Pede o convite do dia a cada vez que `active` passa a verdadeiro (a folha
 * abriu sem vidas, a comemoração apareceu). Fora disso, nada: o convite nunca
 * abre tela própria. Com a chave desligada, `takeInvite` devolve `null`.
 */
export function useConversionInvite(
    moment: ConversionMoment,
    active: boolean,
    service: Pick<ConversionService, 'takeInvite' | 'takeSample'> = conversionService,
    nowMs: () => number = Date.now,
): { invite: Invite | null; takeSample: () => Promise<HeartsSnapshot | null> } {
    const [invite, setInvite] = useState<Invite | null>(null);

    useEffect(() => {
        if (!active) return;
        let alive = true;
        service.takeInvite(moment, nowMs()).then(
            (next) => { if (alive) setInvite(next); },
            (cause) => { console.error('[useConversionInvite] Falha ao decidir o convite:', cause); },
        );
        return () => {
            alive = false;
            setInvite(null);
        };
    }, [active, moment, nowMs, service]);

    const takeSample = useCallback(async () => {
        const snapshot = await service.takeSample(nowMs());
        if (snapshot) setInvite((current) => (current ? { sampleAvailable: false } : current));
        return snapshot;
    }, [nowMs, service]);

    return { invite, takeSample };
}
