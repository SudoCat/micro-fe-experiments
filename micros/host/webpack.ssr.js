const path = require("path");
const merge = require("webpack-merge");
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const parts = require("./webpack.parts");

const PATHS = {
  build: path.join(__dirname, "static"),
  entry: path.join(__dirname, "src", "index.js"),
  src: path.join(__dirname, "src"),
};

module.exports = merge([
  {
    mode: "development",
    devtool: "source-map",
    entry: {
      index: PATHS.entry,
    },
    output: {
      path: PATHS.build,
      // filename: "header.js",
      libraryTarget: "umd",
      globalObject: "this",
      publicPath: "http://localhost:3001/",
    },
  },
  parts.loadJavaScript({ include: PATHS.src }),
  {
    plugins: [
      new CleanWebpackPlugin(),
      new ModuleFederationPlugin({
        name: "host",
        library: { type: "var", name: "host" },
        filename: "host-entry.js",
        remotes: {
          "host-react": "host-react",
        },
        shared: ["react", "react-dom"],
      }),
    ],
  },
]);
