module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Make sure this is included for reanimated
    '@babel/plugin-proposal-export-namespace-from',
  ],
};
