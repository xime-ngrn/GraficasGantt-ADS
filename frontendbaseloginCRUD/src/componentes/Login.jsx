import React from "react";
import { Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';
import fondo from '../assets/fondo.png';

// Debe coincidir con el id del div donde se monta tu app en index.html.
// En un proyecto Vite/CRA normalmente es #root.
Modal.setAppElement('#contenedor');

class Login extends React.Component {
  constructor() {
    super();
    this.state = { condition: false, tipousuario: '', modalIsOpen: false }; // Agregamos el estado del modal
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  validar = (usuario, password) => {
    //fetch('http://localhost:8080/Login?User='+usuario+'&password='+password+'')
    fetch('Login?user=' + usuario + '&password=' + password + '')
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
        // Error de red o de parseo -> también avisamos al usuario
        this.openModal();
        this.setState({ condition: false, tipousuario: '' });
      });
  };

  render() {
    const styles = {
      padding: '5px'
    };

    // Estilos extra
    const backgroundStyle = {
      minHeight: 'calc(100vh - 0px)',
      backgroundImage: `url(${fondo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    };

    const glassStyle = {
      width: '100%',
      maxWidth: '420px',
      padding: '2.5rem',
      borderRadius: '24px',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(16px) saturate(160%)',
      WebkitBackdropFilter: 'blur(16px) saturate(160%)',
      border: '1px solid rgba(255, 255, 255, 0.35)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
    };

    const glassLabelStyle = {
      color: '#7aa7e1',
      textShadow: '0 1px 2px rgba(2, 34, 94, 0.4)'
    };

    const modalStyles = {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000
      },
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        maxWidth: '380px',
        width: '90%',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        textAlign: 'center',
        padding: '2rem'
      }
    };

    const { condition, tipousuario } = this.state;

    if (condition && tipousuario == "administrador") {
      console.log("Redirigiendo a administrador...");
      return <Navigate to='/administrator' />;
    }

    return (
      <div>
        {/* Contenedor con espacio para la imagen de fondo */}
        <div style={backgroundStyle}>
          {/* Formulario centrado con efecto liquid glass */}
          <div className="center-container" style={glassStyle} id="equis">
            <h1>LOGIN</h1>
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="user" style={glassLabelStyle}>Usuario</label>
              <input placeholder="Ingrese el usuario" type="text" id="user" className="form-control" />
            </div>
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="password" style={glassLabelStyle}>Password</label>
              <input placeholder="Ingrese su contraseña" type="password" id="password" className="form-control" />
            </div>
            <button
              className="btn btn-primary w-100"
              style={styles}
              onClick={() => this.validar(
                document.getElementById("user").value,
                document.getElementById("password").value
              )}
            >
              Submit
            </button>
          </div>
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={modalStyles}
          contentLabel="Error de inicio de sesión"
        >
          <h2 className="text-danger">Inicio de sesión incorrecto</h2>
          <p>El usuario o la contraseña no son válidos. Por favor, inténtelo de nuevo.</p>
          <button className="btn btn-primary" onClick={this.closeModal}>
            Cerrar
          </button>
        </Modal>
      </div>
    );
  }
}

export default Login;