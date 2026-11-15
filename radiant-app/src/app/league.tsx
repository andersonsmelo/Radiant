import { Redirect } from 'expo-router';

import { AppConfig } from '@/src/config';
import LeagueScreen from '@/src/features/league/screens/LeagueScreen';

/** Com a liga desligada, a rota não existe para o aluno: volta para a Estude. */
export default function LeagueRoute() {
  return AppConfig.ENABLE_LEAGUE ? <LeagueScreen /> : <Redirect href="/" />;
}
