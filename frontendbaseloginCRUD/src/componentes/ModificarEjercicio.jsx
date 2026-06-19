import React, { Component } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import Gantt from 'frappe-gantt';
import '../style/frappe-gantt.css';
import '../style/CrearEjercicio.css';

const COLORES = ['#92d0db', '#B8C9B3', '#F1C09C', '#e197bb', '#C2BCF5'];

const IconoFlecha = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconoGuardar = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
);
const IconoCheck = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconoEditar = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const estilosModal = {
  overlay: { backgroundColor: 'rgba(8,56,99,0.35)', zIndex: 1000 },
  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto',
    transform: 'translate(-50%, -50%)', width: '440px', maxWidth: '90%',
    borderRadius: '18px', padding: '20px', border: 'none',
    boxShadow: '0 12px 40px rgba(8,56,99,0.25)',
  },
};
const estilosModalSalir = {
  ...estilosModal,
  content: { ...estilosModal.content, width: '480px' },
};

class ModificarEjercicio extends Component {
  constructor(props) {
    super(props);
    this.ganttRef = React.createRef();
    this.gantt = null;
    this.state = {
      idEjercicio: props.idEjercicio,
      nombreEjercicio: '',
      tareas: [],
      cargando: true,
      modalAbierto: false,
      modalSalir: false,
      editandoLocalId: null,
      hayCambios: false,
      redirigir: false,
      errorGuardar: '',
      viewMode: 'Week',
      siguienteNueva: 1,
      nombre: '', inicio: '', fin: '', dependencia: '',
    };
  }

