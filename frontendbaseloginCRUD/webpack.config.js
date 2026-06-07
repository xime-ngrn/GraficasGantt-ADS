const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: "./src/Application.jsx",
    output: {
    //path:path.resolve(__dirname, '../backendbaselogin/public'),
    path:path.resolve(__dirname, 'dist'),
    filename: "main.js",
    clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: './plantilla/index.html', // Ruta plantilla HTML
          //path:path.resolve(__dirname, '../backendbaselogin/public'),
          path:path.resolve(__dirname, 'dist'),
          filename: 'index.html', // Nombre del archivo de salida
        })
      ],
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
          }
        ]
      },
    devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), 
    },
    port: 8080, // Puerto del servidor
    open: true, // Abrir navegador automáticamente
    hot: true, // Habilitar Hot Module Replacement (HMR)
    historyApiFallback: true, // Aplicaciones SPA
  }            
  }
