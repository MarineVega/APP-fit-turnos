// recuperar.js
document.addEventListener("DOMContentLoaded", () => {
  const formRecuperar1 = document.getElementById("formRecuperar1");
  const recuperarEmail = document.getElementById("recuperarEmail");
  const recuperarError1 = document.getElementById("recuperarError1");

  const formRecuperar2 = document.getElementById("formRecuperar2");
  const codigoSeguridad = document.getElementById("codigoSeguridad");
  const recuperarError2 = document.getElementById("recuperarError2");
  const reenviarCodigo = document.getElementById("reenviarCodigo");

  const formRecuperar3 = document.getElementById("formRecuperar3");
  const nuevaPassword = document.getElementById("nuevaPassword");
  const confirmarNuevaPassword = document.getElementById("confirmarNuevaPassword");
  const recuperarError3 = document.getElementById("recuperarError3");

  const mostrar = (formId) => {
    document.querySelectorAll("form").forEach(f => f.style.display = "none");
    document.getElementById(formId).style.display = "flex";
  };

  //  "Recuperar paso 1"
  formRecuperar1.addEventListener("submit", (e) => {
    e.preventDefault();
    recuperarError1.textContent = "";

    if (!recuperarEmail.value) {
      recuperarError1.textContent = "Ingresá tu email.";
      return;
    }

    // simula el envio de codigo
    alert("Se ha enviado un código de seguridad a tu email.");
    mostrar("formRecuperar2");
  });

  //  "Recuperar paso 2"
  formRecuperar2.addEventListener("submit", (e) => {
    e.preventDefault();
    recuperarError2.textContent = "";

    if (!codigoSeguridad.value) {
      recuperarError2.textContent = "Ingresá el código de seguridad.";
      return;
    }

    // Simula una validación
    if (codigoSeguridad.value === "123456") { // 
      mostrar("formRecuperar3");
    } else {
       Swal.fire({
       title: '¡upps!, ocurrió un error',
       text:'Algo salio mal, por favor intentalo nuevamente',
       imageUrl: '../assets/img/error.png', // imagen
       imageWidth: 100,
       imageHeight: 100,
       imageAlt: 'Checkmark',
       icon: 'error', //
       confirmButtonText: 'Cerrar',
       customClass: {
       confirmButton: 'btnAceptar'
      },
      buttonsStyling: false
      });
    }
  });

  reenviarCodigo.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Se ha reenviado un nuevo código de seguridad a tu email.");
  });

  //"Recuperar paso 3"
  formRecuperar3.addEventListener("submit", (e) => {
    e.preventDefault();
    recuperarError3.textContent = "";

    if (!nuevaPassword.value || !confirmarNuevaPassword.value) {
      recuperarError3.textContent = "Completá todos los campos.";
      return;
    }

    if (nuevaPassword.value.length < 6) {
      recuperarError3.textContent = "La contraseña debe tener al menos 6 caracteres.";
      return;
    }

    if (nuevaPassword.value !== confirmarNuevaPassword.value) {
      recuperarError3.textContent = "Las contraseñas no coinciden.";
      return;
    }

     Swal.fire({
       title: '¡Operación exitosa!',
       text:'Se ha actualizado la contraseña',
       imageUrl: '../assets/img/exito.png', // imagen
       imageWidth: 100,
       imageHeight: 100,
       imageAlt: 'Checkmark',
       icon: 'success', //icono exito 
       confirmButtonText: 'Cerrar'
       });
    mostrar("formLogin"); 
    document.getElementById("modoTitulo").textContent = "Iniciar Sesión";
    formRecuperar1.reset();
    formRecuperar2.reset();
    formRecuperar3.reset();
  });
});