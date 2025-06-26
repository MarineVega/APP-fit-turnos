document.addEventListener("DOMContentLoaded", function () {
    /* menu desplegable hamburguesa */
    
    const btnMenu = document.getElementById('btnMenu');
    const menu = document.getElementById('menuDesplegable');
    
    // mostrar o esconder menu al apretar en el icono
    btnMenu.addEventListener('click', (e) => {
        e.preventDefault();
        menu.classList.toggle('mostrar');
    });
    
    // esconde el menu si se apreta afuera del menu
    document.addEventListener('click', (e) => {
        const clickeaDentro = menu.contains(e.target);
        const clickeaBoton = btnMenu.contains(e.target);
    
        if (!clickeaDentro && !clickeaBoton) {
            menu.classList.remove('mostrar');
        }
    });
  const nombreUsuario = document.getElementById("nombreUsuario");
  const menuCerrarSesion = document.getElementById("menuCerrarSesion");
  const userBar = document.getElementById("userBar");

  const menuIniciarSesion = document.getElementById("menuIniciarSesion");
  const menuCrearCuenta = document.getElementById("menuCrearCuenta");
  const menuAdmin = document.getElementById("menuAdmin");
  const menuTurnos = document.getElementById("menuTurnos");

  // elementos del menú hamburguesa
  const menuHamburguesaIniciarSesion = document.getElementById("menuHamburguesaIniciarSesion");
  const menuHamburguesaCrearCuenta = document.getElementById("menuHamburguesaCrearCuenta");
  const menuHamburguesaAdmin = document.getElementById("menuHamburguesaAdmin");
  const menuHamburguesaTurnos = document.getElementById("menuHamburguesaTurnos");
  const menuHamburguesaCerrarSesion = document.getElementById("menuHamburguesaCerrarSesion");

  // elementos del body (main)
  const botonIniciarSesion = document.getElementById("botonIniciarSesion");
  const linkRegistrarse = document.getElementById("linkRegistrarse");

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  // si el usuario esta activo, pone el nombre en la barra de navegacion si existe
  
  if (usuarioActivo) {
    
    if (nombreUsuario && userBar) {
      userBar.style.display = "flex";

      // si el usuario es administrador debe mostrarle en el menu la opcion administrar
      if (usuarioActivo.esAdmin) {
        nombreUsuario.textContent = usuarioActivo.nombre + " (Admin)";

        // mostrar botón de administrar
        if (menuAdmin) {
          menuAdmin.style.display = "block";
        }
        if (menuHamburguesaAdmin) {
          menuHamburguesaAdmin.style.display = "block";
        }
      } else {
        console.log(menuAdmin);
        nombreUsuario.textContent = usuarioActivo.nombre;

        // ocultar botón de administrar
        if (menuAdmin) {
          menuAdmin.style.display = "none";
        }
        if (menuHamburguesaAdmin) {
          menuHamburguesaAdmin.style.display = "none";
        }
        if (menuIniciarSesion) {
        menuIniciarSesion.style.display = "none";
        }
        if (menuCrearCuenta) {
          menuCrearCuenta.style.display = "none";
        }
       // muestra turnos
        if (menuTurnos) {
          menuTurnos.style.display = "block";
        }
        if (menuHamburguesaTurnos) {
          menuHamburguesaTurnos.style.display = "block";
        }
        
    }

    }

    // oculta las opciones de iniciar sesión y crear cuenta (escritorio y hamburguesa)
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

    // muestra cerrar sesión
    if (menuCerrarSesion) {
      menuCerrarSesion.style.display = "block";
    }
    if (menuHamburguesaCerrarSesion) {
      menuHamburguesaCerrarSesion.style.display = "block";
    }

    // muestra turnos
    if (menuTurnos) {
      menuTurnos.style.display = "block";
    }
    if (menuHamburguesaTurnos) {
      menuHamburguesaTurnos.style.display = "block";
    }

    // oculta botones del cuerpo principal (inicio y registrarse)
    if (botonIniciarSesion) {
      botonIniciarSesion.style.display = "none";
    }
    if (linkRegistrarse) {
      linkRegistrarse.style.display = "none";
    }

  } else {
    // si no hay usuario activo, muestra las opciones de iniciar sesión y crear cuenta 
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

    // oculta opciones exclusivas para usuarios logueados
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

    if (userBar) {
      userBar.style.display = "none";
    }

    // muestra botones del cuerpo principal
    if (botonIniciarSesion) {
      botonIniciarSesion.style.display = "inline-block";
    }
    if (linkRegistrarse) {
      linkRegistrarse.style.display = "inline-block";
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

  // cerrar sesión desde menú hamburguesa
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
        if (result.isConfirmed) {
          localStorage.removeItem("usuarioActivo");
          window.location.href = "index.html";
        }
      });
    });
  }
});
