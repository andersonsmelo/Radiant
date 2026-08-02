import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ExternalLink } from '../../../../components/external-link';
import { LEGAL_LINKS } from '../../../config/legal';
import { galaxyColors } from '../../../ui/theme';
import { radius, space, typography } from '../../../ui/styles';

const links = [LEGAL_LINKS.privacy, LEGAL_LINKS.support];

interface LegalLinksCardProps {
  /** Ação extra renderizada dentro do card, abaixo dos links. */
  footer?: React.ReactNode;
}

export function LegalLinksCard({ footer }: LegalLinksCardProps = {}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title} accessibilityRole="header">
        Ajuda e informações
      </Text>

      <View>
        {links.map((link, index) => (
          <ExternalLink key={link.href} href={link.href} asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={link.label}
              accessibilityHint={link.accessibilityHint}
              style={({ pressed }) => [
                styles.link,
                index > 0 && styles.divider,
                pressed && styles.linkPressed,
              ]}
            >
              <View style={styles.copy}>
                <Text style={styles.linkLabel}>{link.label}</Text>
                <Text style={styles.description}>{link.description}</Text>
              </View>
              <Text
                style={styles.arrow}
                accessibilityElementsHidden
                importantForAccessibility="no"
              >
                ↗
              </Text>
            </Pressable>
          </ExternalLink>
        ))}
      </View>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: galaxyColors.surface,
    borderRadius: radius.rLg,
    borderWidth: 1,
    borderColor: galaxyColors.border,
    padding: space.s3,
    marginBottom: space.s2,
    gap: space.s1,
  },
  title: {
    ...typography.bodyStrong,
    color: galaxyColors.textPrimary,
  },
  link: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    paddingVertical: space.s2,
    paddingHorizontal: space.s1,
    borderRadius: radius.rMd,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: galaxyColors.border,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  linkPressed: {
    backgroundColor: galaxyColors.surfaceActive,
  },
  copy: {
    flex: 1,
    gap: space.s0,
  },
  linkLabel: {
    ...typography.bodyStrong,
    color: galaxyColors.textPrimary,
  },
  description: {
    ...typography.micro,
    color: galaxyColors.textSecondary,
  },
  arrow: {
    ...typography.bodyStrong,
    color: galaxyColors.textSecondary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: galaxyColors.border,
    paddingTop: space.s2,
  },
});
