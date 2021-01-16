const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    entry: {
      vendors: ["react", "react-dom", "react-router-dom", "./src/components/vendor.js"],
      home: { import: "./src/index.js", dependOn: 'vendors'}
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname,"static/js")
    },
    
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|static)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                    '@babel/preset-react',
                    '@babel/preset-env'
                ],
                plugins: ['@babel/plugin-proposal-class-properties']
              }
            }
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              "style-loader",
              // Translates CSS into CommonJS
              "css-loader",
              // Compiles Sass to CSS
              "sass-loader",
            ],
          },
        ]
    }
}