// document.addEventListener("DOMContentLoaded", () => {
    // Obtengo el modo por medio del parámetro que recibe
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo");

    const formulario = document.getElementById("formularioActividad");
    const listado = document.getElementById("listadoActividades");
    const titulo = document.getElementById("titulo");
    const btnAgregar = document.getElementById("agregar");

    // Muestro u oculto secciones según el modo
    switch (modo) {
        case "consultar":
            formulario.style.display = "none";
            listado.style.display = "block";
            titulo.textContent = "Listado de Actividades";
            mostrarListadoActividades();
            break
        
        case "agregar":
            formulario.style.display = "block";
            listado.style.display = "none";
            titulo.textContent = "Agregar Actividad";
            limpiarFormulario();
            break
        
         case "editar":
            formulario.style.display = "none";
            listado.style.display = "block";
            titulo.textContent = "Modificar Actividad";
            mostrarListadoActividades("editar");
            break
        
         case "eliminar":
            formulario.style.display = "none";
            listado.style.display = "block";
            titulo.textContent = "Eliminar Actividad";
            mostrarListadoActividades("eliminar");
            break
        
        default:
            formulario.style.display = "none";
            listado.style.display = "block";
            mostrarListadoActividades();
            break    
    }

    


    function eliminarActividad(index) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará la actividad permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#6edc8c',                        
            customClass: {
                cancelButton: 'btnAceptar'
            },
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const actividades = JSON.parse(localStorage.getItem("actividades")) || [];
                actividades.splice(index, 1);   // elimina 1 elemento
                localStorage.setItem("actividades", JSON.stringify(actividades));
                mostrarListadoActividades("eliminar");

                Swal.fire({
                    title: 'Eliminada',
                    text: 'La actividad ha sido eliminada.',
                    icon:'success',
                    confirmButtonColor: '#6edc8c',
                    confirmButtonText: 'Cerrar'
                });
               
            }
        });
    }



    // Editar actividad
    function editarActividad(index) {
        const actividades = JSON.parse(localStorage.getItem("actividades")) || [];
        const actividad = actividades[index];

        // Muestro el formulario y lo lleno
        document.getElementById("formularioActividad").style.display = "block";
        document.getElementById("listadoActividades").style.display = "none";

        document.getElementById("nombre").value = actividad.nombre;
        document.getElementById("descripcion").value = actividad.descripcion;
        document.getElementById("cupoMaximo").value = actividad.cupoMaximo;

        // Reemplazo el botón agregar por uno de guardar cambios
        const boton = document.getElementById("agregar");
        boton.textContent = "GUARDAR";
        boton.onclick = function () {
            actividad.nombre = document.getElementById("nombre").value;
            actividad.descripcion = document.getElementById("descripcion").value;
            actividad.cupoMaximo = document.getElementById("cupoMaximo").value;

            actividades[index] = actividad;
            localStorage.setItem("actividades", JSON.stringify(actividades));

            mostrarListadoActividades("editar");

            document.getElementById("formularioActividad").style.display = "none";
            document.getElementById("listadoActividades").style.display = "block";

            boton.textContent = "AGREGAR";

            boton.onclick = agregarActividad;   // Restauro acción original
        };
    }

    // Limpio campos
    function limpiarFormulario() {
        document.getElementById("nombre").value = "";
        document.getElementById("descripcion").value = "";
        document.getElementById("cupoMaximo").value = "";
        // imagen.value = "";
        // vistaPrevia.src = "";
       // vistaPrevia.style.display = "none";


        document.getElementById("nombreError").textContent = "";
        document.getElementById("descripcionError").textContent = "";
        document.getElementById("cupoMaximoError").textContent = "";
    }

// });


/* OJO!!!!!! CONTROLAR*/

// ELEMENTOS
let nombre = document.getElementById("nombre");
let descripcion = document.getElementById("descripcion");
let cupoMaximo = document.getElementById("cupoMaximo");
let imagen = document.getElementById("imagen");

