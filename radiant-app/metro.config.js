const { withStorybook } = require('@storybook/react-native/withStorybook');

const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getSentryExpoConfig(__dirname);

// Read the canonical review artifact only for the explicitly opted-in local lab.
if (process.env.EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW === '1') {
  config.watchFolders = [...(config.watchFolders ?? []), require('node:path').resolve(__dirname, '../docs/evidence')];
}

const { withEditorialPreviewIsolation } = require('./scripts/editorial-preview-resolver.cjs');

module.exports = withEditorialPreviewIsolation(withStorybook(config, {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
  configPath: './.rnstorybook',
}), process.env.EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW === '1');
