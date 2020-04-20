const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const config = {
  entry: "./src/index.js", // source
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js", // destination: all-in-one bundle file
  },
  devServer: {
    contentBase: "./src/", //absolute path recommendedpath.resolve(__dirname, "src"),
    watchContentBase: true, // full page reload, for the static html change
  },
  devtool: "inline-source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html", //source
      filename: "index.html", // destination
    }),
    new CopyWebpackPlugin([{ from: "src/img", to: "img/" }]),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

module.exports = config;
