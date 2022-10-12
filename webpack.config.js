const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        index: "./index.ts",
    },
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "[name]_bundle.js",
    },
    resolve: {
        alias: {
            components: path.resolve(__dirname, "src/components"),
        },
        extensions: [".js", ".ts"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.p?css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "postcss-loader" }],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
        ],
    },
    plugins: [new HtmlWebpackPlugin({ template: "./index.html" }), new CleanWebpackPlugin()],
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        compress: true,
        port: 9000,
        hot: true,
    },
    watchOptions: {
        ignored: /node_modules/,
    },
};
