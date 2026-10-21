import React from 'react';
import { render } from '@testing-library/react-native';
import { Skia } from '@shopify/react-native-skia';

import {
  useReducedMotionPreferenceState,
  type ReducedMotionPreference,
} from '../accessibility/useReducedMotionPreference';
import { medalColors } from '../theme';
import { LIGHT_SLOT, ThemeIllustration, illustrationAssets, type LottieSource } from './ThemeIllustration';
import { DEFAULT_POSTER_FRAME, ILLUSTRATION_THEMES, type IllustrationTheme } from './illustrationPlayback';

// O componente que toca a ilustração de tema pelo Skottie. O Jest não rasteriza
// Skia: o módulo é trocado por um dublê em que `Skia.Skottie.Make` é
// controlável, e as asserções recaem sobre o que decide o que o aluno vê — se há
// ilustração, em que quadro ela para, com que cor a silhueta é pintada e se o
// leitor de tela a ignora.
//
// O aviso de ilustração quebrada sai uma vez por tema na sessão, e não uma por
// nó da trilha. Esse registro é do módulo e atravessa os testes deste arquivo,
// então cada teste de aviso usa um tema que nenhum outro teste quebra.

jest.mock('@shopify/react-native-skia', () => {
  const ReactInMock = require('react');
  const { View } = require('react-native');
  const host = (name: string) => {
    const Host = ({ children, ...props }: { children?: unknown }) =>
      ReactInMock.createElement(View, { ...props, testID: `skia-${name}` }, children);
    Host.displayName = name;
    return Host;
  };
  return {
    Canvas: host('Canvas'),
    Group: host('Group'),
    Skottie: host('Skottie'),
    Picture: host('Picture'),
    Paint: host('Paint'),
    BlendColor: host('BlendColor'),
    Skia: {
      Skottie: { Make: jest.fn() },
      XYWHRect: (x: number, y: number, width: number, height: number) => ({ x, y, width, height }),
      PictureRecorder: jest.fn(() => ({
        beginRecording: jest.fn(() => ({ kind: 'canvas' })),
        finishRecordingAsPicture: jest.fn(() => ({ kind: 'picture' })),
      })),
    },
  };
});

jest.mock('../accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreferenceState: jest.fn(),
}));

const make = Skia.Skottie.Make as jest.Mock;
const setReducedMotion = (value: ReducedMotionPreference) =>
  (useReducedMotionPreferenceState as jest.Mock).mockReturnValue(value);

// A ilustração é escondida do leitor de tela, e a biblioteca de testes, por
// padrão, também não acha o que está escondido dele.
const HIDDEN = { includeHiddenElements: true };

/** Um `SkSkottieAnimation` de mentira, com o slot de luz dos JSON. */
function fakeAnimation() {
  const slots: Record<string, number> = { luz: 100 };
  const calls: string[] = [];
  return {
    calls,
    slots,
    duration: () => 2.4,
    fps: () => 60,
    size: () => ({ width: 120, height: 120 }),
    seekFrame: jest.fn((frame: number) => calls.push(`seek:${frame}`)),
    render: jest.fn(() => calls.push(`render:luz=${slots.luz}`)),
    getScalarSlot: jest.fn((key: string) => (key in slots ? slots[key] : null)),
    setScalarSlot: jest.fn((key: string, value: number) => {
      slots[key] = value;
      return true;
    }),
  };
}

const savedAssets = { ...illustrationAssets };
let warn: jest.SpyInstance;

beforeEach(() => {
  make.mockReset();
  setReducedMotion({ reducedMotionEnabled: false, resolved: true });
  warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  warn.mockRestore();
  for (const key of Object.keys(illustrationAssets) as IllustrationTheme[]) delete illustrationAssets[key];
  Object.assign(illustrationAssets, savedAssets);
});

const BROKEN: LottieSource = { v: '5.7.4', layers: 'quebrado' };

/** Os campos do Lottie que o contrato das ilustrações fixa. */
type LottieDoc = LottieSource & {
  w?: unknown;
  h?: unknown;
  fr?: unknown;
  ip?: unknown;
  op?: unknown;
  layers?: unknown;
  slots?: Record<string, unknown>;
};

/** Quantas opacidades (`o`, de camada, grupo ou preenchimento) o slot comanda. */
function opacitiesDrivenBy(node: unknown, sid: string): number {
  if (Array.isArray(node)) return node.reduce((sum: number, item) => sum + opacitiesDrivenBy(item, sid), 0);
  if (!node || typeof node !== 'object') return 0;
  return Object.entries(node as Record<string, unknown>).reduce((sum, [key, value]) => {
    const drives =
      key === 'o' && !!value && typeof value === 'object' && (value as { sid?: unknown }).sid === sid ? 1 : 0;
    return sum + drives + opacitiesDrivenBy(value, sid);
  }, 0);
}

