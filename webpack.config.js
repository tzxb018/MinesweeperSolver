const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const babelOptions = {
  presets: ['react', 'es2015', 'stage-0'],
  sourceMaps: true,
  retainLines: true,
};

module.exports = {
  entry: {
    bundle: './src/index.jsx',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js',
    publicPath: '/dist/',
  },
  devtool: 'source-map',
  resolve: {
    modules: ['src/', 'node_modules/'],
    extensions: ['.js', '.jsx', '/index.js', '/index.jsx', '.json', '.scss', '/index.scss', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
          {
            loader: 'eslint-loader',

            options: {
              emitWarnings: true,
            },
          },
        ],
        exclude: /node_modules/,
      }, {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre',
        exclude: /node_modules/,
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true,
              localIdentName: '[local]_[hash:base64:5]',
            },
          }, {
            loader: 'sass-loader',
            options: {
              includePaths: ['src'],
            },
          }],
        }),
      }, {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: [
          'file-loader', {
            loader: 'image-webpack-loader',
            options: {
              optipng: {
                optimizationLevel: 7,
              },
            },
          },
        ],
      }, {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('styles.css'),
    // new UglifyJSPlugin({
    //   sourceMap: true,
    // }),
  ],
  node: {
    global: true,
  },
};
