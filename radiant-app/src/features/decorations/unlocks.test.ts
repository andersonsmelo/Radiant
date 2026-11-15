import { DECORATIONS, type Decoration } from './catalog';
import { availableIds, howToEarn, meetsRule, newlyEarned, resolveEquipped, type DecorationProgress } from './unlocks';

const none: DecorationProgress = { lessonsCompleted: 0, unitsCompleted: 0, streakDays: 0, allMissionsDoneToday: false, level: 1 };
const byId = (id: string) => DECORATIONS.find(d => d.id === id) as Decoration;

describe('meetsRule', () => {
  it.each<[Decoration['rule'], Partial<DecorationProgress>, boolean]>([
    [{ kind: 'aulas', count: 1 }, { lessonsCompleted: 1 }, true],
    [{ kind: 'aulas', count: 1 }, {}, false],
    [{ kind: 'unidades', count: 3 }, { unitsCompleted: 2 }, false],
    [{ kind: 'unidades', count: 3 }, { unitsCompleted: 3 }, true],
    [{ kind: 'sequencia', days: 7 }, { streakDays: 6 }, false],
    [{ kind: 'sequencia', days: 7 }, { streakDays: 7 }, true],
    [{ kind: 'missoes-do-dia' }, { allMissionsDoneToday: true }, true],
    [{ kind: 'nivel', level: 3 }, { level: 2 }, false],
    [{ kind: 'nivel', level: 3 }, { level: 4 }, true],
    [{ kind: 'assinante' }, { lessonsCompleted: 99, unitsCompleted: 24, streakDays: 365, level: 50 }, false],
  ])('%p com %p → %p', (rule, over, expected) => {
    expect(meetsRule(rule, { ...none, ...over })).toBe(expected);
  });
});

describe('newlyEarned', () => {
  it('quem já cumpriu tudo na atualização ganha tudo de uma vez, sem os exclusivos', () => {
    const veteran = { lessonsCompleted: 80, unitsCompleted: 12, streakDays: 30, allMissionsDoneToday: true, level: 9 };
    const earned = newlyEarned(veteran, []);
    expect(earned).toHaveLength(8);
    expect(earned.some(id => byId(id).rule.kind === 'assinante')).toBe(false);
  });

  it('o que já foi ganho não volta a aparecer como novo', () => {
    expect(newlyEarned({ ...none, lessonsCompleted: 1 }, ['moldura-aurora'])).toEqual([]);
  });
});

describe('availableIds e resolveEquipped', () => {
  it('ganho fica ganho; exclusivo só enquanto assina', () => {
    expect(availableIds(['moldura-aurora'], false)).toEqual(new Set(['moldura-aurora']));
    expect(availableIds(['moldura-aurora'], true).has('moldura-ouro')).toBe(true);
  });

  it('item equipado que deixou de estar disponível volta ao padrão, sem apagar a escolha', () => {
    const equipped = { moldura: 'moldura-ouro', selo: 'selo-faisca' };
    const resolved = resolveEquipped(equipped, availableIds(['selo-faisca'], false));
    expect(resolved).toEqual({ moldura: null, selo: byId('selo-faisca'), cartao: null });
    expect(equipped.moldura).toBe('moldura-ouro');
  });

  it('id desconhecido ou de outro encaixe não equipa', () => {
    const available = availableIds(['selo-faisca'], false);
    expect(resolveEquipped({ moldura: 'selo-faisca', selo: 'inexistente' }, available)).toEqual({ moldura: null, selo: null, cartao: null });
  });
});

describe('howToEarn', () => {
  it.each<[Decoration['rule'], string]>([
    [{ kind: 'aulas', count: 1 }, 'Conclua sua primeira aula'],
    [{ kind: 'aulas', count: 5 }, 'Conclua 5 aulas'],
    [{ kind: 'unidades', count: 1 }, 'Conclua uma unidade inteira'],
    [{ kind: 'unidades', count: 3 }, 'Conclua 3 unidades'],
    [{ kind: 'sequencia', days: 7 }, 'Estude 7 dias seguidos'],
    [{ kind: 'missoes-do-dia' }, 'Conclua as três missões de um dia'],
    [{ kind: 'nivel', level: 3 }, 'Chegue ao nível 3'],
    [{ kind: 'assinante' }, 'Exclusivo do Radiant Ilimitado'],
  ])('%p → %p', (rule, text) => {
    expect(howToEarn(rule)).toBe(text);
  });
});
