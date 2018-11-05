var path = require('path');
var SRC_DIR = path.join(__dirname, '/client');
var DIST_DIR = path.join(__dirname, '/public/dist');

// Decide whether to use cssnano to minify CSS
const getPlugins = (argv) => {
  const plugins = [
    require('autoprefixer')
  ];

  if (argv.mode === 'production') {
    plugins.push(require('cssnano'));
  }

  return plugins;
}

module.exports = (env, argv) => ({
  entry: `${SRC_DIR}/index.jsx`,
  devtool: 'source-map',
  mode: 'development',
  cache: true,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?/,
        include: SRC_DIR,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [ { loader: 'style-loader' }, { loader: 'css-loader' }, {
          loader: 'postcss-loader',
          options: {
            plugins: getPlugins(argv)
          }
        }],
        include: SRC_DIR
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader'
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader'
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              plugins: getPlugins(argv)
            }
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
});