  componentDidMount() {
    Modal.setAppElement('#contenedor');
    this.cargarEjercicio();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tareas !== this.state.tareas || prevState.viewMode !== this.state.viewMode) {
      this.renderizarGantt();
    }
  }

  cargarEjercicio() {
    axios.get(`/Ejercicio?id=${this.state.idEjercicio}`)
      .then((res) => {
        let data = res.data;
        if (typeof data === 'string') data = JSON.parse(data);

        const tareas = (data.tareas || []).map((t) => ({
          idTarea: t.idTAREA,
          id: 'tarea-' + t.idTAREA,
          name: t.nombre,
          start: (t.fecha_inicio || '').slice(0, 10),
          end: (t.fecha_terminacion || '').slice(0, 10),
        }));

        this.setState({ nombreEjercicio: data.nombre || '', tareas, cargando: false });
      })
      .catch((err) => {
        console.info(err);
        this.setState({ cargando: false, errorGuardar: 'No se pudo cargar el ejercicio.' });
      });
  }

  tareasConColor() {
    return this.state.tareas.map((t, i) => {
      const color = COLORES[i % COLORES.length];
      return {
        ...t,
        progress: 0,
        color: color,
        custom_class: 'gantt-color-' + (i % COLORES.length),
      };
    });
  }

  renderizarGantt() {
    const contenedor = this.ganttRef.current;
    if (!contenedor) return;
    contenedor.innerHTML = '';

    if (this.state.tareas.length === 0) {
      this.gantt = null;
      return;
    }

    this.gantt = new Gantt(contenedor, this.tareasConColor(), {
      view_mode: this.state.viewMode,
      date_format: 'YYYY-MM-DD',
      readonly: true,
      infinite_padding: false,
    });
  }

  abrirModalNueva = () =>
    this.setState({ modalAbierto: true, editandoLocalId: null, nombre: '', inicio: '', fin: '', dependencia: '' });

  abrirModalEditar = (t) =>
    this.setState({
      modalAbierto: true,
      editandoLocalId: t.id,
      nombre: t.name, inicio: t.start, fin: t.end, dependencia: t.dependencies || '',
    });

  cerrarModal = () =>
    this.setState({ modalAbierto: false, editandoLocalId: null, nombre: '', inicio: '', fin: '', dependencia: '' });

  abrirModalSalir = () => this.setState({ modalSalir: true });
  cerrarModalSalir = () => this.setState({ modalSalir: false });

  manejarCampo = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  manejarNombreEjercicio = (e) =>
    this.setState({ nombreEjercicio: e.target.value, hayCambios: true });

  guardarTarea = () => {
    const { nombre, inicio, fin, dependencia, editandoLocalId, siguienteNueva } = this.state;
    if (!nombre || !inicio || !fin) return;

    if (editandoLocalId) {
      this.setState({
        hayCambios: true, modalAbierto: false, editandoLocalId: null,
        tareas: this.state.tareas.map((t) =>
          t.id === editandoLocalId
            ? { ...t, name: nombre, start: inicio, end: fin, dependencies: dependencia || undefined }
            : t
        ),
        nombre: '', inicio: '', fin: '', dependencia: '',
      });
    } else {
      const localId = 'nueva-' + siguienteNueva;
      const nueva = { idTarea: null, id: localId, name: nombre, start: inicio, end: fin };
      if (dependencia) nueva.dependencies = dependencia;
      this.setState({
        tareas: [...this.state.tareas, nueva],
        siguienteNueva: siguienteNueva + 1,
        hayCambios: true, modalAbierto: false,
        nombre: '', inicio: '', fin: '', dependencia: '',
      });
    }
  };

  eliminarTarea = (id) => {
    this.setState({
      hayCambios: true,
      tareas: this.state.tareas
        .filter((t) => t.id !== id)
        .map((t) => (t.dependencies === id ? { ...t, dependencies: '' } : t)),
    });
  };

  guardarDiagrama = (salir = false) => {
    const { idEjercicio, nombreEjercicio, tareas } = this.state;
    if (!nombreEjercicio.trim() || tareas.length === 0) return;

    this.setState({ errorGuardar: '' });

    // Solo las tareas con idTarea (existentes), que son las que el servlet sabe actualizar.
    const existentes = tareas.filter((t) => t.idTarea != null);

    const params = new URLSearchParams();
    params.append('idEjercicio', idEjercicio);
    params.append('nombreEjercicio', nombreEjercicio);
    existentes.forEach((t) => {
      params.append('idTarea', t.idTarea);
      params.append('tareaNombre', t.name);
      params.append('tareaInicio', t.start);
      params.append('tareaFin', t.end);
    });

    axios.post('/ModificarEjercicio', params)
      .then((res) => {
        if (res.data && res.data.status === 'yes') {
          this.setState({ hayCambios: false, modalSalir: false, redirigir: salir });
        } else {
          this.setState({ errorGuardar: (res.data && res.data.message) || 'No se pudo actualizar.' });
        }
      })
      .catch((err) => {
        console.info(err);
        this.setState({ errorGuardar: 'Error de conexión al actualizar.' });
      });
  };

  cambiarVista = (modo) => this.setState({ viewMode: modo });

  render() {
    const { nombreEjercicio, tareas, cargando, modalAbierto, modalSalir, editandoLocalId,
            hayCambios, redirigir, errorGuardar, viewMode,
            nombre, inicio, fin, dependencia } = this.state;

    if (redirigir) return <Navigate to="/administrador" />;

    const formularioValido = nombre && inicio && fin;
    const puedeGuardar = nombreEjercicio.trim() && tareas.length > 0;
    const hayTareasNuevas = tareas.some((t) => t.idTarea == null);

    const cssColores = COLORES.map((color, i) => `
      .gantt .gantt-color-${i} .bar { fill: ${color}; }
    `).join('\n');

    const vistas = [['Day', 'Día'], ['Week', 'Semana'], ['Month', 'Mes']];

    return (
      <div className="crear-background">
        <style>{cssColores}</style>

        <div className="crear-wrapper">
          <div className="crear-topbar">
            {hayCambios ? (
              <button className="btn-volver" onClick={this.abrirModalSalir}>
                <IconoFlecha /> Regresar
              </button>
            ) : (
              <Link to="/administrador" className="btn-volver">
                <IconoFlecha /> Regresar
              </Link>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {!hayCambios && tareas.length > 0 && (
                <span className="guardado-ok"><IconoCheck /> Guardado</span>
              )}
              <button
                className="btn-guardar"
                onClick={() => this.guardarDiagrama(false)}
                disabled={!puedeGuardar || !hayCambios}
              >
                <IconoGuardar /> Guardar cambios
              </button>
            </div>
          </div>

          <h1 className="crear-title">Modificar diagrama de Gantt</h1>

          {errorGuardar && <div className="alert alert-danger py-2">{errorGuardar}</div>}
          {hayTareasNuevas && (
            <div className="alert alert-warning py-2">
              Las tareas nuevas no se guardarán: el backend actual solo actualiza las tareas existentes.
            </div>
          )}

          {cargando ? (
            <p className="text-muted">Cargando ejercicio…</p>
          ) : (
            <div className="row g-3">
              <div className="col-md-4">
                <div className="glass-card">
                  <div className="mb-3">
                    <label className="form-label" style={{ color: '#083863', fontWeight: 600 }}>
                      Nombre del ejercicio
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={nombreEjercicio}
                      onChange={this.manejarNombreEjercicio}
                    />
                  </div>

                  <button className="btn-agregar" onClick={this.abrirModalNueva}>
                    + Agregar tarea
                  </button>

                  <h5>Tareas</h5>
                  {tareas.length === 0 ? (
                    <p className="text-muted">Este ejercicio no tiene tareas.</p>
                  ) : (
                    tareas.map((t, i) => (
                      <div className="tarea-item" key={t.id}>
                        <div>
                          <span className="tarea-color" style={{ backgroundColor: COLORES[i % COLORES.length] }} />
                          <span className="tarea-nombre">{t.name}</span>
                          <div className="tarea-fechas">
                            <small>{t.start} → {t.end}</small>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            className="btn-quitar"
                            title="Editar"
                            style={{ color: '#083863' }}
                            onClick={() => this.abrirModalEditar(t)}
                          >
                            <IconoEditar />
                          </button>
                          <button className="btn-quitar" title="Quitar" onClick={() => this.eliminarTarea(t.id)}>×</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="col-md-8">
                <div className="glass-card">
                  <div className="vista-bar">
                    {vistas.map(([modo, etiqueta]) => (
                      <button
                        key={modo}
                        className={'btn-vista' + (viewMode === modo ? ' activa' : '')}
                        onClick={() => this.cambiarVista(modo)}
                      >
                        {etiqueta}
                      </button>
                    ))}
                  </div>
                  <div className="gantt-surface">
                    <div ref={this.ganttRef}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Modal isOpen={modalAbierto} onRequestClose={this.cerrarModal} style={estilosModal} contentLabel="Tarea">
          <h4 className="modal-titulo mb-3">{editandoLocalId ? 'Editar tarea' : 'Nueva tarea'}</h4>

          <div className="mb-2">
            <label className="form-label">Nombre</label>
            <input type="text" name="nombre" className="form-control" autoFocus value={nombre} onChange={this.manejarCampo} />
          </div>

          <div className="row">
            <div className="col mb-2">
              <label className="form-label">Inicio</label>
              <input type="date" name="inicio" className="form-control" value={inicio} onChange={this.manejarCampo} />
            </div>
            <div className="col mb-2">
              <label className="form-label">Fin</label>
              <input type="date" name="fin" className="form-control" value={fin} onChange={this.manejarCampo} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Depende de (opcional)</label>
            <select name="dependencia" className="form-select" value={dependencia} onChange={this.manejarCampo}>
              <option value="">Ninguna</option>
              {tareas.filter((t) => t.id !== editandoLocalId).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="modal-acciones">
            <button className="btn btn-secondary" onClick={this.cerrarModal}>Cancelar</button>
            <button className="btn btn-primary" onClick={this.guardarTarea} disabled={!formularioValido}>
              {editandoLocalId ? 'Guardar' : 'Agregar'}
            </button>
          </div>
        </Modal>

        <Modal isOpen={modalSalir} onRequestClose={this.cerrarModalSalir} style={estilosModalSalir} contentLabel="Salir sin guardar">
          <h4 className="modal-titulo mb-2">¿Salir sin guardar?</h4>
          <p className="text-muted">Tienes cambios sin guardar. Si sales ahora, se perderán.</p>

          <div className="modal-acciones">
            <button className="btn btn-secondary" onClick={this.cerrarModalSalir}>Cancelar</button>
            <Link to="/administrador" className="btn btn-outline-danger">Salir sin guardar</Link>
            <button className="btn btn-primary" onClick={() => this.guardarDiagrama(true)} disabled={!puedeGuardar}>
              Guardar y salir
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

function ModificarEjercicioConParams(props) {
  const params = useParams();
  return <ModificarEjercicio {...props} idEjercicio={params.id} />;
}

export default ModificarEjercicioConParams;