import React, { type ReactNode } from 'react';
import { View } from 'react-native';

/**
 * Shared Jest boundary for native Skia. Hosts retain the inputs that decide the
 * drawing; no SkSL compilation, rasterization or native performance is simulated.
 * Make functions are Jest mocks so consumers can inject null, exceptions or a
 * scenario-specific animation. Jest isolates this module between test files.
 */
function host(name: string) {
  const Host = ({ children, ...props }: { children?: ReactNode } & Record<string, unknown>) => (
    <View {...props} testID={typeof props.testID === 'string' ? props.testID : `skia-${name}`}>
      {children}
    </View>
  );
  Host.displayName = `SkiaMock${name}`;
  return Host;
}

export const Canvas = host('Canvas');
export const Fill = host('Fill');
export const Shader = host('Shader');
export const Group = host('Group');
export const ColorMatrix = host('ColorMatrix');
export const Skottie = host('Skottie');
export const Picture = host('Picture');
export const Paint = host('Paint');
export const BlendColor = host('BlendColor');

export const Skia = {
  RuntimeEffect: {
    Make: jest.fn((source: string) => ({ kind: 'effect', source })),
  },
  // No parser is pretended here: illustration tests supply their own animation,
  // with frame/slot/render observations. Null follows the real fallback path.
  Skottie: { Make: jest.fn((_source: string): unknown => null) },
  XYWHRect: (x: number, y: number, width: number, height: number) => ({ x, y, width, height }),
  PictureRecorder: jest.fn(() => ({
    beginRecording: jest.fn((_bounds: unknown) => ({ kind: 'canvas' })),
    finishRecordingAsPicture: jest.fn(() => ({ kind: 'picture' })),
  })),
};
