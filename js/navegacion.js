document.addEventListener("DOMContentLoaded", () => {
  const titulo = document.getElementById("modoTitulo");

  // Función para mostrar un formulario y ocultar los demás
  const mostrar = (formId) => {
    document.querySelectorAll("form").forEach(f => f.style.display = "none");
    document.getElementById(formId).style.display = "flex";
  };

  // Ir a formulario de Crear Cuenta
  document.getElementById("linkRegistrarse").addEventListener("click", (e) => {
    e.preventDefault();
    mostrar("formCrear");
    titulo.textContent = "Crear Cuenta";
  });

  // Ir a formulario de Recuperar Contraseña (Paso 1: email)
  document.getElementById("linkRecuperar").addEventListener("click", (e) => {
    e.preventDefault();
    mostrar("formRecuperar1");
    titulo.textContent = "Recuperar Contraseña";
  });

  // Volver desde Crear Cuenta a Iniciar Sesión
  document.getElementById("linkVolverLogin1").addEventListener("click", (e) => {
    e.preventDefault();
    mostrar("formLogin");
    titulo.textContent = "Iniciar Sesión";
  });

  // Volver desde Recuperar Contraseña a Iniciar Sesión
  document.getElementById("linkVolverLogin2").addEventListener("click", (e) => {
    e.preventDefault();
    mostrar("formLogin");
    titulo.textContent = "Iniciar Sesión";
  });

  // Flecha de volver: historial hacia atrás
  document.getElementById("flechaVolver").addEventListener("click", () => {
    history.back();
  });
   
  // Si llega con ?form=crear, mostrar directamente el formulario de registro
  const params = new URLSearchParams(window.location.search);
  if (params.get("form") === "crear") {
    mostrar("formCrear");
    titulo.textContent = "Crear Cuenta";
  }
});
