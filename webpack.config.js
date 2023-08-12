const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {
        home: path.resolve(__dirname, "src/home/index.js"),
        login: path.resolve(__dirname, "src/login/index.js"),
        create: path.resolve(__dirname, "src/create/index.js"),
        kontakt: path.resolve(__dirname, "src/kontakt/index.js"),
        kontakt_admin: path.resolve(__dirname, "src/kontakt_admin/index.js"),
        profil: path.resolve(__dirname, "src/profil/index.js")
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]/bundle.js",
    },
    devServer: {
        static: {
          directory: path.resolve(__dirname, "dist"),
        },
        port: 3000,
        hot: true,
      },
      performance: {
        hints: false,
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
    plugins: [
        new HtmlWebpackPlugin({
          title: "webpack App",
          filename: "home/index.html",
          template: "src/home/index.html",
          chunks: ["home"],
      }), 
      new HtmlWebpackPlugin({
        title: "webpack App",
        filename: "login/index.html",
        template: "src/login/index.html",
        chunks: ["login"],
    }), 
      new HtmlWebpackPlugin({
        title: "webpack App",
        filename: "create/index.html",
        template: "src/create/index.html",
        chunks: ["create"],
    }), 
      new HtmlWebpackPlugin({
        title: "webpack App",
        filename: "kontakt/index.html",
        template: "src/kontakt/index.html",
        chunks: ["kontakt"],
    }), 
      new HtmlWebpackPlugin({
        title: "webpack App",
        filename: "kontakt_admin/index.html",
        template: "src/kontakt_admin/index.html",
        chunks: ["kontakt_admin"],
    }),
      new HtmlWebpackPlugin({
        title: "webpack App",
        filename: "profil/index.html",
        template: "src/profil/index.html",
        chunks: ["profil"],
    })
    ],
    devtool: "source-map",
};