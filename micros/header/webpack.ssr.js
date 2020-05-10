const path = require("path");
const merge = require("webpack-merge");
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const parts = require("./webpack.parts");

const PATHS = {
  build: path.join(__dirname, "static"),
  ssrEntry: path.join(__dirname, "src", "ssr.js"),
  src: path.join(__dirname, "src"),
};

module.exports = merge([
  {
    mode: "development",
    devtool: "source-map",
    entry: {
      index: PATHS.ssrEntry,
    },
    output: {
      path: PATHS.build,
      libraryTarget: "umd",
      globalObject: "this",
      publicPath: "http://localhost:3002/",
    },
  },
  parts.loadJavaScript({ include: PATHS.src }),
  {
    plugins: [
      new CleanWebpackPlugin(),
      new ModuleFederationPlugin({
        name: "header",
        library: { type: "var", name: "header" },
        filename: "header-entry.js",
        exposes: {
          Header: "./src/components/Header.jsx",
        },
        shared: ["react"],
      }),
    ],
  },
]);
