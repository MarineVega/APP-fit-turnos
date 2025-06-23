const {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
} = dateFns;

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const mesActualEl = document.getElementById("mes-actual");
const grillaDias = document.getElementById("grilla-dias");
const diasSemana = document.getElementById("dias-semana");

let fechaActual = new Date();

const renderDiasSemana = () => {
  const dias = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  diasSemana.innerHTML = dias
    .map((d) => `<div><strong>${d}</strong></div>`)
    .join("");
};

const renderCalendario = () => {
  const inicioMes = startOfMonth(fechaActual);
  const finMes = endOfMonth(fechaActual);
  const inicio = startOfWeek(inicioMes, { weekStartsOn: 0 });
  const fin = endOfWeek(finMes, { weekStartsOn: 0 });

  const dias = eachDayOfInterval({ start: inicio, end: fin });

  grillaDias.innerHTML = dias
    .map((fecha) => {
      const estaEnMesActual = fecha.getMonth() === fechaActual.getMonth();
      return `<div style="background: ${
        estaEnMesActual ? "#fff" : "#eee"
      }">${fecha.getDate()}</div>`;
    })
    .join("");

  mesActualEl.textContent = `${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;

};

document.getElementById("prev").onclick = () => {
  fechaActual = subMonths(fechaActual, 1);
  renderCalendario();
};

document.getElementById("next").onclick = () => {
  fechaActual = addMonths(fechaActual, 1);
  renderCalendario();
};

renderDiasSemana();
renderCalendario();
