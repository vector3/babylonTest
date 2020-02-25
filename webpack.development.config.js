const path = require("path");

const appFolder = "./app";
const distFolderName = "dist";
const srcFolder = appFolder + "/src";

module.exports = {
  mode: "development", // production/development/none.
  entry: srcFolder + "/index.ts",
  devtool: "source-map",

  optimization: {
    minimize: false
  },

  output: {
    filename: "main.js",
    path: path.resolve(__dirname, appFolder, distFolderName)
    // pathinfo: false
    // sourceMapFilename: "test.js.map" // optional
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },

  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            // speed up compile time.
            // see: https://medium.com/@kenneth_chau/speeding-up-webpack-typescript-incremental-builds-by-7x-3912ba4c1d15
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  }
};
