const { withStorybook } = require('@storybook/react-native/withStorybook');

const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getSentryExpoConfig(__dirname);

module.exports = withStorybook(config, {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
  configPath: './.rnstorybook',
});
