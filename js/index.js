document.addEventListener("DOMContentLoaded", () => {
    const actividades = JSON.parse(localStorage.getItem("actividades")) || [];
    const lista = document.getElementById("actividadesUl");

    actividades.forEach((actividad, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${actividad.nombre}</strong><br>
            ${actividad.descripcion}<br>
            Cupo máximo: ${actividad.cupoMaximo}
        `;
        lista.appendChild(li);
    });
});



function descargarActividades() {
    // Obtener los datos del localStorage
    const actividadesGuardadas = localStorage.getItem("actividades");

    // Si no hay datos, mostrar mensaje
    if (!actividadesGuardadas) {
        alert("No hay actividades guardadas.");
        return;
    }

    // Crear un Blob con los datos
    const blob = new Blob([actividadesGuardadas], { type: "application/json" });

    // Crear un enlace temporal
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "actividades.json"; // nombre del archivo

    // Forzar la descarga
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

/* en HTML agregar un botón para descargar las actividades */
// <button onclick="descargarActividades()">Descargar Actividades</button>

/*
¿Qué hace esto?
Toma el contenido del localStorage bajo la clave "actividades".

Lo convierte en un archivo .json.

Lo descarga automáticamente como actividades.json.
*/


