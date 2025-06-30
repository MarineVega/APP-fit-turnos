document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCrear");
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("crearEmail");
  const pass = document.getElementById("crearPassword");
  const confirmar = document.getElementById("confirmarPassword");
  const esAdmin = document.getElementById("esAdmin");
  const error = document.getElementById("crearError");

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
    
 
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    error.textContent = "";

    if (!nombre.value || !email.value || !pass.value || !confirmar.value) {
      error.textContent = "Completá todos los campos.";
      return;
    }
    // Valida que el nombre de usuario no tenga espacios
    if (/\s/.test(nombre.value)) {
      error.textContent = "El nombre de usuario no puede contener espacios.";
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

    // Obtener usuarios existentes
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verificar si ya existe un usuario con ese email
    const existe = usuariosGuardados.some(u => u.email === email.value || u.nombre === nombre.value);
    if (existe) {
      error.textContent = "Ya existe una cuenta registrada con los datos proporcionados.";
      return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
      nombre: nombre.value,
      email: email.value,
      password: pass.value,
      esAdmin: esAdmin.checked
    };

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
    
    swalEstilo.fire({
      title: '¡Operación Exitosa!',
      text: 'Bienvenid@, ya está todo listo, alcanza tus objetivos con nosotros.',
      imageUrl: '../assets/img/exito.png',
      imageHeight: 100,
      imageAlt: 'Éxito',
      icon: 'success',
      confirmButtonText: 'Inicio'
    }).then((result) => {
   if (result.isConfirmed) {
       window.location.href = '../pages/cuenta.html?form=login';
   }
   });


    form.reset();
  });
});
