const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;

module.exports = {
  entry: "./src/index",
  cache: false,

  mode: "production",
  devtool: "source-map",

  optimization: {
    minimize: false,
  },

  output: {
    publicPath: "http://localhost:3001/",
  },

  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: require.resolve("babel-loader"),
        exclude: /node_modules/,
        options: {
          presets: [require.resolve("@babel/preset-react")],
        },
      },
      {
        test: /\.md$/,
        loader: "raw-loader",
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "store",
      library: {
        type: "var",
        name: "store",
      },
      filename: "remoteEntry.js",
      exposes: {
        Store: "./src/store",
      },
      shared: ["react", "react-dom", "redux"],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
