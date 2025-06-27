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
    

    // Obtengo el modo por medio del parámetro que recibe
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo");

    const formulario = document.getElementById("formularioActividad");
    const listado = document.getElementById("listadoActividades");
    const titulo = document.getElementById("titulo");
    const imagen = document.getElementById("imagen");
    const btnAgregar = document.getElementById("agregar");
    const btnExportar = document.getElementById("exportarLocalStorage");
    const btnImportar = document.getElementById("importarLocalStorage");

    formulario.style.display = "none";
    listado.style.display = "block";
    btnExportar.style.visibility = "hidden";
    btnImportar.style.visibility = "hidden";
    
    // Muestro u oculto secciones según el modo
    switch (modo) {
        case "consultar":
            titulo.textContent = "Listado de Actividades";
            btnExportar.style.visibility = "visible";
            btnImportar.style.visibility = "visible";
            mostrarListadoActividades();
            break
        
        case "agregar":
            formulario.style.display = "block";
            listado.style.display = "none";
            titulo.textContent = "Agregar Actividad";
            limpiarFormulario();
            break
        
        case "editar":
            titulo.textContent = "Modificar Actividad";
            mostrarListadoActividades("editar");
            break
        
        case "eliminar":
            titulo.textContent = "Eliminar Actividad";
            mostrarListadoActividades("eliminar");
            break
        
        default:
            mostrarListadoActividades();
            break    
    }
    

    function eliminarActividad(index) {
        swalEstilo.fire({
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

                swalEstilo.fire({
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

        // Mostrar imagen previa si hay
        const vistaPrevia = document.getElementById("vistaPrevia");
        
        if (actividad.imagen) {
            vistaPrevia.src = actividad.imagen;
            vistaPrevia.style.display = "block";
            btnAgregar.dataset.imagenOriginal = actividad.imagen;   // guardo la imagen actual en un data-atributo del botón Guardar
        } else {
            vistaPrevia.style.display = "none";
            //imagen.textContent = "";
            imagen.value = "";
            btnAgregar.dataset.imagenOriginal = "";     // no tenía imagen
        };

        // Reemplazo el botón agregar por uno de guardar cambios
        const boton = document.getElementById("agregar");
        boton.textContent = "GUARDAR";

        boton.dataset.editIndex = index;        // guardo el índice a editar     
    }

    // Limpio campos
    function limpiarFormulario() {
        document.getElementById("nombre").value = "";
        document.getElementById("descripcion").value = "";
        document.getElementById("cupoMaximo").value = "";

        document.getElementById("nombreError").textContent = "";
        document.getElementById("descripcionError").textContent = "";
        document.getElementById("cupoMaximoError").textContent = "";
    }

    let btnAceptar = document.getElementById("agregar");

    let btnCancelar = document.getElementById("cancelar");

    btnCancelar.addEventListener("click", () => {
        if (modo === "agregar") {
            window.location.href = "../pages/administrar.html";
        } else if (modo === "editar") {
            window.location.href = "./actividad.html?modo=editar";
        } else {
            window.location.href = "./actividad.html?modo=consultar";
        }
    });

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

        // Valido que no se ingrese un nombre de actividad existente
        const nombreIngresado = nombre.value.trim().toLowerCase();      // normalizo el texto ingresado (quito espacios y lo paso a minúscula)
        const editIndex = btnAceptar.dataset.editIndex;
        const actividades = JSON.parse(localStorage.getItem("actividades")) || [];

        const nombreDuplicado = actividades.some((act, i) =>            // recorro todas las actividades y busco si hay otra con el mismo nombre
            act.nombre.trim().toLowerCase() === nombreIngresado &&
            i != editIndex          // permito el mismo nombre si estoy editando ese mismo elemento (misma posicion en el array)
        );

        if (nombreDuplicado) {
            mostrarMensajeError("nombreError", "Ya existe una actividad con ese nombre.");
            return;         // cancela el guardado
        }
        


        if (esValido) {
            let actividades = JSON.parse(localStorage.getItem("actividades")) || [];
                        
            const archivoImagen = document.getElementById("imagen").files[0];              
            
            let rutaImagen;

            if (archivoImagen) {
                const nombreImagen = archivoImagen.name;
                rutaImagen = `../assets/img/${nombreImagen}`;
            } else {
                //  Si no seleccionó nueva imagen, usar la que estaba
                rutaImagen = btnAgregar.dataset.imagenOriginal || null;
            }
            
            const nuevaActividad = {
                nombre: nombre.value,
                descripcion: descripcion.value,
                cupoMaximo: cupoMaximo.value,
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

            // Armo texto para usar en swal fire, identificando el agregar del modificar
            const esEdicion = editIndex !== undefined && editIndex !== "";  // si estoy en el alta, el atributo data-edit-index está vacío o undefined; cuando edito, se le asigna un número
            const textoSwal = esEdicion
                ? 'La actividad ha sido actualizada.'
                : 'La actividad ha sido creada.';

            swalEstilo.fire({
                title: '¡Operación Exitosa!',
                text: textoSwal,            //'La actividad ha sido creada.',
                imageUrl: '../assets/img/exito.png',                 
                imageAlt: 'Éxito',
                icon: 'success',
                confirmButtonText: 'Volver',
                customClass: {
                    confirmButton: 'btnAceptar' 
                },
                buttonsStyling: false 
            }).then((result) => {
                if (result.isConfirmed) {
                    if (modo === "editar") {
                        window.location.href = './actividad.html?modo=editar';
                    } else {
                        window.location.href = './actividad.html?modo=consultar';
                    }
                }
            });
            
            limpiarFormulario();
            
            btnAgregar.dataset.editIndex = "";          // limpio el índice
            btnAgregar.dataset.imagenOriginal = "";

        }
    });
        
    // Limpia errores al escribir
    [nombre, descripcion, cupoMaximo].forEach((input) => {
        input.addEventListener("input", () => {
            document.getElementById(input.id + "Error").textContent = "";
        });
    });

    // Muestro la nueva imagen de la actividad, luego de elegirla, no se guarda, solo la muestra temporalmente
    document.getElementById("imagen").addEventListener("change", function () {
    const archivo = this.files[0];
    const vistaPrevia = document.getElementById("vistaPrevia");

    if (archivo) {
        const lector = new FileReader();
        lector.onload = function (e) {
            vistaPrevia.src = e.target.result;
            vistaPrevia.style.display = "block";
        };
        lector.readAsDataURL(archivo);
    } else {
        vistaPrevia.src = "";
        vistaPrevia.style.display = "none";
    }
    });
   
          
    // Muestro el listado de actividades, con opción de editar o eliminar
    function mostrarListadoActividades(modo = "consultar") {
        const encabezado = document.getElementById("encabezadoActividades");
        const tabla = document.getElementById("actividadesLista");

        // Limpio la tabla
        encabezado.innerHTML = "";
        tabla.innerHTML = "";

        // Creo el encabezado dinámicamente
        const filaEncabezado = document.createElement("tr");
        filaEncabezado.innerHTML = `
            <th>Nombre</th>
            <th>Detalle</th>
            <th>Cupo Max.</th>
            <th>Imagen</th>
            ${modo !== "consultar" ? "<th></th>" : ""}
        `;
        
        // Obtengo datos
        const actividades = JSON.parse(localStorage.getItem("actividades")) || [];
        
        if (actividades.length > 0) {
            // agrego el encabezado de la tabla cuando sé que hay datos para mostrar
            encabezado.appendChild(filaEncabezado);

            actividades.forEach((actividad, index) => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${actividad.nombre}</td>
                    <td>${actividad.descripcion}</td>
                    <td id="cupo">${actividad.cupoMaximo}</td>
                    <td id="imagen"><img src="${actividad.imagen || '../assets/img/icono_default.png'}"></td>
                `;

                if (modo !== "consultar") {
                    const celdaAccion = document.createElement("td");
                    const boton = document.createElement("button");
                    boton.className = "btnTabla";

                    if (modo === "editar") {
                        boton.innerHTML = `<img src="../assets/img/icono_editar.png" alt="Editar" class="iconoTabla">`; 
                        boton.addEventListener("click", () => editarActividad(index));
                    } else if (modo === "eliminar") {
                        boton.innerHTML = `<img src="../assets/img/icono_eliminar.png" alt="Eliminar" class="iconoTabla">`;
                        boton.addEventListener("click", () => eliminarActividad(index));
                    }

                    celdaAccion.appendChild(boton);
                    fila.appendChild(celdaAccion);
                }

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


// Exportar localStorage a un archivo JSON
function exportarLocalStorage() {
    const datos = localStorage.getItem("actividades") || "[]";
    const blob = new Blob([datos], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "actividades_backup.json";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}

// Importar un archivo JSON a localStorage
function importarLocalStorage() {
    Swal.fire({
        title: 'Importar actividades',
        html: `
            <input type="file" id="inputArchivoImportar" accept=".json" class="swal2-file">
            <label class="advertencia">Seleccione un archivo JSON con las actividades exportadas.</label>
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

                        localStorage.setItem("actividades", JSON.stringify(datos));
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
            Swal.fire('¡Importado!', 'Las actividades fueron cargadas correctamente.', 'success')
                .then(() => {
                    location.reload();
                });
        }
    });
}

