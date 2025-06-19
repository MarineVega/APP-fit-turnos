document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCrear");
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("crearEmail");
  const pass = document.getElementById("crearPassword");
  const confirmar = document.getElementById("confirmarPassword");
  const esAdmin = document.getElementById("esAdmin");
  const error = document.getElementById("crearError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    error.textContent = "";

    if (!nombre.value || !email.value || !pass.value || !confirmar.value) {
      error.textContent = "Completá todos los campos.";
      return;
    }

    if (pass.value.length < 6) {
      error.textContent = "La contraseña debe tener al menos 6 caracteres.";
      return;
    }

    if (pass.value !== confirmar.value) {
      error.textContent = "Las contraseñas no coinciden.";
      return;
    }

    // Simula guardar usuario en localStorage
    const usuario = {
      nombre: nombre.value,
      email: email.value,
      password: pass.value,
      esAdmin: esAdmin.checked
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));

    Swal.fire({
      title: '¡Operación Exitosa!',
      text: 'Bienvenid@, ya está todo listo, alcanza tus objetivos con nosotros.',
      imageUrl: '../assets/img/exito.png', 
      imageHeight: 100,
      imageAlt: 'Éxito',
      icon: 'success',
      confirmButtonText: 'Inicio',
      customClass: {
        confirmButton: 'btnAceptar' 
      },
      buttonsStyling: false 
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '../index.html';
      }
    });

    form.reset();
  });
});

