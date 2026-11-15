import React from 'react';
import { Redirect } from 'expo-router';
import { AppConfig } from '../config';
import DecorationsScreen from '../features/decorations/screens/DecorationsScreen';

/** `/decoracoes` (F6). Com `ENABLE_DECORATIONS` desligada, a rota volta para a Estude. */
export default function DecoracoesRoute() {
  if (!AppConfig.ENABLE_DECORATIONS) return <Redirect href="/" />;
  return <DecorationsScreen />;
}
