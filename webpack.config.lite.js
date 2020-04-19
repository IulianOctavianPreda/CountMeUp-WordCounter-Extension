const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: {
        background: "./src-lite/background/background.ts",
        content_script: "./src-lite/content-script/content-script.ts",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "[name]/[name].js",
        path: path.resolve(__dirname, "dist-lite"),
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: "manifest.lite.json", to: "manifest.json" },
            { from: "src-lite/assets", to: "assets" },
            { from: "src-lite/_locales", to: "_locales" },
        ]),
    ],
    // mode: "development",
    mode: "production",
    target: "web",
};
