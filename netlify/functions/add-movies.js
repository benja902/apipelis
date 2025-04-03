const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Método no permitido" }),
        };
    }

    try {
        // 🔥 Lee el archivo de películas
        const filePath = path.resolve(__dirname, "../../public/movies.json");
        let movies = [];

        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf-8");
            movies = JSON.parse(data);
        }

        // 🔥 Obtiene los datos de la nueva película
        const movie = JSON.parse(event.body);

        // 🔥 Verifica si la película ya existe
        if (movies.some(m => m.movie_name === movie.movie_name)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "La película ya existe" }),
            };
        }

        // 🔥 Agrega la nueva película y guarda el archivo
        movies.push(movie);
        fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Película añadida correctamente" }),
        };
    } catch (error) {
        console.error("Error en add-movies:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error interno del servidor" }),
        };
    }
};
