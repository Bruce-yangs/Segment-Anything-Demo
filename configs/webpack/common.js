// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const Dotenv = require('dotenv-webpack');
module.exports = {
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  output: {
    path: resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss|sass)$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          "file-loader?hash=sha512&digest=hex&name=img/[contenthash].[ext]",
          "image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false",
        ],
      },
      {
        test: /\.(woff|woff2|ttf)$/,
        use: {
          loader: "url-loader",
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "node_modules/onnxruntime-web/dist/*.wasm",
          to: "[name][ext]",
        },
        {
          from: "model",
          to: "model",
        },
        {
          from: "src/assets",
          to: "assets",
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./src/assets/index.html",
    }),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new Dotenv(),
  ],
  devServer: {
      // 开发时可直接访问到 ./public 下的静态资源，这些资源在开发中不必打包
      host: "0.0.0.0",
      // host: "123.118.15.232",
      // host: "localhost",
      port: 8080,
      // open: true, // 打开浏览器
      compress: false, // 是否压缩
      // static: "./",
      proxy: {
          '/api': {
              target: "http://123.118.15.232:8181",
              pathRewrite: {
                  "^/api": "/api"
                  // "^/api": ""
              },
              changeOrigin: true
          },
          '/outimage': {
            target: 'http://123.118.15.232:8181',
          //   pathRewrite: {
          //     "^/outimage": ""
          //     // "^/api": ""
          // },
            // changeOrigin: true,
          },
      },
      // hotOnly: true,
  },
};
