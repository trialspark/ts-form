const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.tsx'),
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, './src'),
  },
};