/* INICIO 11-06-25 */
const vistaPrevia = document.getElementById("vistaPrevia");

imagen.addEventListener("change", () => {
    const archivo = imagen.files[0];
    if (archivo) {
        const urlTemporal = URL.createObjectURL(archivo);
        vistaPrevia.src = urlTemporal;
        vistaPrevia.style.display = "block";
    } else {
        vistaPrevia.style.display = "none";
    }
});
/* FIN 11-06-25 */

let btnAceptar = document.getElementById("agregar");


//Agregar / Editar Actividad
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
        
        /* INICIO 11-06-25 */
        const archivoImagen = imagen.files[0];
        const nombreImagen = archivoImagen ? archivoImagen.name : null;
        const rutaImagen = nombreImagen ? `../assets/img/${nombreImagen}` : null;
        /* FIN 11-06-25 */
        
        const nuevaActividad = {
            nombre: nombre.value,
            descripcion: descripcion.value,
            cupoMaximo: cupoMaximo.value,
            // imagen: imagen.value,
            imagen: rutaImagen,
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
  
        Swal.fire({
            title: '¡Operación Exitosa!',
            text: 'La actividad ha sido creada.',
            imageUrl: '../assets/img/exito.png', 
            imageHeight: 100,
            imageAlt: 'Éxito',
            icon: 'success',
            confirmButtonText: 'Consultar',
            customClass: {
                confirmButton: 'btnAceptar' 
            },
            buttonsStyling: false 
            }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = './actividad.html?modo=consultar';
            }
        });

        limpiarFormulario();
    }
});

// LIMPIAR errores al escribir
[nombre, descripcion, cupoMaximo].forEach((input) => {
    input.addEventListener("input", () => {
        document.getElementById(input.id + "Error").textContent = "";
    });
});


// Muestro el listado de actividades, con opción de editar o eliminar
function mostrarListadoActividades(modo= "consultar") {
    const encabezado = document.getElementById("encabezadoActividades")
    const tabla  = document.getElementById("actividadesLista");
    
    // Limpio la tabla
    encabezado.innerHTML = "";
    tabla.innerHTML = "";

    // Creo el encabezado dinámicamente
    const filaEncabezado = document.createElement("tr");

    filaEncabezado.innerHTML = `
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Cupo Máximo</th>
        <th>Imagen</th>
        ${modo !== "consultar" ? "<th>Acción</th>" : ""}
    `;

    encabezado.appendChild(filaEncabezado);

    // Obtengo datos
    const actividades = JSON.parse(localStorage.getItem("actividades")) || [];
    
    if (actividades.length > 0) {
        actividades.forEach((actividad, index) => {
            const fila = document.createElement("tr");

            let accion = "";
            if (modo === "editar") {
                accion = `<button class="btnTabla" onclick="editarActividad(${index})"><img src="../assets/img/icono_editar.png" alt="Editar" class="iconoTabla"></button>`;
            } else if (modo === "eliminar") {
                accion = `<button class="btnTabla" onclick="eliminarActividad(${index})"><img src="../assets/img/icono_eliminar.png" alt="Eliminar" class="iconoTabla"></button>`;
            }

            fila.innerHTML = `
                <td>${actividad.nombre}</td>
                <td>${actividad.descripcion}</td>
                <td id="cupo">${actividad.cupoMaximo}</td>
                <td id="imagen"><img src=${actividad.imagen|| '../assets/img/icono_pesas.png'} style="width: 80px; height: auto;"></td>
                    ${modo !== "consultar" ? `<td>${accion}</td>` : ""}                   
            `;
            tabla.appendChild(fila);
        });
    } else {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td colspan="${modo !== "consultar" ? 5 : 4}">No hay actividades registradas.</td>`;
        tabla.appendChild(fila);
    }
}

function mostrarMensajeError(elementId, mensaje) {
    document.getElementById(elementId).innerText = mensaje;
}

function resetMesajesError() {
    document.querySelectorAll('.mensaje-error').forEach((elemento) => {
        elemento.innerText = "";
    });
}

