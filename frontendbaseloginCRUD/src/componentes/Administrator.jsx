import React from "react";
import { Link } from "react-router-dom";
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

class Administrator extends React.Component {
  state = {
    data: [],
  };

  componentDidMount() {
    axios.get("Preguntas")
      .then((res) => this.setState({ data: res.data }))
      .catch((err) => {
        console.info(err);
        this.setState({
          data: [
            { id: 1, nombre: 'Ejercicio de cinemática' },
            { id: 2, nombre: 'Diagrama de proyecto web' },
            { id: 3, nombre: 'Planeación de sprint' },
          ],
        });
      });
  }

  eliminarEjercicio = (id) => {
    this.setState({ data: this.state.data.filter((e) => e.id !== id) });
    // axios.delete(`Preguntas/${id}`).catch((err) => console.info(err));
  };

  render() {
    const { data } = this.state;

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
              <p className="empty-state">Aún no hay ejercicios guardados.</p>
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
                        onClick={() => this.eliminarEjercicio(ejercicio.id)}
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
      </div>
    );
  }
}

export default Administrator;