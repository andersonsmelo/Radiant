import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type MaterialIconsProps = React.ComponentProps<typeof MaterialIcons>;

export type DecorativeIconName = MaterialIconsProps['name'];

/**
 * A MaterialIcons glyph that stays out of the accessibility tree.
 *
 * Icon fonts render their glyphs as private-use characters, so an exposed icon
 * is announced by VoiceOver as an unreadable codepoint (``, ``) in the
 * middle of the surrounding content. Every icon in this app sits beside a text
 * label or inside a control that already carries its own name, so none of them
 * should be reachable on their own.
 *
 * Use this instead of MaterialIcons directly. If an icon ever becomes the only
 * carrier of a piece of information, give that meaning to its container's
 * accessibility label rather than exposing the glyph.
 */
export function DecorativeIcon(props: MaterialIconsProps) {
  return (
    <MaterialIcons
      {...props}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
