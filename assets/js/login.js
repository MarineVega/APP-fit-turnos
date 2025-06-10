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

    // Simulación de login
    if (email.value === "usuario@fit.com" && password.value === "123456") {
       Swal.fire({
       title: '¡Operación exitosa!',
       imageUrl: '../assets/img/exito.png', // imagen
       imageWidth: 100,
       imageHeight: 100,
       imageAlt: 'Checkmark',
       icon: 'success', //icono exito 
       confirmButtonText: 'Cerrar'
       });
      form.reset();
    } else {
      error.textContent = "Email o contraseña incorrectos.";
    }
  });
});
