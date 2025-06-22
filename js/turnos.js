// Datos iniciales de turnos
let turnos = [
  { id: '1', title: 'Zumba', profesor: 'Paola', start: '2025-06-23T08:00:00', cupos: 5 },
  { id: '2', title: 'Yoga', profesor: 'Sofía', start: '2025-06-23T10:00:00', cupos: 2 },
  { id: '3', title: 'Zumba', profesor: 'Marcos', start: '2025-06-24T09:00:00', cupos: 10 },
  { id: '4', title: 'Pilates', profesor: 'Laura', start: '2025-06-25T11:00:00', cupos: 4 },
  { id: '5', title: 'Yoga', profesor: 'Sofía', start: '2025-06-26T08:00:00', cupos: 0 },
];

// Cargar reservas desde localStorage
let reservas = JSON.parse(localStorage.getItem('reservasTurnos')) || {};
turnos.forEach(t => {
  if (reservas[t.id]) {
    t.cupos = Math.max(0, t.cupos - reservas[t.id]);
  }
});

// Filtros
const actividadSelect = document.getElementById('actividadSelect');
const profesorSelect = document.getElementById('profesorSelect');

const actividades = [...new Set(turnos.map(t => t.title))];
const profesores = [...new Set(turnos.map(t => t.profesor))];

actividades.forEach(act => {
  const option = document.createElement('option');
  option.value = act;
  option.textContent = act;
  actividadSelect.appendChild(option);
});

profesores.forEach(prof => {
  const option = document.createElement('option');
  option.value = prof;
  option.textContent = prof;
  profesorSelect.appendChild(option);
});

function getEventosFiltrados() {
  const actFilter = actividadSelect.value;
  const profFilter = profesorSelect.value;

  return turnos
    .filter(t => !actFilter || t.title === actFilter)
    .filter(t => !profFilter || t.profesor === profFilter)
    .map(t => ({
      id: t.id,
      title: `${t.title} (${t.profesor}) - Cupos: ${t.cupos}`,
      start: t.start,
      color: t.cupos > 0 ? '#3788d8' : '#d9534f',
      extendedProps: { cupos: t.cupos, profesor: t.profesor, actividad: t.title }
    }));
}

// Inicialización de FullCalendar
const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: 'timeGridWeek',
  locale: 'es',
  slotMinTime: '06:00:00',
  slotMaxTime: '22:00:00',
  allDaySlot: false,
  height: 600,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'timeGridWeek,timeGridDay'
  },
  events: getEventosFiltrados(),
  eventClick: function(info) {
    reservarTurno(info.event.id);
  }
});
calendar.render();

// Alternancia de vistas
let vistaLista = false;

function toggleVista() {
  vistaLista = !vistaLista;
  document.getElementById("calendar").style.display = vistaLista ? "none" : "block";
  document.getElementById("listaTurnos").style.display = vistaLista ? "block" : "none";
  if (vistaLista) renderListaTurnos();
}

// Renderizar tarjetas estilo app
function renderListaTurnos() {
  const lista = document.getElementById("listaTurnos");
  lista.innerHTML = "";
  const eventos = getEventosFiltrados();

  eventos.forEach(evento => {
    const div = document.createElement("div");
    div.className = "tarjeta-turno";
    div.innerHTML = `
      <h3>${evento.extendedProps.actividad}</h3>
      <p><strong>Profesor:</strong> ${evento.extendedProps.profesor}</p>
      <p><strong>Hora:</strong> ${new Date(evento.start).toLocaleString()}</p>
      <p><strong>Cupos:</strong> ${evento.extendedProps.cupos}</p>
      <button ${evento.extendedProps.cupos === 0 ? "disabled" : ""} onclick="reservarTurno('${evento.id}')">Reservar</button>
    `;
    lista.appendChild(div);
  });
}

// Lógica común de reserva
function reservarTurno(id) {
  const evento = turnos.find(t => t.id === id);
  if (!evento || evento.cupos <= 0) return;

  Swal.fire({
    title: 'Confirmar reserva',
    html: `
      <p><b>Actividad:</b> ${evento.title}</p>
      <p><b>Profesor:</b> ${evento.profesor}</p>
      <p><b>Hora:</b> ${new Date(evento.start).toLocaleString()}</p>
      <p><b>Cupos disponibles:</b> ${evento.cupos}</p>
      <p>¿Querés confirmar la reserva?</p>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Reservar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      evento.cupos--;
      reservas[evento.id] = (reservas[evento.id] || 0) + 1;
      localStorage.setItem('reservasTurnos', JSON.stringify(reservas));

      Swal.fire('¡Reserva exitosa!', '', 'success');

      // Actualizar vistas
      calendar.removeAllEvents();
      calendar.addEventSource(getEventosFiltrados());
      if (vistaLista) renderListaTurnos();
    }
  });
}

// Filtros
actividadSelect.addEventListener('change', () => {
  calendar.removeAllEvents();
  calendar.addEventSource(getEventosFiltrados());
  if (vistaLista) renderListaTurnos();
});

profesorSelect.addEventListener('change', () => {
  calendar.removeAllEvents();
  calendar.addEventSource(getEventosFiltrados());
  if (vistaLista) renderListaTurnos();
});
