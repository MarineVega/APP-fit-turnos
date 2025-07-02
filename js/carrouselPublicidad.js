
/* Imagenes publicitarias */
const rutasImg = [
  '../assets/img/publi1.png',
  '../assets/img/publi2.png',
  '../assets/img/publi3.png',
  '../assets/img/publi4.jpeg',
  '../assets/img/publi5.jpeg',
  '../assets/img/publi6.jpeg'
];

/* Cantidad a mostrar por “página” */
const publicidades = 3;

/* Carrusel dinamico */
window.addEventListener('DOMContentLoaded', () => {
    const carrusel = document.getElementById('carrusel');

    /* Flechas */
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carrusel-btn prev';
    prevBtn.textContent = '❮';

    const sigBtn = document.createElement('button');
    sigBtn.className = 'carrusel-btn sig';
    sigBtn.textContent = '❯';

    /* Fila desplazable */
    const fila = document.createElement('div');
    fila.className = 'carrusel-fila';

    for (let i = 0; i < rutasImg.length; i += publicidades) {
        const slide = document.createElement('div');
        slide.className = 'slide';

        /* Muestra hasta X imagenes por slide. Segun variable publicidades*/
        for (let j = i; j < i + publicidades && j < rutasImg.length; j++) {
            const img = document.createElement('img');
            img.src = rutasImg[j];
            img.alt = `Publicidad ${j + 1}`;
            slide.appendChild(img);
        }

        fila.appendChild(slide);
    }

    /* Agregar todo al DOM */
    carrusel.append(prevBtn, fila, sigBtn);

    /* Play automatico */
    let autoID;
    
    const startAuto = () => autoID = setInterval(() => sigBtn.click(), 5000);
    const stopAuto  = () => clearInterval(autoID);

    startAuto();

    carrusel.addEventListener('mouseenter', stopAuto);
    carrusel.addEventListener('mouseleave', startAuto); 

    /* Navegacion */
    let pagina = 0;
    const totalPaginas = fila.children.length; 

    const update = () => {
        fila.style.transform = `translateX(-${pagina * 100}%)`; //le agrego transform para correr el carrusel y mostrar el resto de imagenes
    };

    sigBtn.addEventListener('click', () => {
        if (pagina < totalPaginas - 1)
            pagina++;
        else 
            pagina = 0; /* vuelve al inicio */
                    
        update(); //realizo el transform a la fila con este llamado
    });

    prevBtn.addEventListener('click', () => {
        if (pagina > 0) 
            pagina--;
        else 
            pagina = totalPaginas - 1; /* va al final */

        update();
    });
});



