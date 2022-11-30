module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@app': path.resolve(__dirname, './app'),
            '@config': path.resolve(__dirname, './app/config'),
            '@theme': path.resolve(__dirname, './app/theme'),
            '@e2e': path.resolve(__dirname, './e2e'),
            '@components': path.resolve(__dirname, './app/components'),
            '@feature': path.resolve(__dirname, './app/screens'),
            '@food-journal': path.resolve(__dirname, './app/screens/food-journal'),
            '@goals': path.resolve(__dirname, './app/screens/goals'),
            '@about': path.resolve(__dirname, './app/screens/about'),
            '@calculators': path.resolve(__dirname, './app/screens/calculators'),
          },
          cwd: 'babelrc',
          root: ['./app'],
          extensions: ['.e2e.ts', '.e2e.tsx', '.d.ts', '.ts', '.tsx', '.js', '.ios.js', '.android.js'],
        },
      ],
    ],
  };
};
