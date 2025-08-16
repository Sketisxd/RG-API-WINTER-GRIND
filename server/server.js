const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
require('dotenv').config();

const NodeCache = require("node-cache")

const myCache = new NodeCache({ stdTTL: 10 })
const matchHistoryListCache = new NodeCache({ stdTTL: 60 })
const matchCache = new NodeCache({ stdTTL: 60 })
const summonerV4Cache = new NodeCache({ stdTTL: 60 })
const accountIDCache = new NodeCache({ stdTTL: 60 })


app.use(cors())


const API_KEY = process.env.API_KEY;
// local api key puuids( puuid changes based on the api key.)
// const playerPUUIDS =
//     [
//         "N2xOnAa7xO0HoLJfJEknJhxmi13egN44jic-zAmBgt6OsZyFhEMvniAYyDPCESN4yoOS4ZCyxD6UZQ", // sketis
//         "hazEn4PIfVpQxjfS0ovP9fO5RJIibcjCqCgP4N4aHuX_cY3yrcf5efXA3kWqqgtCZYdFwqLDriyrnA", // i love cheese
//         "46tIpTAPcb7vHU_GlOlLTFDGdJzsOZXI-qnnfl92qQKoU5Kl_4-Suo4BD5JB3I9pyrnDcAxOvp2bxQ", // quartiz
//         "8MkSuFnpZgZXnXxoL0bZghO1mVAuK_bDSl06_OMRUXnW8TnlSrkJfQ4PyKxQlinv1QDsalvaTTq9Hg", //killer362
//         "KlcrI1j6Un4Nrcf5ehuvqLzwyDzRLfOA3-EPKgvidmA2YIMxQUSxxKhz_WKC-Q2nBNdCaqMpN0Gg_Q", // luxol
//         "9tOZsvvdKZpbJ9e-eyZdcd6n43cj37XemK5J38VVtpL2vu017Lk0DDW5E6B_kLZ0m67j66vhEQGTbg", // tankas evansas
//         "VY_kS6WBy_6rwcRmLnkIPxVxB5Xd8Pb5xILdahEjEg_xp4dKdzthohOwiF8ALybRlglwXRXwHPGrCA", // midnight villain
//         "6ceHpHAvf-T0zrJrXQWvq13yggTVo5-U9YG6NK39GbqVjcDj6rE8AEPJZs57dJ-BNi6-gG3kHQ5ong", // leiker
//         "IM9X4j9r8n3Q32K-xlnfrrFthqOfmLx-BeBYWaV5gG06IR9FAlhhJ3WjXcQ1sdKLCZbSJj5x6k-ACQ", // themisster
//     ]

const playerPUUIDS = [
    "zJuF3yiP87YPy2EsMFjJl7rLia-Q2ymDOiKuTMAkH6jrOmUrIB5VIvWNR3UE43Dw_DNOr-B5tCXR0Q",
    "MgBnrMdEFOTEivbfrLg51LjSfr4iMFgYSm5Z3trSFgHjZ_fTZfNg6ER-YzLK7axzOIBuU4OntmP_UA",
    "UmNPiOLUtEwky8E_7mxCP2qBcA5rLHX6boEU_kkFdZ8FJqfmyyR2GFYwuePNPYDajkC8ZJH8qfurEA",
    "3Pzn-WQi6F6cG4_fdMsOsNWV0jzDWT_W_LMTgLK-CdYdLfpF17LOchd5TH5gXMd2AlvPDkcWP73nGg",
    "loW2q30OfRUv-muUEVlFPSPa1LftY1tl0mszazIAyE8vY5SODsv-WjXZ2935pOxPsqMvmbzhDmDmYg",
    "TTR2eiFjHMm5KIoNDhjVUtdgJCGKuhnzYrQDz4lhkNuYRDcXY-RIRFI6Ttlp01HRq5U7ZV0qnA2O5w",
    "A7xBTdXuGz3gaUKACMV5B3gaz7-u10AvPYjowSwOohObfKoQiSW4MEKdS3Jk-9os6ZkPwerSijL0qw",
    "ghzWVDpIH5Tu20C2LsEn1wIH6HMjw0wRS0AMT48oCgKG4d5RufGLa5TTBhoyTr5DUdRs6qjbkX1URg"
]

