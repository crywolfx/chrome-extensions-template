const {
  fixBabelImports,
  addWebpackAlias,
  addWebpackPlugin,
  override,
  overrideDevServer,
  addPostcssPlugins,
} = require('customize-cra');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const basePaths = require('react-scripts/config/paths');
const packageVersion = require('./package.json').version;
const addLessLoader_forCRA5 = require('./addLessLoader');
const reload = require('./script/reload');
const { getBuildVersion } = require('./build.config');
const developmentConfig = require('./dev.config');

const removePlugin = (plugins, name) => {
  const list = plugins.filter(
    (it) => !(it.constructor && it.constructor.name && name === it.constructor.name),
  );
  if (list.length === plugins.length) {
    throw new Error(`Can not found plugin: ${name}.`);
  }
  return list;
};

const BUILD_VERSION = getBuildVersion();
const version = `v${packageVersion}-${BUILD_VERSION}`;
const isProduction = process.env.NODE_ENV === 'production';

const isHotReloadChrome = process.env.CHROME_HOT === 'true';
const writeToDisk = process.env.WRITE_TO_DISK === 'true';

const getWebpackConfig = (webpackEnv) => {
  const isEnvProduction = webpackEnv === 'production';
  const htmlWebpackPluginConfig = isEnvProduction
    ? {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }
    : {};

  return [
    fixBabelImports('antd', {
      libraryDirectory: 'es',
      style: true,
    }),
    addLessLoader_forCRA5({
      lessOptions: {
        modifyVars: require('./theme'),
        javascriptEnabled: true,
      },
    }),
    addPostcssPlugins(),
    addWebpackPlugin(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/popup.html'),
        chunks: ['popup'],
        filename: `popup.html`,
        ...htmlWebpackPluginConfig,
      }),
    ),
    addWebpackPlugin(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/options.html'),
        chunks: ['options'],
        filename: `options.html`,
        ...htmlWebpackPluginConfig,
      }),
    ),
    addWebpackPlugin(
      new webpack.DefinePlugin({
        devConfig: {
          DEV_PORT: process.env.PORT,
          HOT_RELOAD_CHROME: isHotReloadChrome,
          VERSION: JSON.stringify(version),
          DEV_CONFIG: JSON.stringify(isProduction ? {} : developmentConfig || {}),
        },
      }),
    ),
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@content': path.resolve(__dirname, 'src/renderContent'),
    }),
  ].filter(Boolean);
};

module.exports = {
  webpack: (config, webpackEnv) => {
    config.entry = {
      popup: './src/pages/popup/index.tsx',
      options: './src/pages/options/index.tsx',
      background: [
        './src/background/index.ts',
        isHotReloadChrome && './src/reload/background.ts',
      ].filter(Boolean),
      visionContentScript: [
        './src/contentScript/index.ts',
        isHotReloadChrome && './src/reload/content.ts',
      ].filter(Boolean),
    };
    config.output = {
      filename: '[name].js',
      path: __dirname + '/build',
      publicPath: './',
    };

    config.resolve.plugins = removePlugin(config.resolve.plugins, 'ModuleScopePlugin');
    // 删除这两个插件
    config.plugins = removePlugin(config.plugins, 'WebpackManifestPlugin');
    config.plugins = removePlugin(config.plugins, 'HtmlWebpackPlugin');

    return override(...getWebpackConfig(webpackEnv))(config, webpackEnv);
  },
  devServer: overrideDevServer((config) => {
    return {
      ...config,
      devMiddleware: {
        ...config.devMiddleware,
        writeToDisk: writeToDisk || isHotReloadChrome || false, // 开发阶段实时生成文件
      },
      onBeforeSetupMiddleware: (devServer) => {
        isHotReloadChrome && reload(devServer);
        config.onBeforeSetupMiddleware(devServer);
      },
    };
  }),
  paths: function (paths, env) {
    paths.appIndexJs = `${basePaths.appSrc}/pages/popup/index.tsx`;
    paths.appHtml = `${basePaths.appPath}/public/popup.html`;
    return paths;
  },
};
