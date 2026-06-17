import React, { Component } from 'react';
import Gantt from 'frappe-gantt';
import '../style/frappe-gantt.css';

class GanttEjemplo extends Component {
  constructor(props) {
    super(props);
    this.ganttRef = React.createRef();
    this.gantt = null;
  }

  componentDidMount() {
    this.gantt = new Gantt(this.ganttRef.current, this.getTasks(), {
      view_mode: 'Week',
      date_format: 'YYYY-MM-DD',
      // Eventos (en Frappe se nombran con guion bajo):
      on_click: (task) => console.log('Click en:', task.name),
      on_date_change: (task, start, end) =>
        console.log('Fechas cambiadas:', task.name, start, end),
    });
  }

  // Cada tarea: { id, name, start, end, progress, dependencies }
  getTasks() {
    return [
      { id: 'tarea-1', name: 'Análisis de requisitos',    start: '2026-06-15', end: '2026-06-19', progress: 100 },
      { id: 'tarea-2', name: 'Diseño de la base de datos', start: '2026-06-22', end: '2026-06-26', progress: 60 },
      { id: 'tarea-3', name: 'Desarrollo del frontend',    start: '2026-06-29', end: '2026-07-08', progress: 20 },
      // Depende de 'tarea-3': Frappe dibuja la flecha de dependencia.
      { id: 'tarea-4', name: 'Pruebas de integración',     start: '2026-07-09', end: '2026-07-14', progress: 0, dependencies: 'tarea-3' },
    ];
  }

  // Cambia la escala temporal sin recrear el diagrama.
  cambiarVista = (modo) => {
    if (this.gantt) this.gantt.change_view_mode(modo);
  };

  render() {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Cronograma del proyecto</h2>

        <div style={{ marginBottom: '12px' }}>
          <button onClick={() => this.cambiarVista('Day')}>Día</button>{' '}
          <button onClick={() => this.cambiarVista('Week')}>Semana</button>{' '}
          <button onClick={() => this.cambiarVista('Month')}>Mes</button>
        </div>

        {/* Frappe Gantt inyecta el SVG dentro de este contenedor. */}
        <div ref={this.ganttRef}></div>
      </div>
    );
  }
}

export default GanttEjemplo;