// Fallback for using MaterialIcons on Android and web.

import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DecorativeIcon } from '@/components/ui/DecorativeIcon';

type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 *
 * Deliberately NOT cast to `Record<SymbolViewProps['name'], ...>`. That cast
 * widened `keyof typeof MAPPING` to every SF Symbol name, so a caller could ask
 * for an unmapped icon, typecheck cleanly, and get `MAPPING[name] === undefined`
 * at runtime — MaterialIcons then renders nothing. Two tab bar icons shipped
 * blank on Android that way until 2026-07-28, when the app was first run on the
 * platform. Without the cast, an unmapped name is a compile error, which is
 * where a missing icon should surface.
 */
const MAPPING = {
  'house.fill': 'home',
  'graduationcap.fill': 'school',
  'chart.bar.fill': 'bar-chart',
  sparkles: 'auto-awesome',
  'bolt.fill': 'bolt',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} satisfies Partial<Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>>;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 *
 * Renders through `DecorativeIcon` so the glyph stays out of the accessibility
 * tree. Icon fonts draw private-use codepoints, so an exposed glyph joins the
 * accessible name of whatever contains it — on Android the tab bar announced an
 * unreadable character before "Home" and "Progresso".
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <DecorativeIcon color={color} size={size} name={MAPPING[name]} style={style} />;
}
