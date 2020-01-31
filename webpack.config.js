const ExtractTextPlugin = require('extract-text-webpack-plugin');
const NodeExternals = require('webpack-node-externals');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const babelOptions = {
  presets: ['react', 'es2015', 'stage-0'],
  sourceMaps: true,
  retainLines: true,
};

const frontConfig = {
  devtool: 'source-map',

  entry: {
    bundle: './src/index.jsx',
  },

  devServer: {
    watchContentBase: true,

    watchOptions: {
      poll: true,
    },
  },

  node: {
    fs: 'empty',
    global: true,
  },

  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
    publicPath: '/dist/',
  },

  plugins: [
    new ExtractTextPlugin('styles.css'),
    // new UglifyJSPlugin({
    //   sourceMap: true,
    // }),
  ],

  resolve: {
    modules: ['src/', 'node_modules/'],
    extensions: ['.js', '.jsx', '/index.js', '/index.jsx', '.json', '.scss', '/index.scss', '.css'],
  },

  target: 'web',

  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      }, {
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
};

const backConfig = {
  entry: {
    app: ['./src/back.js'],
  },
  externals: [NodeExternals()],
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle-back.node.js',
  },
  resolve: {
    modules: ['src/', 'node_modules/'],
    extensions: ['.js', '.jsx', '/index.js', '/index.jsx', '.json', '.scss', '/index.scss', '.css'],
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};

const testGeneratorConfig = {
  entry: {
    app: ['./src/tests/generateTestCases.js'],
  },
  externals: [NodeExternals()],
  output: {
    path: `${__dirname}/src/tests`,
    filename: 'testGenerator.node.js',
  },
  resolve: {
    modules: ['src/', 'node_modules/'],
    extensions: ['.js', '.jsx'],
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};


module.exports = [frontConfig, backConfig, testGeneratorConfig];
