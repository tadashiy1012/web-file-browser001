import path from 'path';
import VueLoaderPlugin from 'vue-loader/lib/plugin';

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'public');

export default {
    mode: 'development',
    entry: {
        'main': src + '/main.js'
    },
    output: {
        path: dist,
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            { test: /\.vue$/, use: ['vue-loader'] },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.jpg$/, use: ['file-loader'] },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\??\#?v=[.0-9]+)?$/,
                loader: 'file-loader?name=/fonts/[name].[ext]',
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: { 
            'vue$': 'vue/dist/vue.esm.js',
            'vuex$': 'vuex/dist/vuex.esm.js',
            'vue-router$': 'vue-router/dist/vue-router.esm.js'
          }
    },
    plugins: [new VueLoaderPlugin()],
    devtool: 'source-map'
}