module.exports = function (api) {
  if (api) api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./app'],
          alias: {
            '@app': path.resolve(__dirname, './app'),
            // '@config': path.resolve(__dirname, './app/config'),
            // '@theme': path.resolve(__dirname, './app/theme'),
            // '@screens': path.resolve(__dirname, './app/screens'),
            // '@components': path.resolve(__dirname, './app/components'),
            // '@e2e': path.resolve(__dirname, './e2e'),
            // '@feature': path.resolve(__dirname, './app/screens'),
            // '@food-journal': path.resolve(__dirname, './app/screens/food-journal'),
            // '@goals': path.resolve(__dirname, './app/screens/goals'),
            // '@about': path.resolve(__dirname, './app/screens/about'),
            // '@calculators': path.resolve(__dirname, './app/screens/calculators'),
          },
          cwd: 'babelrc',
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.android.js', '.android.tsx', '.ios.js', '.ios.tsx'],
        },
      ],
    ],
  };
};
