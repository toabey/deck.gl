var debug = process.env.NODE_ENV !== "production";

var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var plugins = [
  new CopyWebpackPlugin([
    { from: 'index.html', to: 'index.html' },
    { from: 'static', to: 'static' },
    { from: 'stylesheets', to: 'stylesheets' }
  ])
];

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "sourcemap" : null,
  entry: "./javascripts/main.js",
  devServer: {
    inline: true,
    port: 3333
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        exclude: /(node_modules)/
      }
    ]
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: '/',
    filename: "main.min.js"
  },
  plugins: debug ? plugins : plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  ])
};
