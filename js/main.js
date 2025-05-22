// ----------------------- ACCEDER A LA API ----------------------------
const API_KEY = 'f53f317f0b2b45006b5246acd2fb182c';

const obtenerUrl = (pagina = 1) => {
    const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=${pagina}`;

    return URL;
}

let peliculas = [];

const contenedorErrores = document.getElementById('mensaje-error');
const loader = document.getElementById('loader');

const obtenerPeliculas = async (pagina = 1) => {
    try {
        loader.style.display = 'block';
        
        const respuesta = await fetch(obtenerUrl(pagina));
        const respuestaJSON = await respuesta.json();

        peliculas = respuestaJSON.results;

        mostrarPeliculas();
        agregarFavoritos();
        cargarGeneros();
    } catch (error) {
        if (contenedorErrores) {
            contenedorErrores.innerHTML = `<p class="error">⚠️ Ocurrió un error al cargar las peliculas. Prueba recargar la página.</p>`;
        }
    } finally {
        loader.style.display = 'none';
    }
}

obtenerPeliculas();

// ----------------------- MOSTRAR LAS PELICULAS EN LA PAGINA ----------------------------
const contenedorPeliculas = document.getElementById('contenedor-peliculas');

const mostrarPeliculas = (lista = peliculas) => {
    let divPeliculas = '';
    contenedorPeliculas.innerHTML = '';

    lista.forEach(pelicula => {
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
    if (paginaActual > 1) {
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

// ----------------------- FILTRAR LAS PELICULAS POR GENERO ----------------------------
const URL_GENEROS = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-ES`;
const selectGenero = document.getElementById('filtro-genero');

const cargarGeneros = async () => {
    try {
        const respuesta = await fetch(URL_GENEROS);
        const datos = await respuesta.json();
        const generos = datos.genres;


        generos.forEach(genero => {
            const option = document.createElement('option');

            option.value = genero.id;
            option.textContent = genero.name;

            selectGenero.appendChild(option);
        })
    } catch (error) {
        if (contenedorErrores) {
            contenedorErrores.innerHTML = `<p class="error">⚠️ Ocurrió un error al cargar los generos. Prueba recargar la página.</p>`;
        }
    }
}

selectGenero.addEventListener('change', (evento) => {
    const idGenero = parseInt(evento.target.value);

    const peliculasFiltradas = idGenero ? peliculas.filter(peli => peli.genre_ids.includes(idGenero)) : peliculas;

    mostrarPeliculas(peliculasFiltradas);
    agregarFavoritos();
});