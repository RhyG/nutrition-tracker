const esModules = [
  'react-native',
  'react-spring',
  'expo',
  '@react-native',
  '@unimodules',
  '@react-native-firebase',
  '@react-native-community',
  '@react-native-segmented-control',
  '@react-navigation',
];

module.exports = {
  /**
   * Automatically clears all mocks after every unit test
   */
  clearMocks: true,
  /**
   * Specifies which transformers to use for which file extensions
   */
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  /**
   * Strictly related to the `transform` option above. Tells Jest to avoid transforming files
   * that match the regex patterns below.
   */
  transformIgnorePatterns: ['node_modules/(?!@ngrx|(?!nanoid))'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/app/$1',
    '@e2e/(.*)': '<rootDir>/e2e/$1',
    '@tests/(.*)': '<rootDir>/jest/$1',
  },
  /**
   * Uses the default `react-native` jest preset. This will never be changed, and needs to stay here.
   */
  preset: 'react-native',
  /**
   * Tells jest which test environment to use. We'll never have to change this, as React Native
   * environments are essentially the same as a NodeJS environment
   */
  testEnvironment: 'node',
  /**
   * Tells Jest which files to look for when testing
   */
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testTimeout: 30000,
  /**
   * Tells Jest to ignore the following files and/or folders
   */
  testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/e2e'],
};
