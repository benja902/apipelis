const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    try {
        const filePath = path.join(__dirname, "../../public/selected-movies.json");

        if (!fs.existsSync(filePath)) {
            return { statusCode: 200, body: JSON.stringify([]) };
        }

        const data = fs.readFileSync(filePath, "utf8");
        const movies = JSON.parse(data);

        return { statusCode: 200, body: JSON.stringify(movies) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: "Error al obtener las películas" }) };
    }
};
