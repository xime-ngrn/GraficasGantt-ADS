import React from "react";
import {Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./Login.jsx";
import Administrador from "./Administrador.jsx";
import Registro from "./Registro.jsx";
import CrearEjercicio from "./CrearEjercicio.jsx";
import VisualizarEjercicio from "./VisualizarEjercicio.jsx";
import ModificarEjercicio from "./ModificarEjercicio.jsx";

class BootstrapReact extends React.Component {

    render() {
      console.log('>>> BOOTSTRAP NUEVO 26-JUN <<<');
      return(
    <div>
          <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Registro" element={<Registro />} /> 
          <Route path="/Login" element={<Login />} /> 
          <Route path="/administrador" element={<Administrador />} />
          <Route path="/crear" element={<CrearEjercicio />} />
          <Route path="/visualizar/:id" element={<VisualizarEjercicio />} />
          <Route path="/modificar/:id" element={<ModificarEjercicio />} />
          </Routes>
    </div>);    
  }
}
export default BootstrapReact;