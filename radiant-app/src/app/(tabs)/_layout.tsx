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
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      />
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
        name="progress"
        options={{
          title: 'Progresso',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="chart.bar.fill" color={color} />
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
    </Tabs>
  );
}
