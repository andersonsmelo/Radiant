import AsyncStorage from '@react-native-async-storage/async-storage';
import { LessonRatingService } from './LessonRatingService';
import { TelemetryService } from '../../telemetry/TelemetryService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn(), setItem: jest.fn() },
}));

describe('LessonRatingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    jest.spyOn(TelemetryService, 'track').mockResolvedValue(undefined);
  });

  it('devolve null quando a lição nunca foi avaliada', async () => {
    await expect(LessonRatingService.getRating('licao-1')).resolves.toBeNull();
  });

  it('grava a nota e emite o evento', async () => {
    await LessonRatingService.rate('licao-1', 4);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
    expect(TelemetryService.track).toHaveBeenCalledWith('lesson_rated', { lessonId: 'licao-1', rating: 4 });
  });

  it('não sobrescreve nem reemite quando já existe nota', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ 'licao-1': 5 }));
    await LessonRatingService.rate('licao-1', 2);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(TelemetryService.track).not.toHaveBeenCalled();
  });

  it('recusa nota fora de 1 a 5 sem gravar', async () => {
    await LessonRatingService.rate('licao-1', 9);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(TelemetryService.track).not.toHaveBeenCalled();
  });
});
