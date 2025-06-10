document.addEventListener("DOMContentLoaded", () => {
 const titulo = document.getElementById("modoTitulo");

  const mostrar = (formId) => {
    document.querySelectorAll("form").forEach(f => f.style.display = "none");
    document.getElementById(formId).style.display = "flex";
  };

  document.getElementById("linkRegistrarse").addEventListener("click", (e) => {
    e.preventDefault();
    mostrar("formCrear");
    titulo.textContent = "Crear Cuenta";
  });

  document.getElementById("linkRecuperar").addEventListener("click", (e) => {
    e.preventDefault();
    mostrar("formRecuperar1");
    titulo.textContent = "Recuperar Contraseña";
  });

  document.getElementById("linkVolverLogin1").addEventListener("click", (e) => {
    e.preventDefault();
    mostrar("formLogin");
    titulo.textContent = "Iniciar Sesión";
  });

  document.getElementById("linkVolverLogin2").addEventListener("click", (e) => {
    e.preventDefault();
    mostrar("formLogin");
    titulo.textContent = "Iniciar Sesión";
  });

  document.getElementById("flechaVolver").addEventListener("click", () => {
    history.back();
  });
});
/*navegacion.js
document.addEventListener("DOMContentLoaded", () => {
  const titulo = document.getElementById("modoTitulo");

  const mostrar = (formId) => {
    document.querySelectorAll("form").forEach(f => f.style.display = "none");
    document.getElementById(formId).style.display = "flex";
  };

  document.getElementById("linkRegistrarse").addEventListener("click", (e) => {
    e.preventDefault();
    mostrar("formCrear");
    titulo.textContent = "Crear Cuenta";
  });

  document.getElementById("linkRecuperar").addEventListener("click", (e) => {
    e.preventDefault();
    mostrar("formRecuperar1");
    titulo.textContent = "Recuperar Contraseña";
  });

  document.getElementById("linkVolverLogin1").addEventListener("click", (e) => {
    e.preventDefault();
    mostrar("formLogin");
    titulo.textContent = "Iniciar Sesión";
  });

  document.getElementById("linkVolverLogin2").addEventListener("click", (e) => {
    e.preventDefault();
    mostrar("formLogin");
    titulo.textContent = "Iniciar Sesión";
  });

  document.getElementById("flechaVolver").addEventListener("click", () => {
    // This will go back in the browser history, effectively
    // going back to the previously shown form or page.
    history.back();
  });

  // Set initial display to login form
  mostrar("formLogin");
});*/