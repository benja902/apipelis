document.getElementById("movie-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const movieData = {
        movie_name: document.getElementById("movie_name").value,
        rating: document.getElementById("rating").value,
        year: document.getElementById("year").value,
        genre: document.getElementById("genre").value,
        synopsis: document.getElementById("synopsis").value,
        movie_link: document.getElementById("movie_link").value,
        post_image: document.getElementById("post_image").value,
        banner_image: document.getElementById("banner_image").value
    };

    try {
        const response = await fetch("/.netlify/functions/add-movies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movieData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al añadir la película.");
        }

        alert(result.message);
        loadMovies(); // Recargar la lista sin refrescar la página
        this.reset();
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error("Error al agregar película:", error);
    }
});

// 🔥 Buscar y filtrar películas
document.getElementById("search-bar").addEventListener("input", loadMovies);
document.getElementById("filter-genre").addEventListener("change", loadMovies);

const generos = {
    28: "Acción",
    12: "Aventura",
    16: "Animación",
    35: "Comedia",
    80: "Crimen",
    99: "Documental",
    18: "Drama",
    10751: "Familia",
    14: "Fantasía",
    36: "Historia",
    27: "Terror",
    10402: "Música",
    9648: "Misterio",
    10749: "Romance",
    878: "Ciencia Ficción",
    10770: "Thriller",
    53: "Suspenso",
    10752: "Bélico"
};

// 🔥 Cargar opciones de géneros
function loadGenreOptions() {
    const genreSelect = document.getElementById("filter-genre");
    Object.values(generos).forEach(genre => {
        const option = document.createElement("option");
        option.value = genre.toLowerCase();
        option.textContent = genre;
        genreSelect.appendChild(option);
    });
}

// 🔥 Cargar y filtrar películas
async function loadMovies() {
    try {
        const searchQuery = document.getElementById("search-bar").value.toLowerCase();
        const selectedGenre = document.getElementById("filter-genre").value.toLowerCase();

        const response = await fetch("/.netlify/functions/get-movies");
        const movies = await response.json();

        const filteredMovies = movies.filter(movie => {
            const movieName = movie.movie_name.toLowerCase();
            const movieGenres = movie.genre.split(", ").map(g => g.trim().toLowerCase());

            const matchesSearch = movieName.includes(searchQuery);
            const matchesGenre = selectedGenre === "" || movieGenres.includes(selectedGenre);

            return matchesSearch && matchesGenre;
        });

        displayMovies(filteredMovies);
    } catch (error) {
        console.error("Error al cargar las películas:", error);
    }
}

// 🔥 Mostrar películas en la página
async function displayMovies(movies) {
    const movieContainer = document.getElementById("movie-list");
    movieContainer.innerHTML = "";

    movies.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie-item");

        const genres = movie.genre.split(", ").map(g => g.trim()).join(", ");

        movieElement.innerHTML = `
            <h3>${movie.movie_name} (${movie.year})</h3>
            <img src="${movie.post_image}" alt="${movie.movie_name}">
            <p class="genre"><strong>Género:</strong> ${genres}</p>
            <p><strong>Rating:</strong> ⭐${movie.rating}</p>
            <p>${movie.synopsis}</p>
            <button class="add-movie-btn" data-movie='${JSON.stringify(movie)}'>Añadir</button>
        `;

        movieContainer.appendChild(movieElement);
    });

    document.querySelectorAll(".add-movie-btn").forEach(button => {
        button.addEventListener("click", function () {
            const movie = JSON.parse(this.getAttribute("data-movie"));
            addToMoviePage(movie);
        });
    });
}

// 🔥 Guardar película seleccionada
async function addToMoviePage(movie) {
    try {
        const response = await fetch("/.netlify/functions/save-selected-movies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movie)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al añadir la película.");
        }

        alert(result.message);
        window.location.href = "movie.html";
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error("Error al añadir película:", error);
    }
}

// 🔥 Cargar géneros y películas al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    loadGenreOptions();
    loadMovies();
});
