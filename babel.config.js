module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            test: './test',
            '@theme': './app/theme',
            '@app': './app',
            '@components': './app/components',
            '@hooks': './app/hooks',
            '@config': './app/config',
          },
        },
      ],
    ],
  };
};
