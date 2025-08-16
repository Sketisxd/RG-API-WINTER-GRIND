const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
require('dotenv').config();
app.use(cors())
const API_KEY = process.env.API_KEY;

const players = [
//   { puuid: "N2xOnAa7xO0HoLJfJEknJhxmi13egN44jic-zAmBgt6OsZyFhEMvniAYyDPCESN4yoOS4ZCyxD6UZQ", name: "Sketis" },
//   { puuid: "hazEn4PIfVpQxjfS0ovP9fO5RJIibcjCqCgP4N4aHuX_cY3yrcf5efXA3kWqqgtCZYdFwqLDriyrnA", name: "Player2" },
  { puuid: "zJuF3yiP87YPy2EsMFjJl7rLia-Q2ymDOiKuTMAkH6jrOmUrIB5VIvWNR3UE43Dw_DNOr-B5tCXR0Q", name: "Sketis" },
  { puuid: "MgBnrMdEFOTEivbfrLg51LjSfr4iMFgYSm5Z3trSFgHjZ_fTZfNg6ER-YzLK7axzOIBuU4OntmP_UA", name: "Requiem" },
  { puuid: "UmNPiOLUtEwky8E_7mxCP2qBcA5rLHX6boEU_kkFdZ8FJqfmyyR2GFYwuePNPYDajkC8ZJH8qfurEA", name: "Magas" },
  { puuid: "loW2q30OfRUv-muUEVlFPSPa1LftY1tl0mszazIAyE8vY5SODsv-WjXZ2935pOxPsqMvmbzhDmDmYg", name: "Luxol" },
  { puuid: "TTR2eiFjHMm5KIoNDhjVUtdgJCGKuhnzYrQDz4lhkNuYRDcXY-RIRFI6Ttlp01HRq5U7ZV0qnA2O5w", name: "Protagonistas" },
  { puuid: "ghzWVDpIH5Tu20C2LsEn1wIH6HMjw0wRS0AMT48oCgKG4d5RufGLa5TTBhoyTr5DUdRs6qjbkX1URg", name: "Not Responding" }
];



app.get('/api/player-data', async (req, res) => {
    try {
        const allData = await Promise.all(
            players.map(async (player) => {

                // First API call
                const leagueResponse = await axios.get(
                    `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${player.puuid}?api_key=${API_KEY}`
                );

                // Second API call
                const summonerResponse = await axios.get(
                    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${player.puuid}?api_key=${API_KEY}`
                );

                return {
                    name: player.name,
                    puuid: player.puuid,
                    leagueData: leagueResponse.data,
                    summonerData: summonerResponse.data
                };
            })
        );

        res.json(allData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(3000, function () {
    console.log("Server started on port 3000")
}) 
