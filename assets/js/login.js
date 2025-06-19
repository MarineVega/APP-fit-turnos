document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");
  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");
  const error = document.getElementById("loginError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    error.textContent = "";

    if (!email.value || !password.value) {
      error.textContent = "Completá todos los campos.";
      return;
    }

    // Obtener usuario de localStorage
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

    if (
      usuarioGuardado &&
      email.value === usuarioGuardado.email &&
      password.value === usuarioGuardado.password
    ) {
      const mensaje = usuarioGuardado.esAdmin
        ? 'Bienvenido administrador'
        : '¡Bienvenido!';

      Swal.fire({
        title: mensaje,
        imageUrl: '../assets/img/exito.png',
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Checkmark',
        icon: 'success',
        confirmButtonText: 'Cerrar'
      });

      form.reset();
    } else {
      error.textContent = "Email o contraseña incorrectos.";
    }
  });
});
