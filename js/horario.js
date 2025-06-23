document.addEventListener("DOMContentLoaded", () => {

    // Obtengo actividades del localStorage, para mostrar en el combo
    const actividades = JSON.parse(localStorage.getItem("actividades")) || [];

    const select = document.getElementById("actividad");

    actividades.forEach(actividad => {
        const option = document.createElement("option");
        // option.value = actividad.id;             // identificador único
        option.textContent = actividad.nombre; 
        select.appendChild(option);
    });

    // Obtengo el modo por medio del parámetro que recibe
    const params = new URLSearchParams(window.location.search);
    const modo = params.get("modo");

    const formulario = document.getElementById("formularioHorario");
    const listado = document.getElementById("listadoHorarios");
    const titulo = document.getElementById("titulo");

    const actividad = document.getElementById("actividad");
    const profesor = document.getElementById("profesor");
    const horario = document.getElementById("hora");
    const cupoMaximo = document.getElementById("cupoMaximo");

    const btnExportar = document.getElementById("exportarLocalStorage");
    const btnImportar = document.getElementById("importarLocalStorage");

    formulario.style.display = "none";
    listado.style.display = "block";
    btnExportar.style.visibility = "hidden";
    btnImportar.style.visibility = "hidden";

    // Muestro u oculto secciones según el modo
    switch (modo) {
        case "consultar":
            titulo.textContent = "Listado de Horarios";
            btnExportar.style.visibility = "visible";
            btnImportar.style.visibility = "visible";
            mostrarListadoHorarios();
            break
        
        case "agregar":
            formulario.style.display = "block";
            listado.style.display = "none";
            titulo.textContent = "Agregar Horario";              
            limpiarFormulario();
            break
        
        case "editar":
            titulo.textContent = "Modificar Horario";
            mostrarListadoHorarios("editar");
            break
        
        case "eliminar":
            titulo.textContent = "Eliminar Horario";
            mostrarListadoHorarios("eliminar");
            break
        
        default:
            mostrarListadoHorarios();
            break    
    }
    
    // Muestro el listado de horarios, con opción de editar o eliminar
    function mostrarListadoHorarios(modo = "consultar") {
        const encabezado = document.getElementById("encabezadoHorarios");
        const tabla = document.getElementById("horariosLista");

        // Limpio la tabla
        encabezado.innerHTML = "";
        tabla.innerHTML = "";

        // Creo el encabezado dinámicamente
        const filaEncabezado = document.createElement("tr");
        filaEncabezado.innerHTML = `
            <th>Actividad</th>
            <th>Profesor</th>
            <th>Cupo Max.</th>
            <th>Días</th>
            <th>Horario</th>
            ${modo !== "consultar" ? "<th></th>" : ""}
        `;
        
        // Obtengo datos
        const horarios = JSON.parse(localStorage.getItem("horarios")) || [];
        
        if (horarios.length > 0) {
            // agrego el encabezado de la tabla cuando sé que hay datos para mostrar
            encabezado.appendChild(filaEncabezado);

            horarios.forEach((horario, index) => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${horario.actividad}</td>                    
                    <td>${horario.profesor ?? "(Todos)"}</td>                        
                    <td id="cupo">${horario.cupoMaximo ?? ""}</td>
                    <td>${horario.dias}</td>
                    <td>${horario.horario}</td>
                `;

                // ?? es el operador de coalescencia nula: si lo de la izquierda es null o undefined, devuelve lo de la derecha

                if (modo !== "consultar") {
                    const celdaAccion = document.createElement("td");
                    const boton = document.createElement("button");
                    boton.className = "btnTabla";

                    if (modo === "editar") {
                        boton.innerHTML = `<img src="../assets/img/icono_editar.png" alt="Editar" class="iconoTabla">`; 
                        boton.addEventListener("click", () => editarHorario(index));
                    } else if (modo === "eliminar") {
                        boton.innerHTML = `<img src="../assets/img/icono_eliminar.png" alt="Eliminar" class="iconoTabla">`;
                        boton.addEventListener("click", () => eliminarHorario(index));
                    }

                    celdaAccion.appendChild(boton);
                    fila.appendChild(celdaAccion);
                }

                tabla.appendChild(fila);
            });
        } else {
            const fila = document.createElement("tr");
            fila.innerHTML = `<td colspan="${modo !== "consultar" ? 5 : 6}">No hay horarios registrados.</td>`;
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

    // Editar horario
    function editarHorario(index) {
        const horarios = JSON.parse(localStorage.getItem("horarios")) || [];
        const horario = horarios[index];
        
        // Muestro el formulario y lo lleno
        document.getElementById("formularioHorario").style.display = "block";
        document.getElementById("listadoHorarios").style.display = "none";

        // Seteo valores de los inputs
        document.getElementById("profesor").value = horario.profesor ?? "";     // el operador ?? (coalescencia nula) asigna "" solo si horario.profesor es null o undefined, en micaso, el <option> con valor vacío es el que representa “(Todos)” en el combo.
        document.getElementById("actividad").value = horario.actividad;
        document.getElementById("cupoMaximo").value = horario.cupoMaximo ?? "";
     
        // Cargo el horario correspondiente
        const selectHora = document.getElementById("hora");
        const opciones = Array.from(selectHora.options);
        const opcionEncontrada = opciones.find(opt => opt.text.trim() === horario.horario.trim());
        if (opcionEncontrada) {
            selectHora.value = opcionEncontrada.value;
        } else {
            selectHora.selectedIndex = 0;       // o null si querés deseleccionar
        }
            
        // Marco los días seleccionados
        const diasSeleccionados = horario.dias
            .split(",")
            .map(d => d.trim().toLowerCase());

        const checkboxes = document.querySelectorAll(".grillaDias input[type='checkbox']");
        checkboxes.forEach(chk => {
            chk.checked = diasSeleccionados.includes(chk.id.toLowerCase());
        });

       
        // Reemplazo el botón agregar por uno de guardar cambios
        const boton = document.getElementById("agregar");
        boton.textContent = "GUARDAR";
        boton.dataset.editIndex = index;        // guardo el índice a editar     
    }

    function eliminarHorario(index) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará el horario permanentemente.",
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
                const horarios = JSON.parse(localStorage.getItem("horarios")) || [];
                horarios.splice(index, 1);   // elimina 1 elemento
                localStorage.setItem("horarios", JSON.stringify(horarios));
                mostrarListadoHorarios("eliminar");

                Swal.fire({
                    title: 'Eliminada',
                    text: 'El horario ha sido eliminado.',
                    icon:'success',
                    confirmButtonColor: '#6edc8c',
                    confirmButtonText: 'Cerrar'
                });
                
            }
        });
    }

    
    // Limpia errores al escribir
    [actividad, cupoMaximo].forEach((input) => {
        input.addEventListener("input", () => {
            document.getElementById(input.id + "Error").textContent = "";
        });
    });

    // Borrar mensaje de error cuando se marca/desmarca un día
    const checkboxDias = document.querySelectorAll(".grillaDias input[type='checkbox']");
    checkboxDias.forEach((chk) => {
        chk.addEventListener("change", () => {
            document.getElementById("diasError").textContent = "";
        });
    });

    // Borrar mensaje de error cuando cambia el horario
    horario.addEventListener("change", () => {
        document.getElementById("horarioError").textContent = "";
    });




    let btnAceptar = document.getElementById("agregar");
    let btnCancelar = document.getElementById("cancelar");

    btnCancelar.addEventListener("click", () => {
        if (modo === "agregar") {
            window.location.href = "../pages/administrar.html";
        } else if (modo === "editar") {
            window.location.href = "./horario.html?modo=editar";
        } else {
            window.location.href = "./horario.html?modo=consultar";
        }
    });

    //Agregar / Editar Horario
    btnAceptar.addEventListener("click", (e) => {
        e.preventDefault();
        resetMesajesError();
        
        // obtengo los días seleccionados 
        const checkboxDias = document.querySelectorAll(".grillaDias input[type='checkbox']");
        // convierte la lista de nodos en un array real
        const diasSeleccionados = Array.from(checkboxDias)                    
            .filter(chk => chk.checked)     // se queda con los check marcados
            .map(chk => chk.id);            // toma el atributo id de todos los marcados


        let esValido = true;

        if (actividad.value === "") {
            mostrarMensajeError("actividadError", "Por favor seleccione una actividad.");
            esValido = false;
        }

        if (diasSeleccionados.length === 0) {
            mostrarMensajeError("diasError", "Debe seleccionar al menos un día.");
            esValido = false;
        }

        if (horario.value === "") {
            mostrarMensajeError("horarioError", "Por favor seleccione un horario.");
            esValido = false;
        }

        // el cupo máximo es opcional, pero si se completa, validar el rango
        if (cupoMaximo.value !== "") {
            const valor = parseInt(cupoMaximo.value);
            if (isNaN(valor) || valor < 1 || valor > 100) {
                mostrarMensajeError("cupoMaximoError", "El cupo debe estar entre 1 y 100.");
                esValido = false;
            }
        }
            

        if (esValido) {
            let horarios = JSON.parse(localStorage.getItem("horarios")) || [];
                        
            const nuevoHorario = {
                profesor: profesor.value || null,
                actividad: actividad.options[actividad.selectedIndex].text,                    
                cupoMaximo: cupoMaximo.value !== "" ? parseInt(cupoMaximo.value) : null,
                dias: diasSeleccionados.join(", "),         // guarda "lunes, miércoles, viernes"
                horario: horario.options[horario.selectedIndex].text
            };

            const editIndex = btnAceptar.dataset.editIndex;
            
            if (editIndex !== undefined && editIndex !== "") {
                // editar horario existente
                horarios[editIndex] = nuevoHorario;
            } else {
                // agregar nuevo horario
                horarios.push(nuevoHorario);
            }
            
            localStorage.setItem("horarios", JSON.stringify(horarios));

            // Armo texto para usar en swal fire, identificando el agregar del modificar
            const esEdicion = editIndex !== undefined && editIndex !== "";  // si estoy en el alta, el atributo data-edit-index está vacío o undefined; cuando edito, se le asigna un número
            const textoSwal = esEdicion
                ? 'El horario ha sido actualizado.'
                : 'El horario ha sido creado.';

            Swal.fire({
                title: '¡Operación Exitosa!',
                text: textoSwal,             //'El horario ha sido creado.',
                imageUrl: '../assets/img/exito.png', 
                imageHeight: 100,
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
                        window.location.href = './horario.html?modo=editar';
                    } else {
                        window.location.href = './horario.html?modo=consultar';
                    }
                }
            });
            
            limpiarFormulario();
            
            btnAceptar.dataset.editIndex = "";          // limpio el índice
        }
    });


    // Limpio campos    
    function limpiarFormulario() {
        // Campos de entrada
        document.getElementById("profesor").value = "";
        document.getElementById("actividad").value = "";
        document.getElementById("cupoMaximo").value = "";
        document.getElementById("hora").value = "";

        // Mensajes de error        
        document.getElementById("actividadError").textContent = "";
        document.getElementById("cupoMaximoError").textContent = "";
        document.getElementById("diasError").textContent = "";
        document.getElementById("horarioError").textContent = "";

        // Deseleccionar checkboxes de días
        const checkboxes = document.querySelectorAll(".grillaDias input[type='checkbox']");
        checkboxes.forEach(chk => chk.checked = false);
    }





})


/* control para q elija al menos 1 día
const form = document.getElementById("formulario");
const diasError = document.getElementById("diasError");

form.addEventListener("submit", function (e) {
    const checkboxes = document.querySelectorAll('input[name="dias"]:checked');
    if (checkboxes.length === 0) {
    e.preventDefault(); // Detiene el envío del formulario
    errorDias.style.display = "block";
    } else {
    errorDias.style.display = "none";
    }
});
*/





// Exportar localStorage a un archivo JSON
function exportarLocalStorage() {
    const datos = localStorage.getItem("horarios") || "[]";
    const blob = new Blob([datos], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "horarios_backup.json";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}

// Importar un archivo JSON a localStorage
function importarLocalStorage() {
    Swal.fire({
        title: 'Importar horarios',
        html: `
            <input type="file" id="inputArchivoImportar" accept=".json" class="swal2-file">
            <label class="advertencia">Seleccione un archivo JSON con los horarios exportados.</label>
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

                        localStorage.setItem("horarios", JSON.stringify(datos));
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


