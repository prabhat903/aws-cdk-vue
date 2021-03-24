const path = require("path");

const SRC_DIR = path.resolve(__dirname, "src");
const OUT_DIR = path.resolve(__dirname, "build");

module.exports = {
  entry: {
    process: path.resolve(SRC_DIR, "lambda.js"),
  },
  output: {
    path: `${OUT_DIR}`,
    filename: "[name].js",
    library: "[name]",
    libraryTarget: "umd",
  },
  target: "node",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: { node: "12" }, // Node version on AWS Lambda
                  modules: false, // See https://babeljs.io/docs/plugins/preset-env/#optionsmodules
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
