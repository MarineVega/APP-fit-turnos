document.addEventListener("DOMContentLoaded", function () {

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

  /* =========================================================
     ELEMENTOS DEL NAVBAR (ESCRITORIO)
     ========================================================= */
  const nombreUsuario    = document.getElementById("nombreUsuario");
  const menuCerrarSesion = document.getElementById("menuCerrarSesion");
  const userBar          = document.getElementById("userBar");

  const menuIniciarSesion = document.getElementById("menuIniciarSesion");
  const menuCrearCuenta   = document.getElementById("menuCrearCuenta");
  const menuAdmin         = document.getElementById("menuAdmin");
  const menuTurnos        = document.getElementById("menuTurnos");

  /* =========================================================
     ELEMENTOS DEL MENÚ HAMBURGUESA
     ========================================================= */
  const menuHamburguesaIniciarSesion = document.getElementById("menuHamburguesaIniciarSesion");
  const menuHamburguesaCrearCuenta   = document.getElementById("menuHamburguesaCrearCuenta");
  const menuHamburguesaAdmin         = document.getElementById("menuHamburguesaAdmin");
  const menuHamburguesaTurnos        = document.getElementById("menuHamburguesaTurnos");
  const menuHamburguesaCerrarSesion  = document.getElementById("menuHamburguesaCerrarSesion");

  /* =========================================================
     ELEMENTOS DEL CUERPO PRINCIPAL
     ========================================================= */
  const botonIniciarSesion = document.getElementById("botonIniciarSesion");
  const linkRegistrarse    = document.getElementById("linkRegistrarse");

  /* =========================================================
     USUARIO ACTIVO (localStorage)
     ========================================================= */
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  /* =========================================================
     SEGÚN ESTADO DEL USUARIO
     ========================================================= */
  if (usuarioActivo) {

    /* --- Mostrar nombre de usuario y barra --- */
    if (nombreUsuario) {
      if (usuarioActivo.esAdmin === true) {
        nombreUsuario.textContent = usuarioActivo.nombre + " (Admin)";
      } else {
        nombreUsuario.textContent = usuarioActivo.nombre;
      }
    }

    if (userBar) {
      userBar.style.display = "flex";
    }

    /* --- Botón Administrar (escritorio y hamburguesa) --- */
    if (usuarioActivo.esAdmin === true) {
      if (menuAdmin) {
        menuAdmin.style.display = "block";
      }
      if (menuHamburguesaAdmin) {
        menuHamburguesaAdmin.style.display = "block";
      }
    } else {
      if (menuAdmin) {
        menuAdmin.style.display = "none";
      }
      if (menuHamburguesaAdmin) {
        menuHamburguesaAdmin.style.display = "none";
      }
    }

    /* --- Ocultar Iniciar sesión / Crear cuenta (ya logueado) --- */
    if (menuIniciarSesion) {
      menuIniciarSesion.style.display = "none";
    }
    if (menuCrearCuenta) {
      menuCrearCuenta.style.display = "none";
    }
    if (menuHamburguesaIniciarSesion) {
      menuHamburguesaIniciarSesion.style.display = "none";
    }
    if (menuHamburguesaCrearCuenta) {
      menuHamburguesaCrearCuenta.style.display = "none";
    }

    /* --- Mostrar Cerrar sesión (escritorio y hamburguesa) --- */
    if (menuCerrarSesion) {
      menuCerrarSesion.style.display = "block";
    }
    if (menuHamburguesaCerrarSesion) {
      menuHamburguesaCerrarSesion.style.display = "block";
    }

    /* --- Mostrar Turnos (escritorio y hamburguesa) --- */
    if (menuTurnos) {
      menuTurnos.style.display = "block";
    }
    if (menuHamburguesaTurnos) {
      menuHamburguesaTurnos.style.display = "block";
    }

    /* --- Ocultar botones principales (home) --- */
    if (botonIniciarSesion) {
      botonIniciarSesion.style.display = "none";
    }
    if (linkRegistrarse) {
      linkRegistrarse.style.display = "none";
    }

  } else {
    /* =======================================================
       USUARIO NO LOGUEADO
       ======================================================= */

    /* --- Mostrar Iniciar sesión / Crear cuenta --- */
    if (menuIniciarSesion) {
      menuIniciarSesion.style.display = "block";
    }
    if (menuCrearCuenta) {
      menuCrearCuenta.style.display = "block";
    }
    if (menuHamburguesaIniciarSesion) {
      menuHamburguesaIniciarSesion.style.display = "block";
    }
    if (menuHamburguesaCrearCuenta) {
      menuHamburguesaCrearCuenta.style.display = "block";
    }

    /* --- Ocultar opciones exclusivas de usuarios logueados --- */
    if (menuAdmin) {
      menuAdmin.style.display = "none";
    }
    if (menuHamburguesaAdmin) {
      menuHamburguesaAdmin.style.display = "none";
    }
    if (menuCerrarSesion) {
      menuCerrarSesion.style.display = "none";
    }
    if (menuHamburguesaCerrarSesion) {
      menuHamburguesaCerrarSesion.style.display = "none";
    }
    if (menuTurnos) {
      menuTurnos.style.display = "none";
    }
    if (menuHamburguesaTurnos) {
      menuHamburguesaTurnos.style.display = "none";
    }

    /* --- Ocultar barra de usuario --- */
    if (userBar) {
      userBar.style.display = "none";
    }

    /* --- Mostrar botones principales (home) --- */
    if (botonIniciarSesion) {
      botonIniciarSesion.style.display = "inline-block";
    }
    if (linkRegistrarse) {
      linkRegistrarse.style.display = "inline-block";
    }
  }

  /* =========================================================
     EVENTOS DE CERRAR SESIÓN
     ========================================================= */

  /* Cerrar sesión desde menú de escritorio */
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
        if (result.isConfirmed === true) {
          localStorage.removeItem("usuarioActivo");
          window.location.href = "index.html";
        }
      });
    });
  }

  /* Cerrar sesión desde menú hamburguesa */
  if (menuHamburguesaCerrarSesion) {
    menuHamburguesaCerrarSesion.addEventListener("click", function (e) {
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
        if (result.isConfirmed === true) {
          localStorage.removeItem("usuarioActivo");
          window.location.href = "index.html";
        }
      });
    });
  }

});
