import type { Preview } from '@storybook/react-native';
import { View } from 'react-native';

const preview: Preview = {
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
