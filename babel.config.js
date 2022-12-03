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
            '@app': './app',
            '@components': './app/components',
            '@hooks': './app/hooks',
            '@config': './app/config',
            '@types': './app/types',
            '@theme': './app/theme',
          },
        },
      ],
    ],
  };
};
