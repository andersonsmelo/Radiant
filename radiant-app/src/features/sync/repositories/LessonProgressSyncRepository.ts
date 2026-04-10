import { AuthService } from '../../auth/AuthService';
import { apiRequest } from '../../../lib/api';
import type { LessonProgressSyncPayload } from '../types';

export class LessonProgressSyncRepository {
    static async syncQuizResult(payload: LessonProgressSyncPayload): Promise<void> {
        const accessToken = await AuthService.getValidAccessToken();
        if (!accessToken) {
            return;
        }

        await apiRequest(
            '/v1/sync/lesson-progress',
            {
                method: 'PUT',
                body: JSON.stringify(payload),
            },
            accessToken
        );
    }
}
