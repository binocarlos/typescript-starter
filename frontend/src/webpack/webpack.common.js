const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[name].[hash].bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [{
      test: /\.(j|t)sx?$/,
      exclude: /node_modules\/(?!typescript-starter-types).*/,
      use: {
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          babelrc: false,
          presets: [
            [
              "@babel/preset-env",
              { targets: { browsers: "last 2 versions" } } // or whatever your project requires
            ],
            "@babel/preset-typescript",
            "@babel/preset-react"
          ],
          plugins: [
            ["@babel/plugin-proposal-class-properties", { loose: true }],
            "react-hot-loader/babel"
          ]
        }
      }
    }],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    modules: [
      // the current app
      path.resolve(process.cwd(), 'src'),
      // fc-frontend
      path.resolve(__dirname, '..'),
      'node_modules'
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ 
      template: './src/index.html', 
      filename: './index.html',
      hash: true,
    }),
    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: '',
    }]),
  ],
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
    },
  },
}