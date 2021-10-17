const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const DEV_SERVER_PORT = 9999;

const SRC = path.resolve(__dirname, './src');
const DIST = path.resolve(__dirname, './dist');

if (!fs.existsSync(DIST)) { fs.mkdirSync(DIST); }

module.exports = env => {

    const ENV = env || {};

    const DEV_MODE = ENV.mode === 'development';
    const PROD_MODE = ENV.mode === 'production';
    const MODE = DEV_MODE ? 'development' : 'production';

    const ENTRY = './src/index.js';

    console.log(JSON.stringify({ ENV, MODE, DEV_SERVER_PORT, ENTRY, SRC, DIST }, null, 2));

    return {

        mode: MODE,

        devtool: DEV_MODE ? 'source-map' : 'cheap-module-source-map',

        entry: {
            app: ENTRY,
        },

        output: {
            path: DIST,
            publicPath: '',

            filename: PROD_MODE ? 'bundles/[name]/[name].[contenthash].min.js' : 'bundles/[name]/[name].js',
            chunkFilename: PROD_MODE ? 'chunks/[name]/[name].[contenthash].min.js' : 'chunks/[name]/[name].js',
        },

        devServer: {
            port: DEV_SERVER_PORT,
            static: DIST,
            hot: true,
            historyApiFallback: {
                rewrites: [
                    { from: /^\/$/, to: '/index.html' },
                ],
            },
        },

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: [
                        {
                            loader: 'babel-loader',
                        },
                    ],
                },
                {
                    test: /\.html$/,
                    use: 'html-loader'
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: DEV_MODE,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: DEV_MODE,
                            },
                        },
                    ]
                },
                {
                    test: /\.(otf|ttf|eot|woff|woff2|svg)$/,
                    exclude: /node_modules/,
                    use: 'file-loader?hash=sha512&context=src&name=[path][name].[ext]',
                },
            ]
        },

        resolve: {
            extensions: ['.js', '.jsx'],
        },

        optimization: {

            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: 'vendor',
                        chunks: 'all',
                        priority: 20,
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 10,
                        reuseExistingChunk: true,
                        enforce: true
                    }
                }
            },

            minimizer: [
                new OptimizeCSSAssetsPlugin(),
                new TerserPlugin(),
            ],
        },

        plugins: [
            new CleanWebpackPlugin(),

            new MiniCssExtractPlugin({
                filename: PROD_MODE ? 'bundles/[name]/[name].[contenthash].min.css' : 'bundles/[name]/[name].css',
                chunkFilename: PROD_MODE ? 'chunks/[id]/[id].[contenthash].min.css' : 'chunks/[id]/[id].css',
            }),

            new HtmlWebpackPlugin({
                inject: false,
                hash: true,
                template: './src/index.ejs',
                filename: './index.html',
                chunksSortMode: 'manual',
                chunks: ['vendor', 'app'],
                title: 'Test App',
            })
        ],

        node: {
            __filename: true,
            __dirname: true,
        },

        performance: {
            hints: PROD_MODE ? 'warning' : false
        },

        stats: {
            children: false,
            chunks: false,
            chunkModules: false,
            modules: false,
            reasons: false,
        },

    };

};
