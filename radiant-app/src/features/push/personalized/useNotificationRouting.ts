/**
 * Toque no lembrete personalizado abre a rota que ele promete, e o lembrete se
 * recalcula quando o app vai para o fundo (F6). Montado no
 * layout das abas, que só existe depois dos portões do layout raiz. Só navega
 * para rotas da lista: o dado da notificação não decide destino arbitrário.
 */
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { router } from 'expo-router';
import type * as ExpoNotifications from 'expo-notifications';
import { AppConfig } from '../../../config';
import type { ReminderRoute } from './composeReminder';
import { PushService } from '../services/PushService';

const ALLOWED: readonly ReminderRoute[] = ['/', '/review'];

export function routeFromNotification(data: unknown): ReminderRoute | null {
    const url = typeof data === 'object' && data !== null ? (data as { url?: unknown }).url : undefined;
    return ALLOWED.find(route => route === url) ?? null;
}

// A última resposta continua disponível a cada montagem: sem esta marca, cada
// remontagem das abas repetiria a navegação do toque que abriu o app.
let lastHandled: string | null = null;
export function resetNotificationRoutingForTests(): void { lastHandled = null; }

export function useNotificationRouting(): void {
    useEffect(() => {
        if (!AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS) return;
        // eslint-disable-next-line @typescript-eslint/no-require-imports -- o módulo nativo só carrega com a flag ligada.
        const Notifications = require('expo-notifications') as typeof ExpoNotifications;
        let active = true;
        const open = (response: ExpoNotifications.NotificationResponse | null) => {
            if (!active || !response) return;
            const key = `${response.notification.request.identifier}:${response.notification.date}`;
            const route = routeFromNotification(response.notification.request.content.data);
            if (key === lastHandled || route === null) return;
            lastHandled = key;
            // A resposta guardada sobreviveria à próxima abertura a frio e repetiria a navegação.
            Notifications.clearLastNotificationResponse?.();
            router.push(route);
        };
        void Notifications.getLastNotificationResponseAsync().then(open, () => undefined);
        const subscription = Notifications.addNotificationResponseReceivedListener(open);
        // Quem estuda e fecha o app sem passar pela Estude teria, à noite, o convite para a
        // aula que já fez. Ao ir para o fundo, o lembrete se recalcula com o estudo de hoje.
        const background = AppState.addEventListener('change', state => {
            if (state === 'background') void PushService.scheduleDailyIfEligible({ reason: 'app_background' });
        });
        return () => { active = false; subscription.remove(); background.remove(); };
    }, []);
}
