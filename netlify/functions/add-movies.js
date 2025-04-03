const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: "Método no permitido"
        };
    }

    try {
        const movie = JSON.parse(event.body);
        const filePath = "./public/movies.json";

        let movies = [];
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf8");
            movies = JSON.parse(data);
        }

        // 🔥 Verificar si la película ya está en la lista (comparando nombre y año)
        const exists = movies.some(m => m.movie_name === movie.movie_name && m.year === movie.year);
        if (exists) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Esta película ya ha sido agregada" })
            };
        }

        // Asignar un ID único a la película
        movie.id = movie.id || `${movie.movie_name.replace(/\s+/g, "-").toLowerCase()}-${movie.year}`;

        movies.unshift(movie);
        fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Película agregada con éxito" })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: "Error al guardar" }) };
    }
};
