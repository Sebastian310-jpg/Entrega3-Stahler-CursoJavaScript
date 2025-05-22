// ----------------------- MOSTRAR FAVORITOS ----------------------------
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

const contenedorPeliculas = document.getElementById('contenedor-peliculas');

const mostrarFavoritos = () => {
    let divPeliculas = '';
    contenedorPeliculas.innerHTML = '';

    if (favoritos.length === 0) {
        contenedorPeliculas.innerHTML = '<p>🎬 <strong>No hay películas en favoritos.</strong></p>';
        return;
    }

    favoritos.forEach(pelicula => {
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
