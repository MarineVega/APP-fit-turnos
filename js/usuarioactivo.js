document.addEventListener("DOMContentLoaded", () => { 
  const nombreUsuario = document.getElementById("nombreUsuario");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (!usuarioActivo) {
    window.location.href = "cuenta.html";
    return;
  }

  if (nombreUsuario) {
    // Mostrar nombre y si es admin
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
          localStorage.removeItem("usuarioActivo");
          window.location.href = "cuenta.html";
        }
      });
    });
  }
});
