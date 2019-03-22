/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('./plugins/dotenv-webpack');
const TreatWarningsAsErrors = require('./plugins/treat-warnings-as-errors');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { typeWebpack } = require('./typeConfig');

module.exports = typeWebpack({
  mode: 'production',
  entry: ['./src/index.ts'],
  output: {
    path: path.join(__dirname, '../build/prod/'),
    filename: 'server.js',
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules, paths.appSrc]
      .concat
      // It is guaranteed to exist because we tweak it in `env.js`
      //  process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
      (),
    extensions: ['.js', '.json', '.ts'],
    alias: {
      '~': paths.appSrc,
    },
  },
  target: 'node',
  devtool: 'source-map',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        loader: require.resolve('eslint-loader'),
        include: paths.appSrc,
        options: {
          formatter: require('eslint/lib/formatters/visualstudio'),
        },
      },
      {
        oneOf: [
          {
            test: /\.(js|ts)$/,
            include: paths.appSrc,
            use: [require.resolve('awesome-typescript-loader')],
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv({
      systemvars: true,
      path: path.join(__dirname, '../.env.production'),
    }),
    new CleanWebpackPlugin(),
    new TreatWarningsAsErrors(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_TARGET: JSON.stringify('server'),
      },
    }),
  ],
  optimization: {
    minimize: false,
  },
});
