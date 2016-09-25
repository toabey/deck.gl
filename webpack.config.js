var debug = process.env.NODE_ENV !== "production";

var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var plugins = [
  new CopyWebpackPlugin([
    { from: 'index.html', to: 'index.html' },
    { from: 'static', to: 'static' },
    { from: 'stylesheets', to: 'css' }
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
  resolve: {
    alias: {
      webworkify: 'webworkify-webpack'
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ],
    postLoaders: [
      {
        include: /node_modules\/mapbox-gl/,
        loader: 'transform',
        query: 'brfs'
      }
    ]
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: '/',
    filename: "js/main.min.js"
  },
  plugins: debug ? plugins : plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      sourcemap: false,
      compress: {
        warnings: false
      }
    })
  ])
};
