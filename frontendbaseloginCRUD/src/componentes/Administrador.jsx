import React from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import '../style/Administrator.css';

const IconoMas = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconoVer = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconoEditar = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);
const IconoEliminar = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const estilosModal = {
  overlay: { backgroundColor: 'rgba(8,56,99,0.35)', zIndex: 1000 },
  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto',
    transform: 'translate(-50%, -50%)', width: '420px', maxWidth: '90%',
    borderRadius: '18px', padding: '24px', border: 'none',
    boxShadow: '0 12px 40px rgba(8,56,99,0.25)',
  },
};

class Administrador extends React.Component {
  state = {
    data: [],
    error: false,
    modalDeleteIsOpen: false,
    ejercicioAEliminar: null,
  };

  componentDidMount() {
    Modal.setAppElement('#contenedor');
    axios.get("/Ejercicios")
      .then((res) => {
        let data = res.data;
        if (typeof data === "string") data = JSON.parse(data);
        const lista = (Array.isArray(data) ? data : []).map((e, i) => ({
          ...e,
          id: e.id ?? e.idEjercicio ?? e.idEJERCICIO ?? i,
          nombre: e.nombre ?? e.name ?? `Ejercicio ${i + 1}`,
        }));
        this.setState({ data: lista, error: false });
      })
      .catch((err) => {
        console.info(err);
        this.setState({ data: [], error: true });
      });
  }

  confirmarEliminar = (id) => {
    this.setState({ modalDeleteIsOpen: true, ejercicioAEliminar: id });
  };

  cerrarModal = () => {
    this.setState({ modalDeleteIsOpen: false, ejercicioAEliminar: null });
  };

  eliminarEjercicio = () => {
  const id = this.state.ejercicioAEliminar;
  if (id == null) return;

  axios.delete(`/EliminarEjercicio?idEjercicio=${id}`)
    .then((res) => {
      if (res.data && res.data.status === "yes") {
        this.setState((s) => ({
          data: s.data.filter((e) => e.id !== id),
          modalDeleteIsOpen: false,
          ejercicioAEliminar: null,
        }));
      } else {
        console.info("El backend no confirmó el borrado:", res.data);
        this.setState({ modalDeleteIsOpen: false, ejercicioAEliminar: null });
      }
    })
    .catch((err) => {
      console.info(err);
      this.setState({ modalDeleteIsOpen: false, ejercicioAEliminar: null });
    });
};

  render() {
    const { data, error, modalDeleteIsOpen, ejercicioAEliminar } = this.state;
    const nombreAEliminar =
      (data.find((e) => e.id === ejercicioAEliminar) || {}).nombre;

    return (
      <div className="admin-background">
        <div className="admin-wrapper">
          <h1 className="admin-title">Graficador de Gantt</h1>

          <div className="glass-card">
            <div className="glass-header">
              <h2>Ejercicios guardados</h2>
              <Link to="/crear" className="btn-crear">
                <IconoMas /> Crear ejercicio
              </Link>
            </div>

            {data.length === 0 ? (
              <p className="empty-state">
                {error
                  ? "No se pudieron cargar los ejercicios."
                  : "Aún no hay ejercicios guardados."}
              </p>
            ) : (
              <div className="exercise-list">
                {data.map((ejercicio) => (
                  <div key={ejercicio.id} className="exercise-item">
                    <span className="exercise-name">{ejercicio.nombre}</span>

                    <div className="acciones-bar">
                      <Link to={`/visualizar/${ejercicio.id}`} className="accion-btn accion-ver" title="Visualizar">
                        <IconoVer />
                      </Link>
                      <Link to={`/modificar/${ejercicio.id}`} className="accion-btn accion-editar" title="Modificar">
                        <IconoEditar />
                      </Link>
                      <button
                        className="accion-btn accion-eliminar"
                        title="Eliminar"
                        onClick={() => this.confirmarEliminar(ejercicio.id)}
                      >
                        <IconoEliminar />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Modal
          isOpen={modalDeleteIsOpen}
          onRequestClose={this.cerrarModal}
          style={estilosModal}
          contentLabel="Confirmar eliminación"
        >
          <h4 style={{ color: '#083863', fontWeight: 700 }}>¿Eliminar el ejercicio?</h4>
          <p className="text-muted">
            {nombreAEliminar
              ? <>Vas a eliminar <strong>{nombreAEliminar}</strong>. Esta acción no se puede deshacer.</>
              : 'Esta acción no se puede deshacer.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button className="btn btn-secondary" onClick={this.cerrarModal}>Cancelar</button>
            <button className="btn btn-danger" onClick={this.eliminarEjercicio}>Eliminar</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Administrador;