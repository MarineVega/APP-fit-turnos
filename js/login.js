document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");
  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");
  const error = document.getElementById("loginError");

  // configuro estilos para sweetalert
  const swalEstilo = Swal.mixin({
    imageWidth: 200,
    imageHeight: 200,
    background: '#bababa',
    confirmButtonColor: '#6edc8c',
    customClass: {
      confirmButton: 'btnAceptar',
      cancelButton: 'btnCancelar'
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    error.textContent = "";

    if (!email.value || !password.value) {
      error.textContent = "Completá todos los campos.";
      return;
    }

    // Obtener lista de usuarios guardados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar usuario por email
    const usuarioPorEmail = usuarios.find((u) => u.email === email.value);

    if (!usuarioPorEmail) {
      error.textContent = "La cuenta no existe. Verificá el email o creá una nueva cuenta.";
    } else if (usuarioPorEmail.password !== password.value) {
      error.textContent = "Contraseña incorrecta.";
    } else {
      // Guardar usuario logueado en sesión
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarioPorEmail));

      const mensaje = usuarioPorEmail.esAdmin
        ? "Bienvenido administrador"
        : "¡Bienvenido!";

      swalEstilo.fire({
        title: mensaje,
        imageUrl: "../assets/img/exito.png",
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: "Checkmark",
        icon: "success",
        confirmButtonText: "Cerrar"
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "../index.html";
        }
      });

      form.reset();
    }
  });
});
