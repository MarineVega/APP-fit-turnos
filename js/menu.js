/* menu desplegable hamburguesa */

const btnMenu = document.getElementById('btnMenu');
const menu = document.getElementById('menuDesplegable');

// mostrar o esconder menu al apretar en el icono
btnMenu.addEventListener('click', (e) => {
    e.preventDefault();
    menu.classList.toggle('mostrar');
});

// esconde el menu si se apreta afuera del menu
document.addEventListener('click', (e) => {
    const clickeaDentro = menu.contains(e.target);
    const clickeaBoton = btnMenu.contains(e.target);

    if (!clickeaDentro && !clickeaBoton) {
        menu.classList.remove('mostrar');
    }
});