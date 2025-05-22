// ----------------------- ACCEDER A LA API ----------------------------
const API_KEY = 'f53f317f0b2b45006b5246acd2fb182c';

const obtenerUrl = (pagina = 1) => {
    const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=${pagina}`;

    return URL;
}

let peliculas = [];

const obtenerPeliculas = async (pagina = 1) => {
    try {
        const respuesta = await fetch(obtenerUrl(pagina));
        const respuestaJSON = await respuesta.json();

        peliculas = respuestaJSON.results;

        mostrarPeliculas();
        agregarFavoritos();
    } catch (error) {
        console.log('Error: ', error);
    }
}

obtenerPeliculas();


// ----------------------- MOSTRAR LAS PELICULAS EN LA PAGINA ----------------------------
const contenedorPeliculas = document.getElementById('contenedor-peliculas');


const mostrarPeliculas = () => {
    let divPeliculas = '';
    contenedorPeliculas.innerHTML = '';

    peliculas.forEach(pelicula => {
        const tituloPelicula = pelicula.title;
        const urlImagenPelicula = `https://image.tmdb.org/t/p/w300${pelicula.poster_path}`;
        const idPelicula = pelicula.id;

        const yaEsta = favoritos.some(p => p.id === idPelicula);
        const textoBoton = yaEsta ? 'Ya esta en Favoritos' : 'Agregar a Favoritos';

        divPeliculas += `
            <div class="pelicula" id="${idPelicula}">
                <img src="${urlImagenPelicula}" alt="${tituloPelicula}">
                <h3>${tituloPelicula}</h3>
                <button class="btn-favoritos">${textoBoton}</button>
            </div>
        `;
    });

    contenedorPeliculas.innerHTML = divPeliculas;
}

// ----------------------- AGREGAR PELICULAS A FAVORITOS ----------------------------
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

const agregarFavoritos = () => {
    const btnAgregarFavoritos = document.querySelectorAll('.btn-favoritos');
    
    btnAgregarFavoritos.forEach(boton => {
        boton.addEventListener('click', () => {
            const idPelicula = parseInt(boton.parentElement.id);

            const peliculaSeleccionada = peliculas.find(p => p.id === idPelicula);
            const yaEsta = favoritos.some(p => p.id === idPelicula);

            if (!yaEsta) {
                favoritos.push(peliculaSeleccionada);

                localStorage.setItem('favoritos', JSON.stringify(favoritos));

                boton.textContent = 'Ya esta en favoritos';
            }
        });
    })
}

// ----------------------- AGREGAR PAGINACION AL SITIO ----------------------------
let paginaActual = 1;

const btnAnterior = document.getElementById('anterior');
const btnSiguiente = document.getElementById('siguiente');
const spanPagina = document.getElementById('pagina-actual');

btnAnterior.addEventListener('click', () => {
    if (paginaActual > 1){
        paginaActual--;
        obtenerPeliculas(paginaActual);
        spanPagina.textContent = paginaActual;
    }
});

btnSiguiente.addEventListener('click', () => {
    paginaActual++;
    obtenerPeliculas(paginaActual);
    spanPagina.textContent = paginaActual;
});