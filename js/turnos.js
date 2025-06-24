// Cargar todas las actividades del localStorage  
let actividadesCarrusel = JSON.parse(localStorage.getItem("actividades")) || [];
let indiceInicio = 0;
let actividadSeleccionada = actividadesCarrusel.length > 0 ? actividadesCarrusel[1].nombre : null;
let calendar;               // la vamos a inicializar después
let carrusel, btnAtras, btnAdelante;

function cargarCarrusel() {
  carrusel.innerHTML = "";

  const visibles = actividadesCarrusel.slice(indiceInicio, indiceInicio + 3);
  visibles.forEach((actividad, index) => {
    const div = document.createElement("div");
    div.className = "actividad-card";
    if (index === 1) div.classList.add("seleccionada");

    div.innerHTML = `
      <img src="${actividad.imagen}" alt="${actividad.nombre}" />
      <p>${actividad.nombre}</p>
    `;
    carrusel.appendChild(div);
  });

  if (visibles[1]) {
    actividadSeleccionada = visibles[1].nombre;
  }

  // Mostrar u ocultar flechas
  const hayMasDeTres = actividadesCarrusel.length > 3;
  btnAtras.style.display = hayMasDeTres ? "flex" : "none";
  btnAdelante.style.display = hayMasDeTres ? "flex" : "none";
}


window.moverCarrusel = function(direccion) {
  const total = actividadesCarrusel.length;
  indiceInicio += direccion;
  if (indiceInicio < 0) indiceInicio = total - 3;
  if (indiceInicio > total - 3) indiceInicio = 0;
  cargarCarrusel();

  // Actualizar eventos en calendario cuando cambia actividad
  calendar.removeAllEvents();
  calendar.addEventSource(getEventosFiltrados());
}

document.addEventListener("DOMContentLoaded", () => {
  
  // Carrusel dinámico de actividades desde localStorage
  carrusel = document.getElementById("carruselActividades");
  btnAtras = document.getElementById("flechaAtras");
  btnAdelante = document.getElementById("flechaAdelante");

  cargarCarrusel();
  
  // Cargo los horarios desde localStorage
  const horariosRecurrentes = JSON.parse(localStorage.getItem("horarios")) || [];

  // Datos iniciales de turnos
  let turnos = [
    { id: '1', title: 'Zumba', profesor: 'Paola', start: '2025-06-23T08:00:00', cupos: 5 },
    { id: '2', title: 'Yoga', profesor: 'Sofía', start: '2025-06-23T10:00:00', cupos: 2 },
    { id: '3', title: 'Zumba', profesor: 'Marcos', start: '2025-06-24T09:00:00', cupos: 10 },
    { id: '4', title: 'Pilates', profesor: 'Laura', start: '2025-06-25T11:00:00', cupos: 4 },
    { id: '5', title: 'Yoga', profesor: 'Sofía', start: '2025-06-26T08:00:00', cupos: 0 },
  ];

  /*
  // Cargar reservas desde localStorage
  let reservas = JSON.parse(localStorage.getItem('reservasTurnos')) || {};
  turnos.forEach(t => {
    if (reservas[t.id]) {
      t.cupos = Math.max(0, t.cupos - reservas[t.id]);
    }
  });
  */

  // Filtros
  const profesorSelect = document.getElementById('profesorSelect');

  const actividades = [...new Set(turnos.map(t => t.title))];
  const profesores = [...new Set(turnos.map(t => t.profesor))];

  actividades.forEach(act => {
    const option = document.createElement('option');
    option.value = act;
    option.textContent = act;
  });

  profesores.forEach(prof => {
    const option = document.createElement('option');
    option.value = prof;
    option.textContent = prof;
    profesorSelect.appendChild(option);
  });
 
  /*
  Toma los horarios guardados en localStorage.
  Genera eventos para los días futuros donde esa actividad se dicta (ej: todos los martes y jueves).
  Filtra por la actividad/profesor seleccionado.
  Crea eventos en el calendario para las próximas 2 semanas.
  */
  function getEventosFiltrados() {
    const actFilter = actividadSeleccionada;
    const profFilter = profesorSelect.value;

    let eventos = [...turnos]
      .filter(t => !actFilter || t.title === actFilter)
      .filter(t => !profFilter || t.profesor === profFilter)
      .map(t => ({
        id: t.id,
        title: `${t.title} (${t.profesor}) - Cupos: ${t.cupos}`,
        start: t.start,
        color: t.cupos > 0 ? '#3788d8' : '#d9534f',
        extendedProps: { cupos: t.cupos, profesor: t.profesor, actividad: t.title }
      }));

    const diasSemana = {
      domingo: 0,
      lunes: 1,
      martes: 2,
      miercoles: 3,
      miércoles: 3,
      jueves: 4,
      viernes: 5,
      sabado: 6,
      sábado: 6
    };

    const horarios = JSON.parse(localStorage.getItem("horarios")) || [];
    const hoy = new Date();
    const diasAMostrar = 14;

    for (let i = 0; i < diasAMostrar; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      const diaNumero = fecha.getDay(); // 0 a 6

      horarios.forEach(horario => {
        const dias = horario.dias.split(',').map(d => d.trim().toLowerCase());
        const actividad = horario.actividad;
        const profesor = horario.profesor || "Profesor/a";
        const cupos = horario.cupoMaximo ?? 10;

        if (
          dias.some(d => diasSemana[d] === diaNumero) &&
          (!actFilter || actividad === actFilter) &&
          (!profFilter || profesor === profFilter)
        ) {
          const horaInicio = horario.horario.split(" a ")[0];
          const [hh, mm] = horaInicio.split(":").map(n => parseInt(n));
          const fechaClase = new Date(fecha);
          fechaClase.setHours(hh, mm, 0, 0);

          eventos.push({
            id: `recurrente-${actividad}-${fechaClase.toISOString()}`,
            title: `${actividad} (${profesor}) - Cupos: ${cupos}`,
            start: fechaClase.toISOString(),          
            color: '#5cb85c',
            extendedProps: {
              cupos: cupos,
              profesor: profesor,
              actividad: actividad
            }
          });
        }
      });
    }

    return eventos;
  }

  // Defino que getEventosFiltrados esté disponible globalmente, para poder usarse afuera del DOMContentLoaded
  window.getEventosFiltrados = getEventosFiltrados;

  // Inicialización de FullCalendar
  const calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    locale: 'es',
    slotMinTime: '08:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    height: 600,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    eventTimeFormat: false,       // para no mostrar la hora en cada cuadro
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
  /*
  actividadSelect.addEventListener('change', () => {
    calendar.removeAllEvents();
    calendar.addEventSource(getEventosFiltrados());
    if (vistaLista) renderListaTurnos();
  });
*/

  profesorSelect.addEventListener('change', () => {
    calendar.removeAllEvents();
    calendar.addEventSource(getEventosFiltrados());
    if (vistaLista) renderListaTurnos();
  });

  
})




