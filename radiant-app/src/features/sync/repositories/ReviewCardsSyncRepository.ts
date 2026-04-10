import { AuthService } from '../../auth/AuthService';
import { apiRequest } from '../../../lib/api';
import type { ReviewCardSyncPayload } from '../types';

export class ReviewCardsSyncRepository {
    static async syncCard(payload: ReviewCardSyncPayload): Promise<void> {
        const accessToken = await AuthService.getValidAccessToken();
        if (!accessToken) {
            return;
        }

        await apiRequest(
            '/v1/sync/review-cards',
            {
                method: 'PUT',
                body: JSON.stringify(payload),
            },
            accessToken
        );
    }
}
