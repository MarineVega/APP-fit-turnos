document.addEventListener("DOMContentLoaded", () => {

    // Obtengo actividades del localStorage, para mostrar en el combo
    const actividades = JSON.parse(localStorage.getItem("actividades")) || [];

    const select = document.getElementById("actividades");

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

    const btnExportar = document.getElementById("exportarLocalStorage");
    const btnImportar = document.getElementById("importarLocalStorage");

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