const playerNames = [
    'test',
    'Sketis',
    'Requiem',
    'Magas',
    'Jungleris',
    'Quartiz',
    'Luxol',
    'Protagonistas',
    'Not Responding',
    'Not Responding'
]


// app.get('/api/getPUIDS', async (req, res) => {
//     let playerPUUIDS2 = []
//     for (let i = 0; i < playerNames.length; i++) {
//          await axios.get(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${playerNames[i]}?api_key=${API_KEY}`)
//             .then(response => {
//                 playerPUUIDS2.push(response.data.puuid)
//             })
//             .catch(err => err)
        
//     }
//     res.json(playerPUUIDS2)
// })

app.get('/api/getmatchlist', async (req, res) => {

    let puuid = req.query.username
    let allMatchesDetails = []

    if (matchHistoryListCache.has(puuid)) {
        console.log("Getting Match list from cache")
        playersMatchList = (matchHistoryListCache.get(puuid))
    }

    else {
        playerMatchList = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&type=ranked&start=0&count=10&api_key=${API_KEY}`)
            .then(response => response.data)
            .catch(err => err)
        matchHistoryListCache.set(puuid, allMatchesDetails)
    }


    let playerData
    if (matchCache.has(puuid)) {
        console.log("Getting match history from cache")
        return res.json(matchCache.get(puuid))
    }

    else {
        for (let i = 0; i < playerMatchList.length; i++) {
            matchInfo = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${playerMatchList[i]}?api_key=${API_KEY}`)
                .then(response => response.data)
                .catch(err => err)

            let index = matchInfo.metadata.participants.findIndex(x => x == puuid)
            playerData = matchInfo.info.participants[index]
            playerData['gameDate'] = matchInfo.info.gameCreation
            allMatchesDetails.push(playerData)
        }
        matchCache.set(puuid, allMatchesDetails)
        res.json(allMatchesDetails)
    }
})


function getPlayerID(playerPUUID) {

    return axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${playerPUUID}?api_key=${API_KEY}`)
        .then(response => {


            return {
                id: response.data.id,

                profileIcon: response.data.profileIconId,

                puuid: playerPUUID,
            }})
            .catch(error => {

            if (error.response && error.response.status === 503) {
                console.log('PUUID Service Unavailable');

            } else {
                console.error('PUUID An error occurred:', error.message);

            }
        });
}



app.get('/api/getrankinfo', async (req, res) => {

    let player = [{
        id: undefined,
        profileIcon: undefined,
        puuid: undefined
    }]
    if (accountIDCache.has("ids")) {
        console.log("Getting Account IDS from Cache")
        player = myCache.get("ids")
    }
    else {
        for (let i = 0; i < playerPUUIDS.length; i++) {
            player.push(await getPlayerID(playerPUUIDS[i]))
        }
        accountIDCache.set("ids", player)
    }

    let playerAllRanks = []
    let rankedSoloFiltered = []

    if (summonerV4Cache.has("summonerRanks")) {
        console.log("Getting Summoner v4 from cache")
        return res.json(summonerV4Cache.get("summonerRanks"))
    }
    else {


        for (let i = 0; i < player.length; i++) {


            if (player[i].id != undefined) {

                playerAllRanks = await axios.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${player[i].id}?api_key=${API_KEY}`)
                    .then(response => response.data)
                    .catch(error => {

                        if (error.response && error.response.status === 503) {
                            console.log('Service Unavailable');

                        } else {
                            console.error('An error occurred:', error.message);

                        }
                    });


                if (playerAllRanks != undefined) {

                    for (let j = 0; j < playerAllRanks.length; j++) {
                        if (playerAllRanks[j].queueType == "RANKED_SOLO_5x5") {
                            playerAllRanks[j]['profileIcon'] = player[i].profileIcon;
                            playerAllRanks[j]['puuid'] = player[i].puuid;
                            playerAllRanks[j]['summonerName'] = playerNames[i]
                            rankedSoloFiltered.push(playerAllRanks[j])
                        }
                    }
                }
            }
        }
        summonerV4Cache.set("summonerRanks", rankedSoloFiltered)
        res.json(rankedSoloFiltered)

    }
})

// app.listen(3000, function () {
//     console.log("Server started on port 3000")
// }) 
// Export the app instead of listening
export default app;