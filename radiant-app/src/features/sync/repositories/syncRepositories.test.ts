import { AuthService } from '../../auth/AuthService';
import { apiRequest } from '../../../lib/api';
import { LessonProgressSyncRepository } from './LessonProgressSyncRepository';
import { ReviewCardsSyncRepository } from './ReviewCardsSyncRepository';

jest.mock('../../auth/AuthService', () => ({ AuthService: { getValidAccessToken: jest.fn() } }));
jest.mock('../../../lib/api', () => ({ apiRequest: jest.fn() }));

const getValidAccessToken = AuthService.getValidAccessToken as jest.MockedFunction<typeof AuthService.getValidAccessToken>;

// Auditoria de 2026-11-10: sem sessão, os dois voltavam sem erro, e a fila
// tratava o item como enviado: tudo saía da fila sem chegar ao servidor.
describe('repositórios de sincronização sem sessão', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getValidAccessToken.mockResolvedValue(null);
  });

  it('o progresso da aula falha, para continuar na fila', async () => {
    await expect(LessonProgressSyncRepository.syncQuizResult({
      lessonId: 'lesson-1', totalQuestions: 10, correctAnswers: 8, answeredAtIso: '2026-03-29T10:00:00.000Z',
    })).rejects.toThrow('not-authenticated');
    expect(apiRequest).not.toHaveBeenCalled();
  });

  it('o cartão de revisão falha, para continuar na fila', async () => {
    await expect(ReviewCardsSyncRepository.syncCard({
      lessonId: 'lesson-1', easeFactor: 2.3, intervalDays: 4, repetitions: 3, nextReviewAtIso: '2026-03-30T10:00:00.000Z',
      lastReviewedAtIso: '2026-03-29T10:00:00.000Z', createdAtIso: '2026-03-20T10:00:00.000Z',
    })).rejects.toThrow('not-authenticated');
    expect(apiRequest).not.toHaveBeenCalled();
  });
});
