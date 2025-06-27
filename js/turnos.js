// Cargar todas las actividades del localStorage  
let actividadesCarrusel = JSON.parse(localStorage.getItem("actividades")) || [];
let indiceInicio = 0;
let actividadSeleccionada = actividadesCarrusel.length > 0 ? actividadesCarrusel[0].nombre : null;
let calendar;               // la vamos a inicializar después
let carrusel, btnAtras, btnAdelante;

// configuro estilos para sweetalert    
const swalEstilo = Swal.mixin({
  imageWidth: 200,       // ancho en píxeles
  imageHeight: 200,      // alto en píxeles 
  background: '#bababa',  
  confirmButtonColor: '#6edc8c',
  customClass: {
    confirmButton: 'btnAceptar',    
    cancelButton: 'btnCancelar'
  }  
});
  

function cargarCarrusel() {
  carrusel.innerHTML = "";

  const total = actividadesCarrusel.length;
  
  if (total === 0) {
    carrusel.innerHTML = "<p>No hay actividades disponibles.</p>";
    return;
  }
  
  const visibles = [];

  //const visibles = actividadesCarrusel.slice(indiceInicio, indiceInicio + 3);
  
  // muestro siempre las actividades con "loop infinito" circular, xq si sumaba de 3, no mostraba ni la 1º ni la última actividad si no era múltiplo de 3
  for (let i = 0; i < 3; i++) {
    const index = (indiceInicio + i) % total;
    visibles.push(actividadesCarrusel[index]);
  }
  
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

  actividadSeleccionada = visibles[1].nombre;

  // Mostrar u ocultar flechas
  const hayMasDeTres = actividadesCarrusel.length > 3;
  btnAtras.style.display = hayMasDeTres ? "flex" : "none";
  btnAdelante.style.display = hayMasDeTres ? "flex" : "none";
}


window.moverCarrusel = function(direccion) {
  
  const total = actividadesCarrusel.length;
  indiceInicio = (indiceInicio + direccion + total) % total;
  cargarCarrusel();

  // Actualizar eventos en calendario cuando cambia actividad
  calendar.removeAllEvents();
  calendar.addEventSource(getEventosFiltrados());
}

