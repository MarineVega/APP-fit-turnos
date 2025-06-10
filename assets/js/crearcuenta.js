document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCrear");
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("crearEmail");
  const pass = document.getElementById("crearPassword");
  const confirmar = document.getElementById("confirmarPassword");
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

    alert("Cuenta creada exitosamente");
    form.reset();
  });
});
