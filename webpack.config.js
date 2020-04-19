const path = require("path");
const glob = require("glob");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");

module.exports = {
    entry: {
        background: "./src/background/background.ts",
        popup: "./src/popup/popup.ts",
        content_script: "./src/content-script/content-script.ts",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "[name]/[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            inject: true,
            title: "Word and character counter",
            chunks: ["popup"],
            template: "./src/popup/popup.html",
            filename: "./popup/popup.html",
        }),
        new CopyPlugin([
            { from: "manifest.json", to: "manifest.json" },
            { from: "src/assets", to: "assets" },
            { from: "src/_locales", to: "_locales" },
        ]),
        new MiniCssExtractPlugin({
            filename: "[name]/[name].css",
        }),
        new PurgecssPlugin({
            paths: () => glob.sync(`${path.resolve(__dirname, "src")}/**/*`, { nodir: true }),
        }),
    ],
    // mode: "development",
    mode: "production",
    target: "web",
};
