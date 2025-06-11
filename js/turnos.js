document.addEventListener("DOMContentLoaded", () => {
  const tarjetas = document.querySelectorAll(".actividad-card");

  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
    
      tarjetas.forEach((t) => t.classList.remove("seleccionada"));
      tarjeta.classList.add("seleccionada");
      
    });
  });
});
