var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'app'),
  mode: 'development',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    host: '0.0.0.0',
    port: 8082,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test: /(\.(s*)css)$/, loaders: ['style-loader', 'css-loader', 'sass-loader']}
    ]
  }
};
