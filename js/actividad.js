function mostrarMensajeError(elementId, mensaje) {
    document.getElementById(elementId).innerText = mensaje;
}

function resetMesajesError() {
    document.querySelectorAll('.mensaje-error').forEach((elemento) => {
        elemento.innerText = "";
    });
}

function limpiarFormulario() {
    nombre.value = "";
    descripcion.value = "";
    cupoMaximo.value = "";
    resetMesajesError();
    btnAceptar.dataset.editIndex = ""; // borra modo edición si estaba activo
}

function mostrarListadoActividades() {
    const lista = document.getElementById("actividadesLista");
    lista.innerHTML = "";

    const actividades = JSON.parse(localStorage.getItem("actividades")) || [];

     if (actividades.length > 0) {
        actividades.forEach((act, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${act.nombre}</strong><br>
                ${act.descripcion}<br>
                Cupo máximo: ${act.cupoMaximo}
            `;
            lista.appendChild(li);
        });
    } else {
        lista.innerHTML = "<li>No hay actividades registradas.</li>";
    }

    /*
    if (actividades.length > 0) {
        actividades.forEach((act, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${act.nombre}</strong><br>
                ${act.descripcion}<br>
                Cupo máximo: ${act.cupoMaximo}<br>
                <button onclick="editarActividad(${index})">Editar</button>
                <button onclick="eliminarActividad(${index})">Eliminar</button>
            `;
            lista.appendChild(li);
        });
    } else {
        lista.innerHTML = "<li>No hay actividades registradas.</li>";
    }
    */
}

/*
function eliminarActividad(index) {
    let actividades = JSON.parse(localStorage.getItem("actividades")) || [];
    actividades.splice(index, 1);
    localStorage.setItem("actividades", JSON.stringify(actividades));
    mostrarListadoActividades();
    limpiarFormulario();
}

function editarActividad(index) {
    let actividades = JSON.parse(localStorage.getItem("actividades")) || [];
    const act = actividades[index];

    nombre.value = act.nombre;
    descripcion.value = act.descripcion;
    cupoMaximo.value = act.cupoMaximo;

    btnAceptar.dataset.editIndex = index; // guardamos el índice a editar
}
*/

// ELEMENTOS
let nombre = document.getElementById("nombre");
let descripcion = document.getElementById("descripcion");
let cupoMaximo = document.getElementById("cupoMaximo");
let btnAceptar = document.getElementById("agregar");

// GUARDAR / EDITAR ACTIVIDAD
btnAceptar.addEventListener("click", (e) => {
    e.preventDefault();
    resetMesajesError();

    let esValido = true;

    if (nombre.value === "") {
        mostrarMensajeError("nombreError", "Por favor ingrese el nombre.");
        esValido = false;
    }

    if (descripcion.value === "") {
        mostrarMensajeError("descripcionError", "Por favor ingrese una descripción.");
        esValido = false;
    }

    if ((cupoMaximo.value === "") || (cupoMaximo.value < 1) || (cupoMaximo.value > 100)) {
        mostrarMensajeError("cupoMaximoError", "El cupo debe estar entre 1 y 100.");
        esValido = false;
    }

    if (esValido) {
        let actividades = JSON.parse(localStorage.getItem("actividades")) || [];
        const nuevaActividad = {
            nombre: nombre.value,
            descripcion: descripcion.value,
            cupoMaximo: cupoMaximo.value
        };

        const editIndex = btnAceptar.dataset.editIndex;

        if (editIndex !== undefined && editIndex !== "") {
            // editar actividad existente
            actividades[editIndex] = nuevaActividad;
        } else {
            // agregar nueva actividad
            actividades.push(nuevaActividad);
        }

        localStorage.setItem("actividades", JSON.stringify(actividades));
        mostrarListadoActividades();
        limpiarFormulario();
    }
});

// LIMPIAR errores al escribir
[nombre, descripcion, cupoMaximo].forEach((input) => {
    input.addEventListener("input", () => {
        document.getElementById(input.id + "Error").textContent = "";
    });
});

// Mostrar lista al iniciar
document.addEventListener("DOMContentLoaded", mostrarListadoActividades);
