import React from "react";
import {Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./Login.jsx";
import Administrator from "./Administrator.jsx";
import Info from "./Info.jsx"

class BootstrapReact extends React.Component {

    render() {
      return(
    <div>
          <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/administrator" element={<Administrator />} />
          <Route path="/info" element={<Info />} /> 
          </Routes>
    </div>);    
  }
}
export default BootstrapReact; 