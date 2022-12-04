module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:import/errors', 'plugin:import/warnings'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'plugin:react/jsx-runtime'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      'babel-module': {
        '@theme': './app/theme',
        '@app': './app',
        '@components': './app/components',
        '@store': './app/store',
        '@hooks': './app/hooks',
        '@config': './app/config',
        '@types': './app/types',
      },
    },
  },
};
