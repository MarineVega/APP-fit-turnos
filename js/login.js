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

    // Obtener lista de usuarios guardados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar usuario con email y password coincidente
    const usuario = usuarios.find(
      (u) => u.email === email.value && u.password === password.value
    );

    if (usuario) {
      // Guardar usuario logueado en sesión/ esto para que se pueda usar en el index
      localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

      const mensaje = usuario.esAdmin
        ? "Bienvenido administrador"
        : "¡Bienvenido!";

     Swal.fire({
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
    } else {
      error.textContent = "Email o contraseña incorrectos.";

    }
  });
});
