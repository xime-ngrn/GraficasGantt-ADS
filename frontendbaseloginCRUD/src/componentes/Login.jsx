import React from "react";
import { Navigate, Link } from "react-router-dom"; // <-- Solo agregamos "Link" aquí arriba
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';
import fondo from '../assets/fondo.png';
import '../style/Login.css';

Modal.setAppElement('#contenedor');

class Login extends React.Component {
  constructor() {
    super();
    this.state = { condition: false, tipousuario: '', modalIsOpen: false };
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  validar = (usuario, password) => {
    fetch('/Login?user=' + usuario + '&password=' + password)
      .then(response => response.json())
      .then(usuario => {
        if (usuario.status == "yes" && usuario.tipo == "administrador") {
          this.setState({ condition: true, tipousuario: 'administrador' });
        } else {
          this.openModal();
          this.setState({ condition: false, tipousuario: '' });
        }
      })
      .catch(() => {
        this.openModal();
        this.setState({ condition: false, tipousuario: '' });
      });
  };

  render() {
    const { condition, tipousuario } = this.state;

    if (condition && tipousuario == "administrador") {
      return <Navigate to='/administrador' />;
    }

    const backgroundWithImage = { '--login-bg': `url(${fondo})` };

    return (
      <div>
        <div className="login-background" style={backgroundWithImage}>
          <div className="login-card" id="equis">
            <h1 className="login-title">LOGIN</h1>

            <div className="form-group mb-3">
              <label className="login-label" htmlFor="user">Usuario</label>
              <input
                placeholder="Ingrese el usuario"
                type="text"
                id="user"
                className="form-control login-input"
                autoComplete="off"
              />
            </div>

            <div className="form-group mb-3">
              <label className="login-label" htmlFor="password">Password</label>
              <input
                placeholder="Ingrese su contraseña"
                type="password"
                id="password"
                className="form-control login-input"
              />
            </div>

            <button
              className="login-button"
              onClick={() => this.validar(
                document.getElementById("user").value,
                document.getElementById("password").value
              )}
            >
              Submit
            </button>

            {/* ABRAZO DEL BOTÓN: Tu arquitectura no cambió, solo agregamos este enlace aquí abajo */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link 
                to="/Registro" 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#ffffff', 
                  cursor: 'pointer', 
                  textDecoration: 'underline', 
                  fontWeight: '500', 
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.55)' 
                }}
              >
                ¿No tienes cuenta? Regístrate aquí
              </Link>
            </div>

          </div>
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          overlayClassName="login-modal-overlay"
          className="login-modal-content"
          contentLabel="Error de inicio de sesión"
        >
          <h2 className="login-modal-title">Inicio de sesión incorrecto</h2>
          <p>El usuario o la contraseña no son válidos. Por favor, inténtelo de nuevo.</p>
          <button className="login-button" onClick={this.closeModal}>
            Cerrar
          </button>
        </Modal>
      </div>
    );
  }
}

export default Login;