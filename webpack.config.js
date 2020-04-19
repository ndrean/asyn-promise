// const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = (mode) => {
  return {
    mode,
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "main.js",
    },
    devtool: "inline-source-map",
    plugins: [
      new HtmlWebpackPlugin({
        template: "index.html",
        filename: "index.html",
      }),
    ],
    module: {
      rules: [{ test: /\.css$/, use: "css-loader" }],
    },
  };
};

module.exports = config();
