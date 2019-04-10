const path = require('path');

module.exports = {
  entry: [
    path.resolve(__dirname, 'src', 'cli', 'index.js')
  ],

  mode: process.env.NODE_ENV || 'development',
  target: 'node',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/env']
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
      path.resolve(__dirname, 'node_modules')
    ]
  }
};
