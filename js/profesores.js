// FUNCIONES MOVIDAS FUERA PARA USO GLOBAL

function eliminarProfesor(index) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará el profesor/a permanentemente.",
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
            const profesores = JSON.parse(localStorage.getItem("profesores")) || [];
            profesores.splice(index, 1);
            localStorage.setItem("profesores", JSON.stringify(profesores));

            const tabla = document.getElementById("profesoresLista");
            tabla.deleteRow(index);

            Swal.fire({
                title: 'Eliminado',
                text: 'El profesor ha sido eliminado.',
                icon: 'success',
                confirmButtonColor: '#6edc8c',
                confirmButtonText: 'Cerrar'
            });
        }
    });
}

function editarProfesor(index) {
    const profesores = JSON.parse(localStorage.getItem("profesores")) || [];
    const profesor = profesores[index];

    document.getElementById("formularioProfesores").style.display = "block";
    document.getElementById("listadoProfesores").style.display = "none";

    document.getElementById("nombre").value = profesor.nombre;
    document.getElementById("apellido").value = profesor.apellido;
    document.getElementById("documento").value = profesor.documento;
    document.getElementById("titulo").value = profesor.titulo;
    document.getElementById("cuil").value = profesor.cuil;

    const boton = document.getElementById("agregar");
    boton.textContent = "GUARDAR";
    boton.dataset.editIndex = index;
}

    document.addEventListener("DOMContentLoaded", function () {
    // 🧹 Limpiar localStorage si hay profesores sin campo 'titulo'
    const profesoresGuardados = JSON.parse(localStorage.getItem("profesores")) || [];
    const hayErrores = profesoresGuardados.some(prof => !prof.titulo || prof.titulo === "undefined");

    if (hayErrores) {
        console.warn("Se detectaron profesores sin campo 'titulo'. Se limpiará el localStorage.");
        localStorage.removeItem("profesores");
    }

    // Obtengo el modo desde la URL
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo");

    const formulario = document.getElementById("formularioProfesores");
    const listado = document.getElementById("listadoProfesores");
    const btnAgregar = document.getElementById("agregar");

    // Muestro u oculto secciones según el modo
    switch (modo) {
        case "consultar":
            formulario.style.display = "none";
            listado.style.display = "block";
            document.getElementById("tituloPagina").textContent = "Listado de Profesores";
            mostrarListadoProfesores();
            break;

        case "agregar":
            formulario.style.display = "block";
            listado.style.display = "none";
            document.getElementById("tituloPagina").textContent = "Agregar Profesor";
            limpiarFormulario();
            break;

        case "editar":
            formulario.style.display = "none";
            listado.style.display = "block";
            document.getElementById("tituloPagina").textContent = "Modificar Profesor";
            mostrarListadoProfesores("editar");
            break;

        case "eliminar":
            formulario.style.display = "none";
            listado.style.display = "block";
            document.getElementById("tituloPagina").textContent = "Eliminar Profesor";
            mostrarListadoProfesores("eliminar");
            break;

        default:
            formulario.style.display = "none";
            listado.style.display = "block";
            mostrarListadoProfesores();
            break;
    }

    // Editar profesor
    function editarProfesor(index) {
        const profesores = JSON.parse(localStorage.getItem("profesores")) || [];
        const profesor = profesores[index];

        // Muestro el formulario y lo lleno
        document.getElementById("formularioProfesores").style.display = "block";
        document.getElementById("listadoProfesores").style.display = "none";

        document.getElementById("nombre").value = profesor.nombre;
        document.getElementById("apellido").value = profesor.apellido;
        document.getElementById("documento").value = profesor.documento;
        document.getElementById("titulo").value = profesor.titulo;
        document.getElementById("cuil").value = profesor.cuil;

        // Reemplazo el botón agregar por uno de guardar cambios
        const boton = document.getElementById("agregar");
        boton.textContent = "GUARDAR";
        boton.onclick = function () {
            profesor.nombre = document.getElementById("nombre").value;
            profesor.apellido = document.getElementById("apellido").value;
            profesor.documento = document.getElementById("documento").value;
            profesor.titulo = document.getElementById("titulo").value;
            profesor.cuil = document.getElementById("cuil").value;

            profesores[index] = profesor;
            localStorage.setItem("profesores", JSON.stringify(profesores));

            mostrarListadoProfesores("editar");

            document.getElementById("formularioProfesores").style.display = "none";
            document.getElementById("listadoProfesores").style.display = "block";

            boton.textContent = "AGREGAR";

            boton.onclick = agregarProfesor;  
        };
    }

    // Limpio campos
    function limpiarFormulario() {
        document.getElementById("nombre").value = "";
        document.getElementById("apellido").value = "";
        document.getElementById("documento").value = "";
        document.getElementById("titulo").value = "";
        document.getElementById("cuil").value = "";

        document.getElementById("nombreError").textContent = "";
        document.getElementById("apellidoError").textContent = "";
        document.getElementById("documentoError").textContent = "";
        document.getElementById("tituloError").textContent = "";
        document.getElementById("cuilError").textContent = "";
    }

// });

// ELEMENTOS
let nombre = document.getElementById("nombre");
let apellido = document.getElementById("apellido");
let documento = document.getElementById("documento");
let titulo = document.getElementById("titulo"); 
let cuil = document.getElementById("cuil");
let imagen = document.getElementById("imagen");

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


let btnAceptar = document.getElementById("agregar");

//Agregar / Editar Profesor
btnAceptar.addEventListener("click", (e) => {
    e.preventDefault();
    resetMesajesError();

    const editIndex = btnAceptar.dataset.editIndex !== undefined
                    ? Number(btnAceptar.dataset.editIndex)
                    : null;

    let esValido = true;

    if (nombre.value === "") {
        mostrarMensajeError("nombreError", "Por favor ingrese el nombre.");
        esValido = false;
    }

    if (apellido.value === "") {
        mostrarMensajeError("apellidoError", "Por favor ingrese el apellido.");
        esValido = false;
    }

    function validarDNI(documento) {
      const regex = /^\d{8}$/;  
      return regex.test(documento);
    }

    function existeDNI(documentoNuevo, indiceAExcluir = null) {
         const profesores = JSON.parse(localStorage.getItem("profesores")) || [];

        return profesores.some((prof, idx) =>
            prof.documento === documentoNuevo && idx !== indiceAExcluir
        );
    }

    if (!validarDNI(documento.value)) {
        mostrarMensajeError("documentoError", "El documento ingresado es incorrecto.");
        esValido = false;
        // ——— 2. pasamos el índice a excluir ———
    } else if (existeDNI(documento.value, editIndex)) {
        mostrarMensajeError("documentoError", "Ya existe un usuario con ese documento.");
        esValido = false;
    }

    function validarCUIL(cuil) {
      const regex = /^\d{11}$/;  
      console.log(cuil);
      return regex.test(cuil);
    }

    if (!validarCUIL(cuil.value))  {
        mostrarMensajeError("cuilError", "El CUIL/CUIT ingresado es incorrecto.");
        esValido = false;
    }

    if (esValido) {
        let profesores = JSON.parse(localStorage.getItem("profesores")) || [];
        const archivoImagen = imagen.files[0];
        const nombreImagen = archivoImagen ? archivoImagen.name : null;
        const rutaImagen = nombreImagen ? `../assets/img/${nombreImagen}` : null;

        const nuevoProfesor = {
            nombre: nombre.value,
            apellido: apellido.value,
            documento: documento.value,
            titulo: titulo.value,
            cuil: cuil.value,
            imagen: rutaImagen,
        };

        const editIndex = btnAceptar.dataset.editIndex;

        if (editIndex !== undefined && editIndex !== "") {
            // editar profesor existente
            profesores[editIndex] = nuevoProfesor;
        } else {
            // agregar nuevo profesor
            profesores.push(nuevoProfesor);
        }

        localStorage.setItem("profesores", JSON.stringify(profesores));
  
        Swal.fire({
            title: '¡Operación Exitosa!',
            text: 'El profesor/a ha sido agregado/a.',
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
                window.location.href = './profesores.html?modo=consultar';
            }
        });

        limpiarFormulario();
    }
});

// LIMPIAR errores al escribir
[nombre,apellido, documento, titulo, cuil].forEach((input) => {
    input.addEventListener("input", () => {
        document.getElementById(input.id + "Error").textContent = "";
    });
});

// Muestro el listado de profesores, con opción de editar o eliminar
function mostrarListadoProfesores(modo= "consultar") {
    const encabezado = document.getElementById("encabezadoProfesores")
    const tabla  = document.getElementById("profesoresLista");
    
    // Limpio la tabla
    encabezado.innerHTML = "";
    tabla.innerHTML = "";

    // Creo el encabezado dinámicamente
    const filaEncabezado = document.createElement("tr");

    filaEncabezado.innerHTML = `
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Documento</th>
        <th>Título</th>
        <th>CUIL</th>
        <th>Imagen</th>
        ${modo !== "consultar" ? "<th>Acción</th>" : ""}
    `;

    encabezado.appendChild(filaEncabezado);

    // Obtengo datos
    const profesores = JSON.parse(localStorage.getItem("profesores")) || [];

    if (profesores.length > 0) {
        profesores.forEach((profesor, index) => {
            const fila = document.createElement("tr");

            let accion = "";
            if (modo === "editar") {
                accion = `<button class="btnTabla" onclick="editarProfesor(${index})"><img src="../assets/img/icono_editar.png" alt="Editar" class="iconoTabla"></button>`;
            } else if (modo === "eliminar") {
                accion = `<button class="btnTabla" onclick="eliminarProfesor(${index})"><img src="../assets/img/icono_eliminar.png" alt="Eliminar" class="iconoTabla"></button>`;
            }

            fila.innerHTML = `
                                <td>${profesor.nombre}</td>
                                <td>${profesor.apellido}</td>
                                <td>${profesor.documento}</td>
                                <td>${profesor.titulo}</td>
                                <td>${profesor.cuil}</td>
                                <td><img src="${profesor.imagen || '../assets/img/icono_pesas.png'}" style="width: 80px; height: auto;"></td>
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

});
