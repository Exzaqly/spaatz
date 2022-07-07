const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: 'single',
    };
    if (isProd) {
        config.minimizer = [
            new TerserWebpackPlugin(),
            new CssMinimizerPlugin()
        ];


    }
    return config
};

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {}
        },

        'css-loader'];

    if (extra) {
        loaders.push(extra)
    }

    return loaders
};

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: "./index.html",
            minify: {
                collapseWhitespace: isProd,
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns:[
                {from: path.resolve(__dirname, 'src/assets/icons/features_diamond.svg'),
                    to: path.resolve(__dirname, 'dist')
                },
                {from: path.resolve(__dirname, 'src/assets/icons/features_lock.svg'),
                    to: path.resolve(__dirname, 'dist')
                },
                {from: path.resolve(__dirname, 'src/assets/icons/spaatz_icon.svg'),
                    to: path.resolve(__dirname, 'dist')
                },
                {from: path.resolve(__dirname, 'src/assets/icons/white_button_icon.svg'),
                    to: path.resolve(__dirname, 'dist')
                },
                {from: path.resolve(__dirname, 'src/assets/icons/star_icon.svg'),
                    to: path.resolve(__dirname, 'dist')
                },
                ]

        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        }),

    ];

    if (isProd) {
        base.push(new BundleAnalyzerPlugin())
    }

    return base
};

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './index.js',
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
    },
    optimization: optimization(),
    devServer: {
        port: 1337
    },
    devtool: isDev ? 'source-map' : false,
    plugins: plugins(),

    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: 'asset/inline'
            },
            {
                test: /\.xml$/,
                type: 'asset/resource'
            },
            {
                test: /\.csv$/,
                type: 'asset/resource'
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
        ]
    }
};
