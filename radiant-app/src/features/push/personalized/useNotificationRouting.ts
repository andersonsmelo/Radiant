/**
 * Toque no lembrete personalizado abre a rota que ele promete (F6). Montado no
 * layout das abas, que só existe depois dos portões do layout raiz. Só navega
 * para rotas da lista: o dado da notificação não decide destino arbitrário.
 */
import { useEffect } from 'react';
import { router } from 'expo-router';
import type * as ExpoNotifications from 'expo-notifications';
import { AppConfig } from '../../../config';
import type { ReminderRoute } from './composeReminder';

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
            router.push(route);
        };
        void Notifications.getLastNotificationResponseAsync().then(open, () => undefined);
        const subscription = Notifications.addNotificationResponseReceivedListener(open);
        return () => { active = false; subscription.remove(); };
    }, []);
}
