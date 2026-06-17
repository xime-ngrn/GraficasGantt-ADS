import React from "react";
import {Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./Login.jsx";
import Administrator from "./Administrator.jsx";
import CrearEjercicio from "./CrearEjercicio.jsx";
import Visualizar from "./VisualizarEjercicio.jsx";
import Registro from "./Registro.jsx"; // <-- Componente Registro

class BootstrapReact extends React.Component {

    render() {
      return(
    <div>
          <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} /> 
          <Route path="/administrador" element={<Administrator />} />
          <Route path="/crear" element={<CrearEjercicio />} />
          <Route path="/Registro" element={<Registro />} /> 
          </Routes>
    </div>);    
  }
}
export default BootstrapReact;