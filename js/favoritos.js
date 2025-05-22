// ----------------------- MOSTRAR FAVORITOS ----------------------------
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

const contenedorPeliculas = document.getElementById('contenedor-peliculas');

const mostrarFavoritos = (lista = favoritos) => {
    let divPeliculas = '';
    contenedorPeliculas.innerHTML = '';

    if (lista.length === 0) {
        contenedorPeliculas.innerHTML = '<p>🎬 <strong>No hay películas en favoritos.</strong></p>';
        return;
    }

    lista.forEach(pelicula => {
        const tituloPelicula = pelicula.title;
        const urlImagenPelicula = `https://image.tmdb.org/t/p/w300${pelicula.poster_path}`;
        const idPelicula = pelicula.id;

        divPeliculas += `
            <div class="pelicula" id="${idPelicula}">
                <img src="${urlImagenPelicula}" alt="${tituloPelicula}">
                <h3>${tituloPelicula}</h3>
                <button class="btn-favoritos">Quitar de Favoritos</button>
            </div>
        `;
    });

    contenedorPeliculas.innerHTML = divPeliculas;
}

mostrarFavoritos();

// ----------------------- QUITAR PELICULA DE FAVORITOS ----------------------------
const eliminarDeFavoritos = () => {
    const btnQuitarFavoritos = document.querySelectorAll('.btn-favoritos');

    btnQuitarFavoritos.forEach(boton => {
        boton.addEventListener('click', () => {
            const idPelicula = parseInt(boton.parentElement.id);

            favoritos = favoritos.filter(p => p.id !== idPelicula);

            localStorage.setItem('favoritos', JSON.stringify(favoritos));

            boton.parentElement.remove();

            if (favoritos.length === 0) {
                contenedorPeliculas.innerHTML = '<p>🎬 <strong>No hay películas en favoritos.</strong></p>';
            }
        });
    });
}

eliminarDeFavoritos();

// ----------------------- FILTRAR LAS PELICULAS POR GENERO ----------------------------
const API_KEY = 'f53f317f0b2b45006b5246acd2fb182c';
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

cargarGeneros();

selectGenero.addEventListener('change', (evento) => {
    const idGenero = parseInt(evento.target.value);
    
    const peliculasFiltradas = idGenero ? favoritos.filter(peli => peli.genre_ids.includes(idGenero)) : favoritos;
    
    mostrarFavoritos(peliculasFiltradas);
});

