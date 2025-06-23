document.addEventListener("DOMContentLoaded", () => { 
  const nombreUsuario = document.getElementById("nombreUsuario");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  const userBar = document.getElementById("userBar");

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (!usuarioActivo) {
    // No hay usuario activo, redirigir a la página de login
    window.location.href = "cuenta.html";
    return;
  }

  if (nombreUsuario && userBar) {
    // Mostrar barra y nombre
    userBar.style.display = "flex"; // Mostrar barra de usuario

    if (usuarioActivo.esAdmin) {
      nombreUsuario.textContent = `${usuarioActivo.nombre} (Admin)`;
    } else {
      nombreUsuario.textContent = usuarioActivo.nombre;
    }
  }

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      Swal.fire({
        title: "¿Cerrar sesión?",
        text: "¿Querés salir de tu cuenta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, salir",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btnAceptar",
          cancelButton: "btnCancelar"
        },
        buttonsStyling: false
      }).then((result) => {
        if (result.isConfirmed) {
         // si cierra sesion, borra usuario activo y se va al index
            localStorage.removeItem("usuarioActivo");
          window.location.href = "index.html";
        }
      });
    });
  }
});
