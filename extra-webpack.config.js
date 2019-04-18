module.exports = {
  node: {
    vm: true,
    stream: true,
    fs: 'empty',
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    },
  },
};
