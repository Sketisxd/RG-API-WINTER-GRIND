const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
require('dotenv').config();
app.use(cors())
const API_KEY = process.env.API_KEY;

const playerPUUIDS = [
    "zJuF3yiP87YPy2EsMFjJl7rLia-Q2ymDOiKuTMAkH6jrOmUrIB5VIvWNR3UE43Dw_DNOr-B5tCXR0Q",
    "MgBnrMdEFOTEivbfrLg51LjSfr4iMFgYSm5Z3trSFgHjZ_fTZfNg6ER-YzLK7axzOIBuU4OntmP_UA"
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
