const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  entry: {
    "index": __dirname + "/src/client/scripts/index/index.js",
    "secretsanta": __dirname + "/src/client/scripts/secretsanta/index.js",
    "sudoku": __dirname + "/src/client/scripts/sudoku/index.js",
  },
  output: {
    path: __dirname + '/build',
    filename: '[name]/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              minimize: {
                safe: true
              }
            }
          },
          {
            loader: "sass-loader",
            options: {}
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|html)$/,
        loader: 'file-loader',
        options: {}
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({filename: "[name]/styles.css"})
  ],
};

if (process.env.NODE_ENV !== 'development') {
  module.exports.plugins.push(
    new UglifyJsPlugin()
  );
}
