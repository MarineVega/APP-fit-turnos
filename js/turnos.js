<<<<<<< marine
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

  // Filtros  
  const horarios = JSON.parse(localStorage.getItem("horarios")) || [];
  
  /*
  Toma los horarios guardados en localStorage.
  Genera eventos para los días futuros donde esa actividad se dicta (ej: todos los martes y jueves).
  Filtra por la actividad/profesor seleccionado.
  Crea eventos en el calendario para las próximas 2 semanas.
  */
  function getEventosFiltrados() {
    const actFilter = actividadSeleccionada;
    let eventos = [];

    const usuario = localStorage.getItem("usuarioLogueado") || "invitado";

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
    const reservas = JSON.parse(localStorage.getItem("reservasTurnos")) || {};
    const hoy = new Date();
    const diasAMostrar = 14;

    for (let i = 0; i < diasAMostrar; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      const diaNumero = fecha.getDay(); // 0 a 6

      horarios.forEach(horario => {
        const dias = horario.dias.split(',').map(d => d.trim().toLowerCase());
        const actividad = horario.actividad;
        let cupoMaximo = horario.cupoMaximo ;
        const profesor = horario.profesor || "Profesor/a";

        // Si cupoMaximo es NaN o null, lo busco desde la actividad
        if (!cupoMaximo || isNaN(cupoMaximo)){
          console.log("isNaN(cupoMaximo)")
          const actividades = JSON.parse(localStorage.getItem("actividades")) || [];
          const actividadData = actividades.find(a => a.nombre === actividad);
          cupoMaximo = actividadData && actividadData.cupoMaximo ? parseInt(actividadData.cupoMaximo) : 10;
        }
      
        if (
          dias.some(d => diasSemana[d] === diaNumero) &&
          (!actFilter || actividad === actFilter) /*&&
          (!profFilter || profesor === profFilter)*/
        ) {
          const horaInicio = horario.horario.split(" a ")[0];
          const [hh, mm] = horaInicio.split(":").map(n => parseInt(n));
          const fechaClase = new Date(fecha);
          fechaClase.setHours(hh, mm, 0, 0);


          const id = `recurrente-${actividad}-${fechaClase.toISOString()}`;          
          const reservasActuales = reservas[id]?.cantidad || 0;
          const cuposDisponibles = Math.max(0, cupoMaximo - reservasActuales);

          console.log("cuposDisponibles: cupoMaximo - reservasActuales")
          console.log(cupoMaximo)
          console.log(reservasActuales)
          console.log(cuposDisponibles)



          const yaReservado = reservas[id]?.usuario === usuario;
          const colorEvento = yaReservado
            ? '#5cb85c'       // verde si está reservado por el usuario logueado
            : (cuposDisponibles > 0 ? '#3788d8' : '#d9534f');

            
          eventos.push({
            //id: `recurrente-${actividad}-${fechaClase.toISOString()}`,
            id: id,
            title: `${actividad} (${profesor}) - Cupos: ${cuposDisponibles}`,
            start: fechaClase.toISOString(),
            color: colorEvento,            
            extendedProps: {
              cupos: cuposDisponibles,
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
    displayEventTime: false,        /* oculto la hora dentro del cuadro */
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

  function reservarTurno(eventoId) {
    const reservas = JSON.parse(localStorage.getItem("reservasTurnos")) || {};
    const usuario = localStorage.getItem("usuarioLogueado") || "invitado";

    // Buscar evento entre los generados por getEventosFiltrados
    const evento = getEventosFiltrados().find(e => e.id === eventoId);
    if (!evento) return;

    const cuposDisponibles = evento.extendedProps.cupos;
    const reserva = reservas[eventoId];
    const yaReservado = reserva && reserva.usuario === usuario;

    const fechaObj = new Date(evento.start);
    const fecha = fechaObj.toISOString().split("T")[0]; // yyyy-mm-dd
    const hora = fechaObj.toTimeString().substring(0, 5); // HH:MM

  
    // Si ya está reservado, permitir cancelar
    if (yaReservado) {
      Swal.fire({
        title: '¿Querés cancelar tu reserva?',
        html: `
          <p><b>Actividad:</b> ${evento.extendedProps.actividad}</p>
          <p><b>Profesor:</b> ${evento.extendedProps.profesor}</p>
          <p><b>Fecha y hora:</b> ${fecha} ${hora}</p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Cancelar reserva',
        cancelButtonText: 'Cerrar'
      }).then(result => {
        if (result.isConfirmed) {
          delete reservas[eventoId];
          localStorage.setItem("reservasTurnos", JSON.stringify(reservas));
          Swal.fire('Reserva cancelada', '', 'success');

          // Actualizar calendario
          calendar.removeAllEvents();
          calendar.addEventSource(getEventosFiltrados());
        }
      });

      return;
    }

    // Si no está reservado y no hay cupos
    if (cuposDisponibles <= 0) {
      Swal.fire('Sin cupos disponibles', '', 'error');
      return;
    }

    // Confirmar reserva nueva
    Swal.fire({
       title: '¿Confirmás tu reserva?',
    html: `
      <p><b>Actividad:</b> ${evento.extendedProps.actividad}</p>
      <p><b>Profesor:</b> ${evento.extendedProps.profesor}</p>
      <p><b>Fecha y hora:</b> ${fecha} ${hora}</p>
      <p><b>Cupos disponibles:</b> ${cuposDisponibles}</p>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Reservar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      reservas[eventoId] = {
        actividad: evento.extendedProps.actividad,
        usuario: usuario,
        fecha: fecha,
        hora: hora,
        cantidad: 1
      };

      localStorage.setItem("reservasTurnos", JSON.stringify(reservas));
      Swal.fire('¡Reserva confirmada!', '', 'success');

      // Actualizar calendario
      calendar.removeAllEvents();
      calendar.addEventSource(getEventosFiltrados());
    }
  });
  } 
})





// Exportar localStorage a un archivo JSON
function exportarLocalStorage() {
    const datos = localStorage.getItem("reservasTurnos") || "[]";
    const blob = new Blob([datos], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "reservasTurnos_backup.json";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}

// Importar un archivo JSON a localStorage
function importarLocalStorage() {
    Swal.fire({
        title: 'Importar reservas de turnos',
        html: `
            <input type="file" id="inputArchivoImportar" accept=".json" class="swal2-file">
            <label class="advertencia">Seleccione un archivo JSON con las reservas exportadas.</label>
        `,
        showCancelButton: true,
        customClass: {
            cancelButton: 'btnAceptar'
        },
        confirmButtonColor: '#033649',
        confirmButtonText: 'Importar',
        cancelButtonColor: '#6edc8c', 
        cancelButtonText: 'Cancelar',

        focusConfirm: false,
        preConfirm: () => {
            const archivo = document.getElementById('inputArchivoImportar').files[0];
            if (!archivo) {
                Swal.showValidationMessage('Por favor seleccione un archivo');
                return;
            }

            return new Promise((resolve) => {
                const lector = new FileReader();
                lector.onload = function (e) {
                    try {
                        const datos = JSON.parse(e.target.result);
                        if (!Array.isArray(datos)) {
                            throw new Error("Formato no válido");
                        }

                        localStorage.setItem("reservasTurnos", JSON.stringify(datos));
                        resolve();
                    } catch (error) {
                        Swal.showValidationMessage('Archivo inválido o corrupto');
                    }
                };
                lector.readAsText(archivo);
            });
        }
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            Swal.fire('¡Importado!', 'Los horarios fueron cargadas correctamente.', 'success')
                .then(() => {
                    location.reload();
                });
        }
    });
}

=======
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
>>>>>>> desarrollo
