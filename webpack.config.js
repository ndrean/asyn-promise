const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = (mode) => {
  return {
    mode,
    entry: "./src/index.js", // source
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js", // destination: all-in-one bundle file
    },
    devtool: "inline-source-map",
    plugins: [
      new CleanWebpackPlugin(["dist"]),
      new HtmlWebpackPlugin({
        template: "src/index.html", //source
        filename: "index.html", // destination
      }),
      new CopyWebpackPlugin([{ from: "src/img", to: "img/" }]),
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["MiniCssExtractPlugin", "style-loader", "css-loader"],
        },
      ],
    },
  };
};

module.exports = config();
