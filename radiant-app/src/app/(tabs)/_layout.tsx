import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { radius, space } from '@/src/ui/styles';
import { galaxyColors } from '@/src/ui/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        sceneStyle: {
          backgroundColor: galaxyColors.background,
        },
        tabBarActiveTintColor: galaxyColors.navBlue,
        tabBarInactiveTintColor: galaxyColors.tabBarInactive,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarStyle: {
          backgroundColor: galaxyColors.tabBarSurface,
          borderTopColor: galaxyColors.border,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 8,
          paddingBottom: space.s1,
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 14,
          borderRadius: radius.rXl,
          shadowColor: galaxyColors.shadowHard,
          shadowOpacity: 0.5,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
          elevation: 16,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          // "Estude" e não "Home": a aba deixou de ser o painel de retomada do
          // dia e passou a ser a trilha inteira do currículo (2026-08-21). O
          // rótulo antigo prometia um lugar para onde voltar; o novo nomeia o
          // que se faz ali.
          title: 'Estude',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="graduationcap.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          // Progresso e Missões deixaram de ser abas em 2026-08-21 e passaram a
          // ser seções do Perfil, junto da identidade do aluno. A barra ficou com
          // duas abas: o que se faz (Estude) e quem faz (Perfil).
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
