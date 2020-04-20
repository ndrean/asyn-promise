const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const config = (mode) => {
  return {
    mode,
    entry: "./src/index.js", // source
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "main.js", // destination: all-in-one bundle file
    },
    devServer: {
      contentBase: "./src/", //path.resolve(__dirname, "src"),
      watchContentBase: true,
      publicPath: "/dist/",
    },
    devtool: "inline-source-map",
    plugins: [
      // new CleanWebpackPlugin(),
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
          use: ["css-loader"],
        },
      ],
    },
  };
};

module.exports = config();
