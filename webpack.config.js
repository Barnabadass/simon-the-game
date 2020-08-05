const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  entry: "./src/main.js",
  module: {
    rules: [
      {
        "test": /\.vue$/,
        "loader": "vue-loader"
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  output: {
    path: __dirname + "/dist/",
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [new VueLoaderPlugin()]
};