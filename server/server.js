const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
require('dotenv').config();
app.use(cors())
const API_KEY = process.env.API_KEY;

const playerPUUIDS = [
    "N2xOnAa7xO0HoLJfJEknJhxmi13egN44jic-zAmBgt6OsZyFhEMvniAYyDPCESN4yoOS4ZCyxD6UZQ",
    "46tIpTAPcb7vHU_GlOlLTFDGdJzsOZXI-qnnfl92qQKoU5Kl_4-Suo4BD5JB3I9pyrnDcAxOvp2bxQ"
]

app.get('/api/player-data', async (req, res) => {
    try {
        const allData = await Promise.all(
            playerPUUIDS.map(async (puuid) => {
                const response = await axios.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${API_KEY}`
                );
              return {
                    puuid,
                    data: response.data
                };
            })
        );
        res.json(allData); 
    }
    catch (error) {

    }
})

app.listen(3000, function () {
    console.log("Server started on port 3000")
}) 
