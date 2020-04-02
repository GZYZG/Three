/*
对webpack的运行的配置
webpack 会将ES6的代码转化为 es5 代码
*/
const path = require('path');

module.exports = {
  //webpack的打包模式，可以为 production / development
  mode: 'development',
  entry: './src/Main.ts',
  //entry: './src/assets/js/test.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: '/node_modules/*'
      }
    ]

  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'tsdist')
  }
  
  
};