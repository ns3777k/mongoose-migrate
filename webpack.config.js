const path = require('path');

module.exports = {
  entry: [
    'babel-polyfill',
    '@babel/register',
    path.resolve(__dirname, 'src', 'cli', 'index.js')
  ],

  mode: 'development',
  target: 'node',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  }
};
