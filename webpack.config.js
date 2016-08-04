module.exports = {
  eslint: {
    configFile: __dirname + '/.eslintrc'
  },
  output: {
    library: 'miniRedux',
    libraryTarget: 'umd'
  },
  module: {
    preLoaders: [
      {
        exclude: /node_modules/,
        loader: 'eslint-loader',
        test: /\.js$/
      }
    ],
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        },
        test: /\.js$/
      }
    ]
  }
}