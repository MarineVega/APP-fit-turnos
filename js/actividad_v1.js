function mostrarMensajeError(elementId, mensaje) {
    var errorElemento = document.getElementById(elementId);    
    errorElemento.innerText = mensaje;
}

function resetMesajesError(){
    // levanto todos los elementos que tengan la clase mensaje-error
    let errorElementos = document.querySelectorAll('.mensaje-error');
    errorElementos.forEach(function(elemento) {
        elemento.innerText = "";
    });
}

let nombre = document.getElementById("nombre");
let descripcion = document.getElementById("descripcion");
let cupoMaximo = document.getElementById("cupoMaximo");

let btnAceptar = document.getElementById("agregar");

//let infoActividad = [];

btnAceptar.addEventListener("click", (e) => {
    //previene la acción del form de actualizar la página
    e.preventDefault();
    // Reseteo los mensajes de error
    resetMesajesError();
    
    let esValido = true;

    // Valido los campos
    if (nombre.value === "") {
        mostrarMensajeError("nombreError", "Por favor ingrese el nombre de la actividad.");        
        esValido = false;
    }

    if (descripcion.value === "") {
        mostrarMensajeError("descripcionError", "Por favor ingrese una descripción de la actividad.");
        esValido = false;
    }

    /* ver si esos cupos pueden enviarse como variables globales */
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

        // Recupera las actividades previas (o crea una lista vacía)
        let actividades = JSON.parse(localStorage.getItem("actividades")) || [];

        // Agrega la nueva actividad
        actividades.push(actividad);

        // Guarda el array actualizado
        localStorage.setItem("actividades", JSON.stringify(actividades));

        // Redirige a la página de inicio -->  Mostrar mensaje de éxito */
        window.location.href = "../index.html";
    }
   
    /* Borrar errores al hacer clic en los inputs */
    nombre.addEventListener("focus", () => {
    document.getElementById("nombreError").textContent = "";
    });

    descripcion.addEventListener("focus", () => {
        document.getElementById("descripcionError").textContent = "";
    });

    cupoMaximo.addEventListener("focus", () => {
        document.getElementById("cupoMaximoError").textContent = "";
    });

});