// Os documentos de verdade, fotografados antes que algum teste troque um tema.
// O guarda vale para todo tema, inclusive o tubo: um JSON sem quadro de pose
// válido para no quadro 0 ou além do fim, e um sem o slot de luz deixa a luz
// acesa na silhueta do nó bloqueado.
describe('os Lottie das ilustrações', () => {
  it('todo tema tem asset', () => {
    expect(Object.keys(savedAssets).sort()).toEqual([...ILLUSTRATION_THEMES].sort());
  });

  describe.each(ILLUSTRATION_THEMES)('%s', (theme) => {
    const doc = () => savedAssets[theme] as LottieDoc | undefined;

    it('declara meta.posterFrame inteiro em [1, op − 1]', () => {
      const asset = doc();
      expect(asset).toBeDefined();
      const posterFrame = asset?.meta?.posterFrame;
      expect(Number.isInteger(posterFrame)).toBe(true);
      expect(posterFrame).toBeGreaterThanOrEqual(1);
      expect(posterFrame).toBeLessThanOrEqual(Number(asset?.op) - 1);
    });

    it('declara o slot escalar de luz, aceso, e apaga a luz por ele', () => {
      const asset = doc();
      expect(asset).toBeDefined();
      expect(asset?.slots?.[LIGHT_SLOT]).toEqual({ p: { a: 0, k: 100 } });
      expect(opacitiesDrivenBy(asset?.layers, LIGHT_SLOT)).toBeGreaterThan(0);
    });

    it('cumpre o formato: 120 × 120, 60 fps, laço de 144 quadros, até 12 camadas e 30 KB', () => {
      const asset = doc();
      expect(asset).toBeDefined();
      expect([asset?.w, asset?.h, asset?.fr, asset?.ip, asset?.op]).toEqual([120, 120, 60, 0, 144]);
      expect(Array.isArray(asset?.layers)).toBe(true);
      const layers = (asset?.layers ?? []) as unknown[];
      expect(layers.length).toBeGreaterThan(0);
      expect(layers.length).toBeLessThanOrEqual(12);
      expect(Buffer.byteLength(JSON.stringify(asset))).toBeLessThanOrEqual(30 * 1024);
    });
  });
});

