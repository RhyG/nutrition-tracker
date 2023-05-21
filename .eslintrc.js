module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:import/errors', 'plugin:import/warnings'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'plugin:react/jsx-runtime'],
  rules: {
    'unicorn/better-regex': 'warn',
    'unicorn/catch-error-name': 'warn',
    'unicorn/consistent-destructuring': 'warn',
    'unicorn/consistent-function-scoping': 'warn',
    'unicorn/empty-brace-spaces': 'warn',
    'unicorn/error-message': 'warn',
    'unicorn/explicit-length-check': 'warn',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react-hooks/exhaustive-deps': [
          'warn',
          // Support custom useBlahCallback() hooks
          { additionalHooks: '(use\\w+Callback)' },
        ],
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
