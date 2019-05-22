const localServer = {
  path: 'localhost/',
  port: 3000
}

const path = require('path')
const webpack = require('webpack')
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin/dist/clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const PrettierPlugin = require('prettier-webpack-plugin')
const ImageMinPlugin = require('imagemin-webpack-plugin').default
const config = {
  mode: 'development',
  entry: { app: './src/index.js' },
  devtool: 'inline-source-map',
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|gif|jpg|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[hash:6].[ext]',
              publicPath: '../',
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'fonts/[name].[hash:6].[ext]',
              publicPath: '../',
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new PrettierPlugin(),
    // new BrowserSyncPlugin({
    //   proxy: localServer.path,
    //   port: localServer.port,
    //   files: [],
    //   ghostMode: {
    //     clicks: false,
    //     location: false,
    //     forms: false,
    //     scroll: false
    //   },
    //   injectChanges: true,
    //   logFileChanges: true,
    //   logLevel: 'debug',
    //   logPrefix: 'wepback',
    //   notify: true,
    //   reloadDelay: 0
    // }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/index.html',
      filename: 'index.html'
      // favicon: './src/images/favicon.ico',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src', 'images', 'content'),
        to: path.resolve(__dirname, 'dist', 'images', 'content'),
        toType: 'dir'
      }
    ]),
    new ImageMinPlugin({ test: /\.(jpg|jpeg|png|gif|svg)$/i })
  ]
}

module.exports = config
