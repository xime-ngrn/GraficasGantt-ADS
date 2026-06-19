import React, { Component } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Gantt from 'frappe-gantt';
import '../style/frappe-gantt.css';
import '../style/CrearEjercicio.css';

const COLORES = ['#92d0db', '#B8C9B3', '#F1C09C', '#e197bb', '#C2BCF5'];

const IconoFlecha = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconoExportar = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const estilosModal = {
  overlay: { backgroundColor: 'rgba(8,56,99,0.35)', zIndex: 1000 },
  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto',
    transform: 'translate(-50%, -50%)', width: '380px', maxWidth: '90%',
    borderRadius: '18px', padding: '24px', border: 'none',
    boxShadow: '0 12px 40px rgba(8,56,99,0.25)',
  },
};

class VisualizarEjercicio extends Component {
  constructor(props) {
    super(props);
    this.ganttRef = React.createRef();
    this.gantt = null;
    this.state = {
      idEjercicio: props.idEjercicio,
      nombreEjercicio: '',
      tareas: [],
      cargando: true,
      error: false,
      viewMode: 'Week',
      modalExportar: false,
      exportando: false,
    };
  }

  componentDidMount() {
    Modal.setAppElement('#contenedor');
    axios.get(`/Ejercicio?id=${this.state.idEjercicio}`)
      .then((res) => {
        let data = res.data;
        if (typeof data === 'string') data = JSON.parse(data);

        const tareas = (data.tareas || []).map((t) => ({
          id: 'tarea-' + t.idTAREA,
          name: t.nombre,
          start: (t.fecha_inicio || '').slice(0, 10),
          end: (t.fecha_terminacion || '').slice(0, 10),
          dependencies: t.idDependencia != null ? 'tarea-' + t.idDependencia : undefined,
        }));

        this.setState({ nombreEjercicio: data.nombre || '', tareas, cargando: false, error: false });
      })
      .catch((err) => {
        console.info(err);
        this.setState({ cargando: false, error: true });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tareas !== this.state.tareas || prevState.viewMode !== this.state.viewMode) {
      this.renderizarGantt();
    }
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

  cambiarVista = (modo) => this.setState({ viewMode: modo });

  abrirModalExportar = () => this.setState({ modalExportar: true });
  cerrarModalExportar = () => this.setState({ modalExportar: false });

  nombreArchivo() {
    return (this.state.nombreEjercicio || 'diagrama').replace(/[^\w\-]+/g, '_');
  }

  exportar = async (formato) => {
    const contenedor = this.ganttRef.current;
    if (!contenedor) return;

    this.setState({ exportando: true });
    try {
      const canvas = await html2canvas(contenedor, { backgroundColor: '#ffffff', scale: 2 });

      if (formato === 'jpg') {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${this.nombreArchivo()}.jpg`;
        a.click();
      } else if (formato === 'pdf') {
        const dataUrl = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: canvas.width >= canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${this.nombreArchivo()}.pdf`);
      }

      this.setState({ exportando: false, modalExportar: false });
    } catch (err) {
      console.info(err);
      this.setState({ exportando: false });
    }
  };

  render() {
    const { nombreEjercicio, tareas, cargando, error, viewMode, modalExportar, exportando } = this.state;

    const cssColores = COLORES.map((color, i) => `
      .gantt .gantt-color-${i} .bar { fill: ${color}; }
    `).join('\n');

    const vistas = [['Day', 'Día'], ['Week', 'Semana'], ['Month', 'Mes']];

    return (
      <div className="crear-background">
        <style>{cssColores}</style>

        <div className="crear-wrapper">
          <div className="crear-topbar">
            <Link to="/administrador" className="btn-volver">
              <IconoFlecha /> Regresar
            </Link>

            <button
              className="btn-guardar"
              onClick={this.abrirModalExportar}
              disabled={tareas.length === 0}
            >
              <IconoExportar /> Exportar diagrama
            </button>
          </div>

          <h1 className="crear-title">{nombreEjercicio || 'Visualizar ejercicio'}</h1>

          {error && <div className="alert alert-danger py-2">No se pudo cargar el ejercicio.</div>}

          {cargando ? (
            <p className="text-muted">Cargando ejercicio…</p>
          ) : (
            <div className="row g-3">
              <div className="col-md-4">
                <div className="glass-card">
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

        <Modal
          isOpen={modalExportar}
          onRequestClose={this.cerrarModalExportar}
          style={estilosModal}
          contentLabel="Exportar diagrama"
        >
          <h4 className="modal-titulo mb-3" style={{ color: '#083863', fontWeight: 700 }}>
            Exportar diagrama
          </h4>
          <p className="text-muted">Elige el formato en el que quieres descargar el diagrama.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            <button className="btn btn-primary" onClick={() => this.exportar('pdf')} disabled={exportando}>
              {exportando ? 'Generando…' : 'Exportar como PDF'}
            </button>
            <button className="btn btn-outline-primary" onClick={() => this.exportar('jpg')} disabled={exportando}>
              {exportando ? 'Generando…' : 'Exportar como JPG'}
            </button>
            <button className="btn btn-secondary" onClick={this.cerrarModalExportar} disabled={exportando}>
              Cancelar
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

function VisualizarEjercicioConParams(props) {
  const params = useParams();
  return <VisualizarEjercicio {...props} idEjercicio={params.id} />;
}

export default VisualizarEjercicioConParams;