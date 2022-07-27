/**
 * addLessLoader_forCRA5
 * customized addLessLoader of customize-cra for create-react-app@5.0.0
 *
 * CreatedAt : 2022-01-09
 *
 * Description: The customize-cra author copy getStyleLoaders codes from react-scripts@4.0.3 > webpack.config.js
 * But as react-scripts upgrade to version 5, they also upgrade postcss-loader, which causes change of options schema.
 * So, I re-copy getStyleLoaders codes from react-scripts@5.0.0 > webpack.config.js
 *
 */

const fs = require('fs');
const path = require('path');
const paths = require('react-scripts/config/paths');

// customize-cra 1.0.0 original addLessLoader code
const addLessLoader_forCRA5 =
  (loaderOptions = {}, customCssModules = {}) =>
  (config) => {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const postcssNormalize = require('postcss-normalize');

    const cssLoaderOptions = loaderOptions.cssLoaderOptions || {};

    const { localIdentName } = loaderOptions;
    let cssModules = loaderOptions.cssModules || { localIdentName };

    if (!cssModules.localIdentName) {
      cssModules = customCssModules;
    }

    cssModules.localIdentName = cssModules.localIdentName || '[local]--[hash:base64:5]';

    const lessRegex = /\.less$/;
    const lessModuleRegex = /\.module\.less$/;

    const webpackEnv = process.env.NODE_ENV;
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
    const publicPath = config.output.publicPath;
    const shouldUseRelativeAssetPaths = publicPath === './';

    const useTailwind = fs.existsSync(path.join(paths.appPath, 'tailwind.config.js'));

    // copy from react-scripts@4.0.3
    // https://github.com/facebook/create-react-app/blob/v4.0.3/packages/react-scripts/config/webpack.config.js#L110
    const getStyleLoaders = (cssOptions, preProcessor, needStyleLoader = true) => {
      const loaders = [
        needStyleLoader && isEnvDevelopment && require.resolve('style-loader'),
        needStyleLoader &&
          isEnvProduction && {
            loader: MiniCssExtractPlugin.loader,
            options: shouldUseRelativeAssetPaths ? { publicPath: '../../' } : {},
          },
        {
          loader: require.resolve('css-loader'),
          options: cssOptions,
        },

        //
        // react-scripts@4.0.3, postcss-loader start
        // https://github.com/facebook/create-react-app/blob/v4.0.3/packages/react-scripts/config/webpack.config.js#L129
        // {
        //   loader: require.resolve('postcss-loader'),
        //   options: {
        //     ident: 'postcss',
        //     plugins: () => [
        //       require('postcss-flexbugs-fixes'),
        //       require('postcss-preset-env')({
        //         autoprefixer: {
        //           flexbox: 'no-2009',
        //         },
        //         stage: 3,
        //       }),
        //       postcssNormalize(),
        //     ],
        //     sourceMap: isEnvProduction && shouldUseSourceMap,
        //   },
        // },
        // react-scripts@4.0.3, postcss-loader end
        //
        ////////
        //
        // react-scripts@5.0.0, postcss-loader start
        // https://github.com/facebook/create-react-app/blob/v5.0.0/packages/react-scripts/config/webpack.config.js#L133
        {
          // Options for PostCSS as we reference these options twice
          // Adds vendor prefixing based on your specified browser support in
          // package.json
          loader: require.resolve('postcss-loader'),
          options: {
            postcssOptions: {
              // Necessary for external CSS imports to work
              // https://github.com/facebook/create-react-app/issues/2677
              ident: 'postcss',
              config: false,
              plugins: !useTailwind
                ? [
                    'postcss-flexbugs-fixes',
                    [
                      'postcss-preset-env',
                      {
                        autoprefixer: {
                          flexbox: 'no-2009',
                        },
                        stage: 3,
                      },
                    ],
                    // Adds PostCSS Normalize as the reset css with default options,
                    // so that it honors browserslist config in package.json
                    // which in turn let's users customize the target behavior as per their needs.
                    'postcss-normalize',
                  ]
                : [
                    'tailwindcss',
                    'postcss-flexbugs-fixes',
                    [
                      'postcss-preset-env',
                      {
                        autoprefixer: {
                          flexbox: 'no-2009',
                        },
                        stage: 3,
                      },
                    ],
                  ],
            },
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          },
          //react-scripts@5.0.0, postcss-loader end
        },
      ].filter(Boolean);
      if (preProcessor) {
        loaders.push(
          {
            loader: require.resolve('resolve-url-loader'),
            options: {
              sourceMap: isEnvProduction && shouldUseSourceMap,
            },
          },
          {
            loader: require.resolve(preProcessor),
            // not the same as react-scripts
            options: Object.assign(
              {
                sourceMap: true,
              },
              loaderOptions,
            ),
          },
        );
      }
      return loaders;
    };

    const loaders = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;

    // Insert less-loader as the penultimate item of loaders (before file-loader)
    loaders.splice(
      loaders.length - 1,
      0,
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        resourceQuery: /toString/,
        use: getStyleLoaders(
          Object.assign(
            {
              importLoaders: 2,
              sourceMap: isEnvProduction && shouldUseSourceMap,
            },
            cssLoaderOptions,
          ),
          'less-loader',
          false,
        ),
      },
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: getStyleLoaders(
          Object.assign(
            {
              importLoaders: 2,
              sourceMap: isEnvProduction && shouldUseSourceMap,
            },
            cssLoaderOptions,
          ),
          'less-loader',
        ),
      },
      {
        test: lessModuleRegex,
        use: getStyleLoaders(
          Object.assign(
            {
              importLoaders: 2,
              sourceMap: isEnvProduction && shouldUseSourceMap,
            },
            cssLoaderOptions,
            {
              modules: cssModules,
            },
          ),
          'less-loader',
        ),
      },
    );

    return config;
  };

module.exports = addLessLoader_forCRA5;
