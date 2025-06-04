function mostrarMensajeError(elementId, mensaje) {
    document.getElementById(elementId).innerText = mensaje;
}

function resetMesajesError() {
    document.querySelectorAll('.mensaje-error').forEach((elemento) => {
        elemento.innerText = "";
    });
}

function mostrarListadoActividades() {
    const lista = document.getElementById("actividadesLista");
    const contenedor = document.getElementById("listadoActividades");
    lista.innerHTML = ""; // limpio la lista

    const actividades = JSON.parse(localStorage.getItem("actividades")) || [];

    if (actividades.length > 0) {
        contenedor.style.display = "block";

        actividades.forEach((act) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${act.nombre}</strong><br>
                ${act.descripcion}<br>
                Cupo máximo: ${act.cupoMaximo}
            `;
            lista.appendChild(li);
        });

        // Oculto el formulario
        document.querySelector(".formActividad").style.display = "none";
        document.getElementById("agregar").style.display = "none";
    }
}

// Elementos
let nombre = document.getElementById("nombre");
let descripcion = document.getElementById("descripcion");
let cupoMaximo = document.getElementById("cupoMaximo");
let btnAceptar = document.getElementById("agregar");

btnAceptar.addEventListener("click", (e) => {
    e.preventDefault();
    resetMesajesError();

    let esValido = true;

    if (nombre.value === "") {
        mostrarMensajeError("nombreError", "Por favor ingrese el nombre de la actividad.");
        esValido = false;
    }

    if (descripcion.value === "") {
        mostrarMensajeError("descripcionError", "Por favor ingrese una descripción de la actividad.");
        esValido = false;
    }

    if ((cupoMaximo.value === "") || (cupoMaximo.value < 1) || (cupoMaximo.value > 100)) {
        mostrarMensajeError("cupoMaximoError", "El cupo máximo debe estar entre 1 y 100.");
        esValido = false;
    }

    if (esValido) {
        const actividad = {
            nombre: nombre.value,
            descripcion: descripcion.value,
            cupoMaximo: cupoMaximo.value
        };

        let actividades = JSON.parse(localStorage.getItem("actividades")) || [];
        actividades.push(actividad);
        localStorage.setItem("actividades", JSON.stringify(actividades));

        mostrarListadoActividades(); // mostrar listado actualizado
    }
});

// Limpieza de errores al escribir
[nombre, descripcion, cupoMaximo].forEach((input) => {
    input.addEventListener("input", () => {
        document.getElementById(input.id + "Error").textContent = "";
    });
});

// Mostrar listado si ya hay actividades al cargar la página
document.addEventListener("DOMContentLoaded", mostrarListadoActividades);
