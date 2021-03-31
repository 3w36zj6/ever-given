const path = require('path');
module.exports = {
    entry: {
        bundle: './src/app.ts'
    },
    output: {
        path: path.join(__dirname, 'docs'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {
        contentBase: path.join(__dirname, 'docs')
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'ts-loader'
        }]
    }
}