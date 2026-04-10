module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
  watchman: false,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo|@expo|@sentry/react-native|react-clone-referenced-element)',
  ],
};
