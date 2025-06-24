/***********************************************************************
 *  FIT Turnos – Calendario con FullCalendar + SweetAlert2 + localStorage
 **********************************************************************/

/* ---------- helpers localStorage ---------- */
const LS_KEYS = {
  ACT: 'fit_actividades',
  PROF: 'fit_profesores',
  TURNOS: 'fit_turnos',
  RESERVAS: 'fit_reservas',
};
const getLS = (k, d=[]) => JSON.parse(localStorage.getItem(k)) || d;
const setLS = (k, v)   => localStorage.setItem(k, JSON.stringify(v));

/* ---------- seed de ejemplo si el LS está vacío ---------- */
function seedIfEmpty() {
  if (!localStorage.getItem(LS_KEYS.ACT)) {
    setLS(LS_KEYS.ACT, [
      { id: 1, nombre: 'Zumba'  },
      { id: 2, nombre: 'Yoga'   },
      { id: 3, nombre: 'Pilates'}
    ]);
  }
  if (!localStorage.getItem(LS_KEYS.PROF)) {
    setLS(LS_KEYS.PROF, [
      { id: 1, nombre: 'Paola' },
      { id: 2, nombre: 'Sofía' },
      { id: 3, nombre: 'Marcos'},
      { id: 4, nombre: 'Laura' }
    ]);
  }
  if (!localStorage.getItem(LS_KEYS.TURNOS)) {
    setLS(LS_KEYS.TURNOS, [
      { id: 1, actividadId: 1, profesorId: 1, start: '2025-06-23T08:00:00', cupos: 5 },
      { id: 2, actividadId: 2, profesorId: 2, start: '2025-06-23T10:00:00', cupos: 2 },
      { id: 3, actividadId: 1, profesorId: 3, start: '2025-06-24T09:00:00', cupos:10 },
      { id: 4, actividadId: 3, profesorId: 4, start: '2025-06-25T11:00:00', cupos: 4 },
      { id: 5, actividadId: 2, profesorId: 2, start: '2025-06-26T08:00:00', cupos: 0 }
    ]);
  }
  if (!localStorage.getItem(LS_KEYS.RESERVAS)) {
    setLS(LS_KEYS.RESERVAS, {});           // vacío al inicio
  }
}
seedIfEmpty();

/* ---------- carga de datos ---------- */
let actividades = getLS(LS_KEYS.ACT);
let profesores   = getLS(LS_KEYS.PROF);
let turnos       = getLS(LS_KEYS.TURNOS);
let reservas     = getLS(LS_KEYS.RESERVAS);

/* Descontar reservas existentes de los cupos */
turnos.forEach(t => {
  t.cupos = Math.max(0, t.cupos - (reservas[t.id] || 0));
});

/* ---------- elementos del DOM ---------- */
const actividadSelect = document.getElementById('actividadSelect');
const profesorSelect  = document.getElementById('profesorSelect');

/* Rellenar selects */
actividades.forEach(a => {
  const op = new Option(a.nombre, a.id);
  actividadSelect.appendChild(op);
});
profesores.forEach(p => {
  const op = new Option(p.nombre, p.id);
  profesorSelect.appendChild(op);
});

/* ---------- utilidades ---------- */
const nombreActividad = id => actividades.find(a => a.id === id)?.nombre || '';
const nombreProfesor  = id => profesores.find(p => p.id === id)?.nombre || '';

/* Devuelve eventos según filtros */
function eventosFiltrados() {
  const actFilter  = +actividadSelect.value || null;
  const profFilter = +profesorSelect.value  || null;

  return turnos
    .filter(t => !actFilter  || t.actividadId === actFilter)
    .filter(t => !profFilter || t.profesorId  === profFilter)
    .map(t => ({
      id     : t.id,
      title  : `${nombreActividad(t.actividadId)} (${nombreProfesor(t.profesorId)}) - Cupos: ${t.cupos}`,
      start  : t.start,
      color  : t.cupos > 0 ? '#3788d8' : '#d9534f',
      extendedProps: { cupos: t.cupos }          // usamos solo cupos después
    }));
}

/* ---------- inicializar FullCalendar ---------- */
const calendar = new FullCalendar.Calendar(
  document.getElementById('calendar'),
  {
    initialView: 'timeGridWeek',
    locale     : 'es',
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot : false,
    height     : 600,
    headerToolbar:{
      left  :'prev,next today',
      center:'title',
      right :'timeGridWeek,timeGridDay'
    },
    events: eventosFiltrados(),
    eventClick: async info => {
      const turno = turnos.find(t => t.id == info.event.id);
      if (!turno) return;

      if (turno.cupos === 0) {
        Swal.fire('Sin cupos disponibles','','info');
        return;
      }

      const { isConfirmed } = await Swal.fire({
        title: 'Confirmar reserva',
        html: `
          <p><b>Actividad:</b> ${nombreActividad(turno.actividadId)}</p>
          <p><b>Profesor:</b> ${nombreProfesor(turno.profesorId)}</p>
          <p><b>Hora:</b> ${new Date(turno.start).toLocaleString()}</p>
          <p><b>Cupos disponibles:</b> ${turno.cupos}</p>
          <p>¿Querés confirmar la reserva?</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Reservar',
        cancelButtonText : 'Cancelar'
      });

      if (!isConfirmed) return;

      /* --- actualizar cupo y reservas --- */
      turno.cupos -= 1;
      reservas[turno.id] = (reservas[turno.id] || 0) + 1;

      /* persistir */
      setLS(LS_KEYS.TURNOS, turnos);
      setLS(LS_KEYS.RESERVAS, reservas);

      /* refrescar evento */
      info.event.setProp('title', `${nombreActividad(turno.actividadId)} (${nombreProfesor(turno.profesorId)}) - Cupos: ${turno.cupos}`);
      info.event.setProp('color', turno.cupos > 0 ? '#3788d8' : '#d9534f');

      Swal.fire('¡Reserva exitosa!','','success');
    }
  }
);
calendar.render();

/* ---------- listeners para filtros ---------- */
[actividadSelect, profesorSelect].forEach(sel => {
  sel.addEventListener('change', () => {
    calendar.removeAllEvents();
    calendar.addEventSource(eventosFiltrados());
  });
});
