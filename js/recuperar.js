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

  // configuro estilos para sweetalert
  const swalEstilo = Swal.mixin({
    imageWidth: 200,       // ancho en píxeles
    imageHeight: 200,      // alto en píxeles 
    background: '#bababa',
    confirmButtonColor: '#6edc8c',
    customClass: {
        confirmButton: 'btnAceptar',
        cancelButton: 'btnCancelar'
    }
  });

  // Paso 1: Enviar código por correo
  formRecuperar1.addEventListener("submit", (e) => {
    e.preventDefault();
    recuperarError1.textContent = "";

    if (!recuperarEmail.value) {
      recuperarError1.textContent = "Ingresá tu email.";
      return;
    }

    const destino = recuperarEmail.value;
    const codigo = generarCodigo();
    /*
    // configuro estilos para sweetalert
    const swalEstilo = Swal.mixin({
        imageWidth: 200,       // ancho en píxeles
        imageHeight: 200,      // alto en píxeles 
        background: '#bababa',
        confirmButtonColor: '#6edc8c',
        customClass: {
            confirmButton: 'btnAceptar',
            cancelButton: 'btnCancelar'
        }
    });
    */
    localStorage.setItem("codigoRecuperacion", codigo);
    // coloco el service de emailjs y el template creado
    emailjs.send("service_vq2s3hg", "template_tth5c7f", {
    email: destino,
    codigo: codigo
    })

    .then(() => {
      swalEstilo.fire({
        title: 'Código enviado',
        text: 'Revisá tu correo para continuar con la recuperación.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btnAceptar'
        },
        buttonsStyling: false
      });
      mostrar("formRecuperar2");
    }, (error) => {
      console.error("Error al enviar correo:", error);
      recuperarError1.textContent = "No se pudo enviar el correo. Intentalo más tarde.";
    });
  });

  // Paso 2: Validar código
  formRecuperar2.addEventListener("submit", (e) => {
    e.preventDefault();
    recuperarError2.textContent = "";

    if (!codigoSeguridad.value) {
      recuperarError2.textContent = "Ingresá el código de seguridad.";
      return;
    }

    if (codigoSeguridad.value === localStorage.getItem("codigoRecuperacion")) {
      mostrar("formRecuperar3");
    } else {
      swalEstilo.fire({
        title: '¡Upps!',
        text:'Código incorrecto. Revisá tu correo.',
        imageUrl: '../assets/img/error.png',
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Error',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        customClass: {
          confirmButton: 'btnAceptar'
        },
        buttonsStyling: false
      });
    }
  });

  // Reenviar código
  reenviarCodigo.addEventListener("click", (e) => {
    e.preventDefault();

    const destino = recuperarEmail.value;
    const codigo = generarCodigo();
    localStorage.setItem("codigoRecuperacion", codigo);

    emailjs.send("service_vq2s3hg", "template_tth5c7f", {
      email: destino,
      codigo: codigo
    })
    .then(() => {
      swalEstilo.fire({
        title: 'Código reenviado',
        text: 'Revisá tu correo nuevamente.',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'btnAceptar'
        },
        buttonsStyling: false
      });
    }, (error) => {
      console.error("Error al reenviar código:", error);
      recuperarError2.textContent = "No se pudo reenviar el código.";
    });
  });

  // Paso 3: Cambiar contraseña
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

    swalEstilo.fire({
      title: '¡Operación exitosa!',
      text:'Se ha actualizado la contraseña',
      imageUrl: '../assets/img/exito.png',
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: 'Éxito',
      icon: 'success',
      confirmButtonText: 'Cerrar'
    });

    mostrar("formLogin");
    
    document.getElementById("modoTitulo").textContent = "Iniciar Sesión";
    formRecuperar1.reset();
    formRecuperar2.reset();
    formRecuperar3.reset();

    localStorage.removeItem("codigoRecuperacion");
  });
 // genero codigo de recuperacion de cuenta para enviar por mail
  function generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
});
