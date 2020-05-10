exports.loadJavaScript = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include,
        exclude,
        use: "babel-loader",
      },
    ],
  },
});
