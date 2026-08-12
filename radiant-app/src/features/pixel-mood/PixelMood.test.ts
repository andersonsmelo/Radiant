import AsyncStorage from '@react-native-async-storage/async-storage';
import { PixelMood } from './PixelMood';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

beforeEach(() => {
  jest.clearAllMocks();
  storage.getItem.mockResolvedValue(null);
  PixelMood.resetSession();
});

describe('resolveOpening', () => {
  const hoje = new Date('2026-08-11T12:00:00Z');

  it('trata lastActiveDate nulo como primeiro acesso, nunca como ausência', () => {
    // Nulo não é zero: nulo é "não há informação". A conta ingênua manda o
    // usuário recém-instalado para o pool de ausência, e a primeira coisa que
    // ele veria seria "olha só quem lembrou que radiologia existe" — dito a
    // alguém que nunca esteve lá.
    expect(PixelMood.resolveOpening(null, hoje)).toBe('abriu-o-app');
  });

  it('reconhece ausência a partir de três dias', () => {
    expect(PixelMood.resolveOpening('2026-08-08', hoje)).toBe('voltou-depois-de-sumir');
  });

  it('não trata dois dias como ausência', () => {
    expect(PixelMood.resolveOpening('2026-08-09', hoje)).toBe('abriu-o-app');
  });

  it('trata data futura como abertura normal', () => {
    // Relógio do aparelho andou para trás, ou fuso. Intervalo negativo vira 0.
    expect(PixelMood.resolveOpening('2026-08-20', hoje)).toBe('abriu-o-app');
  });

  it('trata data ilegível como abertura normal, nunca como ausência', () => {
    // Um valor que o serviço não consegue interpretar precisa degradar para
    // o momento acolhedor, nunca para o que zoa o usuário por ter sumido.
    // Diferente do caso nulo, esse aqui chega a construir um Date — só que
    // um Date inválido — então exercita o guard de Number.isNaN, não o
    // curto-circuito do `!lastActiveDate`.
    expect(PixelMood.resolveOpening('not-a-date', hoje)).toBe('abriu-o-app');
  });
});

describe('resolve', () => {
  it('devolve expressão e frase do pool do momento', async () => {
    const r = await PixelMood.resolve('voltou-depois-de-sumir');
    expect(r).not.toBeNull();
    expect(r!.expression).toBe('emburrado');
    expect(typeof r!.phrase).toBe('string');
    expect(r!.phrase.length).toBeGreaterThan(0);
  });

  it('nunca repete a última frase mostrada daquele pool', async () => {
    storage.getItem.mockResolvedValue('0');
    for (let i = 0; i < 20; i += 1) {
      PixelMood.resetSession();
      const r = await PixelMood.resolve('voltou-depois-de-sumir');
      expect(r!.phraseIndex).not.toBe(0);
    }
  });

  it('devolve null no segundo disparo do mesmo momento na sessão', async () => {
    expect(await PixelMood.resolve('abriu-o-app')).not.toBeNull();
    expect(await PixelMood.resolve('abriu-o-app')).toBeNull();
  });

  it('ainda devolve frase quando o AsyncStorage falha', async () => {
    // O mascote nunca pode ser o motivo de uma tela falhar.
    storage.getItem.mockRejectedValue(new Error('storage offline'));
    const r = await PixelMood.resolve('abriu-o-app');
    expect(r).not.toBeNull();
  });

  it('devolve null para pool vazio', async () => {
    const r = await PixelMood.resolve('momento-inexistente' as never);
    expect(r).toBeNull();
  });

  it('ainda devolve frase, sem deixar a rejeição escapar, quando a escrita no AsyncStorage falha', async () => {
    // O `.catch(() => {})` no setItem existe para engolir exatamente essa
    // rejeição. Sem teste, é um catch em que confiamos por fé — aqui
    // verificamos que ele de fato segura a rejeição e que a frase ainda
    // chega ao chamador mesmo com a escrita falhando.
    storage.setItem.mockRejectedValue(new Error('storage offline ao gravar'));
    const r = await PixelMood.resolve('abriu-o-app');
    expect(r).not.toBeNull();
  });
});

describe('resolveSporadic', () => {
  it('permite uma nova fala depois do intervalo sem repetir a anterior', async () => {
    const primeira = await PixelMood.resolveSporadic('abriu-o-app');
    const segunda = await PixelMood.resolveSporadic('abriu-o-app');

    expect(primeira).not.toBeNull();
    expect(segunda).not.toBeNull();
    expect(segunda!.phraseIndex).not.toBe(primeira!.phraseIndex);
  });
});
