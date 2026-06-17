import React from "react";
import {Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./Login.jsx";
import Administrator from "./Administrator.jsx";
import CrearEjercicio from "./CrearEjercicio.jsx";
import Visualizar from "./VisualizarEjercicio.jsx"

class BootstrapReact extends React.Component {

    render() {
      return(
    <div>
          <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/administrador" element={<Administrator />} />
          <Route path="/crear" element={<CrearEjercicio />} />
          </Routes>
    </div>);    
  }
}
export default BootstrapReact; 