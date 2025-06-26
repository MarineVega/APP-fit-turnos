document.addEventListener("DOMContentLoaded", function () {
  const nombreUsuario = document.getElementById("nombreUsuario");
  const menuCerrarSesion = document.getElementById("menuCerrarSesion");
  const userBar = document.getElementById("userBar");

  const menuIniciarSesion = document.getElementById("menuIniciarSesion");
  const menuCrearCuenta = document.getElementById("menuCrearCuenta");
  const menuAdmin = document.getElementById("menuAdmin");

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  // si el usuario esta activo, pone el nombre en la barra de navegacion si existe
  if (usuarioActivo) {
    if (nombreUsuario && userBar) {
      userBar.style.display = "flex";

      // si el usuario es administrador debe mostrarle en el menu la opcion administrar
      if (usuarioActivo.esAdmin) {        
        nombreUsuario.textContent = 'Hola ' + usuarioActivo.nombre + '!';
        // se supone que el elemento existe pero se hace para evitar errores.    
        if (menuAdmin) {
          menuAdmin.style.display = "block";
        }
      } else {
        nombreUsuario.textContent = usuarioActivo.nombre;

        if (menuAdmin) {
          menuAdmin.style.display = "none";
        }
      }
    }
    // oculta las opciones de iniciar sesión y crear cuenta
    // es buena practica preguntar si existe el elemento antes de manipularlo
    if (menuIniciarSesion) {
      menuIniciarSesion.style.display = "none";
    }

    if (menuCrearCuenta) {
      menuCrearCuenta.style.display = "none";
    }
  }
  // si no hay usuario activo, oculta la barra de usuario y muestra las opciones de iniciar sesión y crear cuenta 
    else {
    if (menuIniciarSesion) {
      menuIniciarSesion.style.display = "block";
    }

    if (menuCrearCuenta) {
      menuCrearCuenta.style.display = "block";
    }

    if (menuAdmin) {
      menuAdmin.style.display = "none";
    }

    if (userBar) {
      userBar.style.display = "none";
    }

     // oculta cerrar sesión
    if (menuCerrarSesion) {
      menuCerrarSesion.style.display = "none";
    }
  }

  // aca consulta si desea cerrar la sesion si es Sí borra el usuario activo y vuelve a index
  if (menuCerrarSesion) {
    menuCerrarSesion.addEventListener("click", function (e) {
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