import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter} from 'react-router-dom';
import BootstrapReact from './componentes/BootstrapReact.jsx'

class Application extends React.Component {
render() {
      return(
        <BrowserRouter>
            <BootstrapReact />
        </BrowserRouter>);    
  }
}
 
export default Application;

//CODIGO ACTUALIZADO PAREA LA NUEVA VERSION DE REACT
const rootElement = document.getElementById("contenedor");
const root = createRoot(rootElement);
root.render(<Application />);

