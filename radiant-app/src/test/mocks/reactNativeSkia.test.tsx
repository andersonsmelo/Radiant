import React from 'react';
import { join } from 'node:path';
import { render } from '@testing-library/react-native';
import {
  BlendColor, Canvas, ColorMatrix, Fill, Group, Paint, Picture, Shader, Skia, Skottie,
} from '@shopify/react-native-skia';

// The double is itself the contract under test. Consumer tests separately assert
// the real components' shader inputs, fallbacks, frames, colors and light slots.
describe('o dublê global do Skia', () => {
  it('resolve o pacote pelo mapper compartilhado sem carregar o módulo nativo', () => {
    expect(require.resolve('@shopify/react-native-skia')).toBe(join(__dirname, 'reactNativeSkia.tsx'));
  });

  it('preserva children, tamanho, fonte e uniformes em vez de esconder a árvore', () => {
    // This is a mock effect, not a native SkRuntimeEffect.
    const effect = { kind: 'fixture-effect' };
    const source = <Canvas style={{ width: 200, height: 240 }}>
      <Fill><Shader source={effect as never} uniforms={{ bone: 0.75, size: [200, 240] }} /></Fill>
    </Canvas>;
    const screen = render(source);
    expect(screen.getByTestId('skia-Canvas').props.style).toEqual({ width: 200, height: 240 });
    expect(screen.getByTestId('skia-Fill').findByProps({ testID: 'skia-Shader' })).toBeTruthy();
    expect(screen.getByTestId('skia-Shader').props.source).toBe(effect);
    expect(screen.getByTestId('skia-Shader').props.uniforms).toEqual({ bone: 0.75, size: [200, 240] });
  });

  it('preserva animação, quadro, camada, cor, matriz e picture', () => {
    const animation = { kind: 'fixture-animation' };
    const picture = { kind: 'fixture-picture' };
    const matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
    const layer = <Paint><BlendColor color="#827263" mode="srcIn" /></Paint>;
    const screen = render(
      <Canvas><Group transform={[{ scale: 0.8 }]} layer={layer}>
        <Skottie animation={animation as never} frame={37} />
        <Picture picture={picture as never} />
        <ColorMatrix matrix={matrix} />
      </Group></Canvas>,
    );
    expect(screen.getByTestId('skia-Group').props.transform).toEqual([{ scale: 0.8 }]);
    expect(screen.getByTestId('skia-Group').props.layer).toBe(layer);
    const color = render(layer).getByTestId('skia-BlendColor');
    expect(color.props).toMatchObject({ color: '#827263', mode: 'srcIn' });
    expect(screen.getByTestId('skia-Skottie').props).toMatchObject({ animation, frame: 37 });
    expect(screen.getByTestId('skia-Picture').props.picture).toBe(picture);
    expect(screen.getByTestId('skia-ColorMatrix').props.matrix).toEqual(matrix);
  });

  it('aceita testID do consumidor e mantém os demais props', () => {
    const screen = render(<Canvas testID="my-canvas" pointerEvents="none" />);
    expect(screen.getByTestId('my-canvas').props.pointerEvents).toBe('none');
  });

  it.each(['RuntimeEffect', 'Skottie'] as const)('%s.Make permite sucesso, null e exceção sem contaminar a chamada seguinte', (api) => {
    const make = Skia[api].Make as jest.Mock;
    const result = { kind: 'controlled-result' };
    make.mockReturnValueOnce(result).mockReturnValueOnce(null).mockImplementationOnce(() => {
      throw new Error('controlled compile failure');
    });
    expect(make('source')).toBe(result);
    expect(make('source')).toBeNull();
    expect(() => make('source')).toThrow('controlled compile failure');
    // One-shot overrides expire, preserving the shared default implementation.
    if (api === 'RuntimeEffect') expect(make('next')).toEqual({ kind: 'effect', source: 'next' });
    else expect(make('next')).toBeNull();
  });

  it('expõe bounds, canvas e picture para observar a gravação de quadro parado', () => {
    const recorder = Skia.PictureRecorder();
    const bounds = Skia.XYWHRect(0, 0, 120, 120);
    expect(bounds).toEqual({ x: 0, y: 0, width: 120, height: 120 });
    expect(recorder.beginRecording(bounds)).toEqual({ kind: 'canvas' });
    expect(recorder.beginRecording).toHaveBeenCalledWith(bounds);
    expect(recorder.finishRecordingAsPicture()).toEqual({ kind: 'picture' });
  });
});
