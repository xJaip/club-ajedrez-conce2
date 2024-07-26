import express from "express"
import fs from "fs"
import path from "path"
import csv from "csv-parser"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = 3000

// Leer csv y parsear los datos
function readCSVFile(filePath){
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error))
    })
}

app.get("/api/ranking", async (req, res) => {
    try {
        const filePath = path.join(__dirname, "ranking.csv")
        const players = await readCSVFile(filePath)
        res.json(players)
    }
    catch {
        res.status(500).json({error: "Error al leer el archivo CSV"})
    }
})

app.listen(port, () => {
    console.log("Servidor corriendo")
})