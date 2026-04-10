import { AppConfig } from '@/src/config';
import JourneyHomeScreen from '@/src/features/journey/screens/JourneyHomeScreen';
import HomeScreen from '@/src/features/home/screens/HomeScreen';

export default function HomeRoute() {
  return AppConfig.ENABLE_LEARNING_ROAD ? <JourneyHomeScreen /> : <HomeScreen />;
}
