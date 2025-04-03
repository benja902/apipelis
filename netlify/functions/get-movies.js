const fs = require("fs");
const path = require("path");

const moviesFile = path.join(__dirname, "../../public/movies.json");

exports.handler = async function() {
    try {
        if (fs.existsSync(moviesFile)) {
            const data = fs.readFileSync(moviesFile, "utf-8");
            return {
                statusCode: 200,
                body: data
            };
        } else {
            return {
                statusCode: 200,
                body: "[]"
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error al obtener películas", error: error.message })
        };
    }
};
