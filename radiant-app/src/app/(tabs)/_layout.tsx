import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { radius, space } from '@/src/ui/styles';

const TAB_COLORS = {
  background: '#03030d',
  surface: 'rgba(10,10,30,0.92)',
  border: 'rgba(255,255,255,0.08)',
  active: '#4D7FFF',
  inactive: 'rgba(255,255,255,0.35)',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        sceneStyle: {
          backgroundColor: TAB_COLORS.background,
        },
        tabBarActiveTintColor: TAB_COLORS.active,
        tabBarInactiveTintColor: TAB_COLORS.inactive,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarStyle: {
          backgroundColor: TAB_COLORS.surface,
          borderTopColor: TAB_COLORS.border,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 8,
          paddingBottom: space.s1,
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 14,
          borderRadius: radius.rXl,
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
          elevation: 16,
        },
      }}
    >
      <Tabs.Screen
        name="galaxy"
        options={{
          title: 'Galáxia',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="sparkles" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'Missões',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="bolt.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progresso',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="chart.bar.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
