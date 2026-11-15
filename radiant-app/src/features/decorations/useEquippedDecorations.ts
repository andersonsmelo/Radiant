import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { AppConfig } from '../../config';
import { DecorationsService, type DecorationsState } from './DecorationsService';

/** Estado das decorações relido a cada foco. Com `ENABLE_DECORATIONS` desligada, nem lê: devolve `null`. */
export function useDecorationsState(): DecorationsState | null {
    const enabled = AppConfig.ENABLE_DECORATIONS;
    const [state, setState] = useState<DecorationsState | null>(null);
    useFocusEffect(useCallback(() => {
        if (!enabled) return;
        let alive = true;
        // Falha de leitura deixa o perfil sem enfeite, nunca quebrado.
        DecorationsService.sync().then(value => { if (alive) setState(value); }, () => undefined);
        return () => { alive = false; };
    }, [enabled]));
    return enabled ? state : null;
}
