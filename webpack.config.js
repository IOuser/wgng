const path = require('path');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV !== 'production';
const cwd = __dirname || process.cwd();

module.exports = {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'source-map' : false,
    context: path.resolve(cwd, 'src'),

    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [path.resolve(cwd, 'src'), 'node_modules'],
    },

    entry: {
        main: 'main',
    },

    output: {
        path: path.resolve(cwd, 'dest'),
        publicPath: '/',
        filename: isDev ? '[name].js' : '[name].[hash:5].js',
        chunkFilename: isDev ? '[name].js' : '[name].[chunkhash:5].js',
    },

    module: {
        rules: [getTSLoader()],
    },

    performance: {
        hints: false,
    },

    optimization: {
        splitChunks: false,
        runtimeChunk: {
            name: 'runtime',
        },
    },

    plugins: getWebpackPlugins(),

    stats: {
        children: false,
        chunks: false,
    },

    devServer: {
        contentBase: path.join(cwd, 'dest'),
        compress: true,
        port: 4221,
        hot: isDev,
        hotOnly: true,
    },
};

function getTSLoader() {
    return {
        test: /(\.tsx?)$/,
        use: [
            'cache-loader',
            {
                loader: 'awesome-typescript-loader',
                options: {
                    silent: true,
                },
            },
        ],
    };
}

function getWebpackPlugins() {
    return isDev
        ? [new webpack.HotModuleReplacementPlugin()]
        : [];
}
