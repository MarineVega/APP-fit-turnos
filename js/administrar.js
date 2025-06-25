document.addEventListener("DOMContentLoaded", () => {
    const btnConsultar = document.getElementById("btnConsultarActividad");
    const btnMostrarFormulario = document.getElementById("btnAgregarActividad");
    const formulario = document.getElementById("formularioActividad");
    const listado = document.getElementById("listadoActividades");

    btnConsultar.addEventListener("click", () => {
        formulario.style.display = "none";
        listado.style.display = "block";
        mostrarListadoActividades();
    });

    btnMostrarFormulario.addEventListener("click", () => {
        formulario.style.display = "block";
        listado.style.display = "none";
    });

    // Mostrar solo la lista al cargar por defecto (si querés):
    formulario.style.display = "none";
    listado.style.display = "block";
});