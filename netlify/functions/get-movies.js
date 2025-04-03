const fs = require("fs");
const path = require("path");

const moviesFile = path.join(__dirname, "movies.json");  // 🔥 Asegurar que el archivo está dentro de la función

exports.handler = async function() {
    try {
        if (fs.existsSync(moviesFile)) {
            const data = fs.readFileSync(moviesFile, "utf-8");
            return {
                statusCode: 200,
                body: data,
                headers: { "Content-Type": "application/json" } // 🔥 Asegurar que el navegador lo trate como JSON
            };
        } else {
            return {
                statusCode: 200,
                body: "[]",
                headers: { "Content-Type": "application/json" }
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error al obtener películas", error: error.message })
        };
    }
};