document.addEventListener("DOMContentLoaded", () => {
  
  /* =========================================================
  MENÚ DESPLEGABLE HAMBURGUESA
  ========================================================= */
  const btnMenu = document.getElementById("btnMenu");
  const menu    = document.getElementById("menuDesplegable");
  
  /* Mostrar / ocultar menú al hacer clic en el ícono */
  if (btnMenu) {
      btnMenu.addEventListener("click", function (e) {
          e.preventDefault();
          menu.classList.toggle("mostrar");
      });
  }
  
  /* Esconde el menú si se hace clic fuera de él */
  document.addEventListener("click", function (e) {
      const clickeaDentro = menu.contains(e.target);
      const clickeaBoton  = btnMenu.contains(e.target);
      
      if (!clickeaDentro && !clickeaBoton) {
          menu.classList.remove("mostrar");
      }
  });
  
  
  
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
        const profesor = horario.profesor;

        // Si cupoMaximo es NaN o null, lo busco desde la actividad        
        if (cupoMaximo == null || isNaN(cupoMaximo)) {
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
        
          const id = `recurrente-${actividad}-${profesor}-${fechaClase.toISOString()}-${horario.horario}`;
        
          const reservasActuales = reservas[id]?.cantidad || 0;
          const cuposDisponibles = Math.max(0, cupoMaximo - reservasActuales);

          const yaReservado = reservas[id]?.usuario === usuario;
          const colorEvento = yaReservado
            ? '#5cb85c'       // verde si está reservado por el usuario logueado
            : (cuposDisponibles > 0 ? '#3788d8' : '#d9534f');
            
          eventos.push({
            //id: `recurrente-${actividad}-${fechaClase.toISOString()}`,
            id: id,
            //title: `${actividad} (${profesor}) - Cupos: ${cuposDisponibles}`,
            //title: `${actividad} Cupo: ${cuposDisponibles}`,
            //title: `${profesor} Cupo: ${cuposDisponibles}`,
            title: `${horaInicio} ${profesor ? "\n" + profesor : ""} \nCupo: ${cuposDisponibles}`, // si profesor tiene valor, lo muestra seguido de un espacio; si es null, undefined o "", no muestra nada
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
    initialDate: new Date(),        // centra el calendario en el día actual
    displayEventTime: false,        // oculto la hora dentro del cuadro
    locale: 'es',                   // idioma español
    buttonText: {
      today: 'hoy',
      month: 'mes',
      week: 'semana',
      day: 'día',
      list: 'lista'
    },    
    slotMinTime: '08:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    height: 500,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    // cambio el puntero del mous en aquellas celdas que tienen info, para poder reservar/cancelar
    dayCellDidMount: function(info) {    
      info.el.style.cursor = 'pointer';
    },
    eventTimeFormat: false,       // para no mostrar la hora en cada cuadro
    events: getEventosFiltrados(),
      eventClick: function(info) {
        reservarTurno(info.event.id);
      }
  });
  calendar.render();

  // busca la columna del día actual y hace scroll hacia ella
  setTimeout(() => {
    const hoy = new Date();
    const hoyColumna = document.querySelector(`.fc-timegrid-col[data-date="${hoy.toISOString().split('T')[0]}"]`);
    if (hoyColumna) {
      hoyColumna.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, 100);

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
      swalEstilo.fire({
        title: '¿Querés cancelar tu reserva?',
        imageUrl: '../assets/img/pensando.png',
        html: `
        <p><b>Actividad:</b> ${evento.extendedProps.actividad}</p>
        ${evento.extendedProps.profesor ? '<p><b>Profesor: </b>' + evento.extendedProps.profesor: "" }</p>        
        <p><b>Fecha y hora:</b> ${fecha} ${hora}</p>
        `,
        //icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6edc8c',
        customClass: {
          cancelButton: 'btnAceptar'
        }
      }).then(result => {
        if (result.isConfirmed) {
          delete reservas[eventoId];
          localStorage.setItem("reservasTurnos", JSON.stringify(reservas));
          swalEstilo.fire({
            title: 'Reserva cancelada', 
            text: '',             
            icon: 'success',
            confirmButtonColor: '#6edc8c',
            customClass: {
              confirmButton: 'btnAceptar'
            } 
          });

          // Actualizar calendario
          calendar.removeAllEvents();
          calendar.addEventSource(getEventosFiltrados());
        }
      });

      return;
    }

    // Si no está reservado y no hay cupos
    if (cuposDisponibles <= 0) {      
      swalEstilo.fire({
        title: '', 
        text: 'Sin cupos disponibles',
        imageUrl: '../assets/img/error.png',
      });

      return;
    }

    // Confirmar reserva nueva
    swalEstilo.fire({
      title: '¿Confirmás tu reserva?',
      html: `
        <p><b>Actividad:</b> ${evento.extendedProps.actividad}</p>      
        ${evento.extendedProps.profesor ? '<p><b>Profesor: </b>' + evento.extendedProps.profesor: "" }</p>        
        <p><b>Fecha y hora:</b> ${fecha} ${hora}</p>
        <p><b>Cupos disponibles:</b> ${cuposDisponibles}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',

      // cambio dinámicamente el color del texto del botón Cancelar; tengo que agregar el bloque didRender dentro del swalEstilo... porque es una función que se ejecuta cuando se muestra el alerta, y el mixin solo define una configuración base.
      didRender: () => {
      const cancelButton = Swal.getCancelButton();
      if (cancelButton) {
        cancelButton.style.color = '#222222';   // cambio el color de texto del botón Cancelar
        // cambia de color la letra cuando paso el mouse (sería el hover)
        cancelButton.addEventListener('mouseover', () => {
          cancelButton.style.color = '#f5f5f5';
        });
        cancelButton.addEventListener('mouseout', () => {
          cancelButton.style.color = '#222222';
        });
      }
    }      
    }).then(result => {
      // valido si ya hay otra reserva del usuario en esa fecha y hora (aunque sea distinta actividad)
        const conflicto = Object.entries(reservas).find(([id, r]) => {
          return r.usuario === usuario && r.fecha === fecha && r.hora === hora && id !== eventoId;
        });

        if (conflicto) {
          swalEstilo.fire({
           // icon: 'error',
            title: 'Conflicto de horario',
            imageUrl: '../assets/img/error.png',
            html: `
              Ya tenés una reserva para ese día y hora.<br>
              No podés reservar más de una actividad al mismo tiempo.
            `,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Cerrar',
            customClass: {
              confirmButton: ''   // elimino la clase
            }
          });
          return;
        }

      if (result.isConfirmed) {
        reservas[eventoId] = {
          actividad: evento.extendedProps.actividad,
          usuario: usuario,
          fecha: fecha,
          hora: hora,
          cantidad: 1
        };

        localStorage.setItem("reservasTurnos", JSON.stringify(reservas));
        //swalEstilo.fire('¡Reserva confirmada!', '', 'success');

         swalEstilo.fire({
            title: '¡Reserva confirmada!', 
            text: '',             
            icon: 'success',
            imageUrl: '../assets/img/chica_ok.png'
          });
        

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

