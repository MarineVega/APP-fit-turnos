document.addEventListener("DOMContentLoaded", function () {
  const nombreUsuario = document.getElementById("nombreUsuario");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  const userBar = document.getElementById("userBar");

  const btnIniciarSesion = document.getElementById("btnIniciarSesion");
  const btnCrearCuenta = document.getElementById("btnCrearCuenta");
  const btnAdmin = document.getElementById("btnAdmin");

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  // si el usuario esta activo, pone el nombre en la barra de navegacion si existe
  if (usuarioActivo) {
    if (nombreUsuario && userBar) {
      userBar.style.display = "flex";

      // si el usuario es administrador  debe mostrarle en el menu la opcion administrar
      if (usuarioActivo.esAdmin) {
        nombreUsuario.textContent = usuarioActivo.nombre + " (Admin)";
        // se supone que el elemento existe pero se hace para evitar errores.    
        if (btnAdmin) {
          btnAdmin.style.display = "block";
        }
      } else {
        nombreUsuario.textContent = usuarioActivo.nombre;

        if (btnAdmin) {
          btnAdmin.style.display = "none";
        }
      }
    }

    // es buena practica hacerlo, preguntar por el elemento antes de manipularlo

    if (btnIniciarSesion) {
      btnIniciarSesion.style.display = "none";
    }

    if (btnCrearCuenta) {
      btnCrearCuenta.style.display = "none";
    }
  } else {
    if (btnIniciarSesion) {
      btnIniciarSesion.style.display = "block";
    }

    if (btnCrearCuenta) {
      btnCrearCuenta.style.display = "block";
    }

    if (btnAdmin) {
      btnAdmin.style.display = "none";
    }

    if (userBar) {
      userBar.style.display = "none";
    }
  }
 // aca consulta si desea cerrar la sesion si es Si borra el usuario activo y vuelve a index
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function (e) {
      e.preventDefault();

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
      }).then(function (result) {
        if (result.isConfirmed) {
          localStorage.removeItem("usuarioActivo");
          window.location.href = "index.html";
        }
      });
    });
  }
});