describe('ThemeIllustration', () => {
  it('o tubo vem do JSON versionado, com o quadro de pose e o slot de luz', () => {
    const tubo = illustrationAssets.tubo as LottieSource & { slots?: Record<string, unknown> };
    expect(tubo.meta?.posterFrame).toBe(60);
    expect(tubo.slots?.[LIGHT_SLOT]).toEqual({ p: { a: 0, k: 100 } });
  });

  it('asset ausente mostra só a medalha e avisa uma vez', () => {
    delete illustrationAssets.radiacao;

    const first = render(<ThemeIllustration theme="radiacao" state="done" size={96} />);
    first.rerender(<ThemeIllustration theme="radiacao" state="next" size={96} />);
    const second = render(<ThemeIllustration theme="radiacao" state="locked" size={96} />);

    expect(first.toJSON()).toBeNull();
    expect(second.toJSON()).toBeNull();
    expect(make).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain('radiacao');
  });

  it.each([
    [
      'lança',
      'tomografia',
      (): never => {
        throw new Error('Unable to parse JSON');
      },
    ],
    ['devolve null', 'protecao', (): null => null],
  ] as const)('JSON inválido mostra só a medalha e avisa uma vez (Make %s)', (_, theme, behavior) => {
    illustrationAssets[theme] = BROKEN;
    make.mockImplementation(behavior);

    const first = render(<ThemeIllustration theme={theme} state="done" size={96} />);
    first.rerender(<ThemeIllustration theme={theme} state="next" size={120} />);
    const second = render(<ThemeIllustration theme={theme} state="done" size={96} />);

    expect(make).toHaveBeenCalled();
    expect(first.toJSON()).toBeNull();
    expect(second.toJSON()).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain(theme);
  });

  it('é decorativa para o leitor de tela', () => {
    make.mockReturnValue(fakeAnimation());

    const root = render(<ThemeIllustration theme="tubo" state="done" size={96} />).toJSON() as {
      props: Record<string, unknown>;
    } | null;

    expect(root).not.toBeNull();
    expect(root?.props.accessible).toBe(false);
    expect(root?.props.accessibilityElementsHidden).toBe(true);
    expect(root?.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(warn).not.toHaveBeenCalled();
  });

  it('desbloqueada e sem redução de movimento toca o Skottie em laço', () => {
    const animation = fakeAnimation();
    make.mockReturnValue(animation);

    const screen = render(<ThemeIllustration theme="tubo" state="next" size={96} />);

    expect(screen.getByTestId('skia-Skottie', HIDDEN).props.animation).toBe(animation);
    expect(screen.queryByTestId('skia-Picture', HIDDEN)).toBeNull();
    expect(screen.getByTestId('skia-Group', HIDDEN).props.layer).toBeUndefined();
  });

  it('reduzir movimento para no posterFrame do JSON, sem Skottie em laço', () => {
    const animation = fakeAnimation();
    make.mockReturnValue(animation);
    illustrationAssets.tubo = { meta: { posterFrame: 37 } };
    setReducedMotion({ reducedMotionEnabled: true, resolved: true });

    const screen = render(<ThemeIllustration theme="tubo" state="done" size={96} />);

    expect(screen.queryByTestId('skia-Skottie', HIDDEN)).toBeNull();
    expect(screen.getByTestId('skia-Picture', HIDDEN)).toBeTruthy();
    expect(screen.getByTestId('skia-Group', HIDDEN).props.layer).toBeUndefined();
    // Parada com a luz acesa: "reduzir movimento" não é silhueta.
    expect(animation.calls).toEqual(['seek:37', 'render:luz=100']);
    expect(animation.seekFrame).not.toHaveBeenCalledWith(0);
  });

  it('antes de saber a preferência de movimento, não começa a animar', () => {
    make.mockReturnValue(fakeAnimation());
    setReducedMotion({ reducedMotionEnabled: false, resolved: false });

    const screen = render(<ThemeIllustration theme="tubo" state="done" size={96} />);

    expect(screen.queryByTestId('skia-Skottie', HIDDEN)).toBeNull();
    expect(screen.getByTestId('skia-Picture', HIDDEN)).toBeTruthy();
  });

  it('bloqueada pinta a silhueta no posterFrame e apaga as luzes', () => {
    const animation = fakeAnimation();
    make.mockReturnValue(animation);
    illustrationAssets.tubo = { meta: { posterFrame: 37 } };

    const screen = render(<ThemeIllustration theme="tubo" state="locked" size={96} />);

    expect(screen.queryByTestId('skia-Skottie', HIDDEN)).toBeNull();
    expect(screen.getByTestId('skia-Picture', HIDDEN)).toBeTruthy();
    // A silhueta é a camada inteira repintada: `srcIn` mantém a forma (o alfa)
    // e troca a cor de tudo o que o Skottie desenhou.
    const layer = screen.getByTestId('skia-Group', HIDDEN).props.layer as React.ReactElement<{
      children: React.ReactElement<{ color: string; mode: string }>;
    }>;
    expect(layer.props.children.props.color).toBe(medalColors.locked.silhouette);
    expect(layer.props.children.props.mode).toBe('srcIn');
    // Quadro de pose, com a luz (o slot `luz`) apagada no desenho.
    expect(LIGHT_SLOT).toBe('luz');
    expect(animation.calls).toEqual(['seek:37', 'render:luz=0']);
    // E devolvida depois, para a mesma animação poder voltar a tocar.
    expect(animation.slots.luz).toBe(100);
  });

  it('posterFrame fora do laço no JSON: para no quadro padrão e avisa uma vez', () => {
    const animation = fakeAnimation();
    make.mockReturnValue(animation);
    // O laço do dublê tem 144 quadros (2,4 s a 60 fps): o 144 já é o quadro 0.
    illustrationAssets.ressonancia = { meta: { posterFrame: 144 } };
    setReducedMotion({ reducedMotionEnabled: true, resolved: true });

    const screen = render(<ThemeIllustration theme="ressonancia" state="done" size={96} />);
    screen.rerender(<ThemeIllustration theme="ressonancia" state="locked" size={96} />);

    expect(animation.seekFrame).toHaveBeenCalledWith(DEFAULT_POSTER_FRAME);
    expect(animation.seekFrame).not.toHaveBeenCalledWith(144);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain('ressonancia');
  });

  it('escala o quadro do Lottie para o tamanho pedido', () => {
    make.mockReturnValue(fakeAnimation());

    const screen = render(<ThemeIllustration theme="tubo" state="done" size={96} />);

    expect(screen.getByTestId('skia-Group', HIDDEN).props.transform).toEqual([{ scale: 96 / 120 }]);
    expect(screen.getByTestId('skia-Canvas', HIDDEN).props.style).toEqual({ width: 96, height: 96 });
  });
});
