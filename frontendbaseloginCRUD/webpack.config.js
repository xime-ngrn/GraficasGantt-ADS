const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: "./src/Application.jsx",
    output: {
    path:path.resolve(__dirname, '../backendbaselogin/public'),
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
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: 'asset/resource'   // o 'asset' si quieres inline para archivos pequeños
          }
        ]
      },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
      proxy: [
        {
          context: ['/Login', '/Registro', '/Ejercicios', '/Ejercicio', '/GuardarEjercicio','/ModificarEjercicio', '/EliminarEjercicio'],
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      ],
  }        
  }
