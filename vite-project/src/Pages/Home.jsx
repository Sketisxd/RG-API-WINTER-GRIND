import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'


export const Home = () => {

    const [backendData, setBackendData] = useState([{}])
    const [loading, setLoading] = useState(true)
    const [displayError, setDisplayError] = useState(null)


    console.log(backendData)


    useEffect(() => {
        axios.get("https://riotgamesapi-stats.onrender.com/api/player-data")
            .then(function (response) {
                setBackendData(response.data)
                setLoading(false)
            })
            .catch(setDisplayError("Riot Games api not working currently :("))
    }, [])


function winRate(wins, losses) {
   return Math.ceil(wins / (losses + wins) * 100)
}
    let divisionSortOrder = ['GRANDMASTER', 'MASTER', 'DIAMOND', "EMERALD", "PLATINUM", "GOLD", "SILVER", "BRONZE", "IRON"]
    let rankSortOrder = ['I', 'II', 'III', 'IV']

    const backendDataOrdered = backendData.sort(function (a, b) {
        return (
            divisionSortOrder.indexOf(a.tier) - divisionSortOrder.indexOf(b.tier)
            || rankSortOrder.indexOf(a.rank) - rankSortOrder.indexOf(b.rank)
            || b.leaguePoints - a.leaguePoints
        )
    })

    const playerElements = backendDataOrdered.map((player, index) => {

        return (
            <div className=" playerTableAll text-sm ">
                <Link to={`/History/${player.summonerName}/${player.puuid}`} key={player.summonerName}>

                    <div className="playerTableElement flex gap-4 border border-black p-2 ">
                        <div className="imgInfo flex gap-1">
                            <p>{index + 1}.</p>
                            <img className="w-20 h-20 border border-black" src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${player.profileIcon}.png`} />
                        </div>
                        <div className="flex flex-col">
                            <h3>{player.summonerName}</h3>
                            <p>{player.tier} {player.rank} {player.leaguePoints} LP  </p>
                            <p className="text-xs mt-5">View match history</p>
                        </div>
                        <div className="winrateInfo flex gap-1 ml-auto">
                            <span className="">{player.wins}W </span>
                            <span className="">{player.losses}L |</span>
                            <p className={winRate(player.wins, player.losses)>=50 ? 'text-green-300' : 'text-red-600'}>{winRate(player.wins, player.losses)} %</p>
                        </div>
                    </div>
                </Link>
            </div>
        )
    })
    return (
        <>
            <section className="home">
                <div className="playerTable grid justify-center">
                    <h3 className='text-center mb-5'>Ranked Solo Table</h3>
                    {loading == true ?
                        <>
                            <p>Loading...</p >
                        </>
                        :
                        (
                            <div className="playerElementsAll flex flex-col gap-3">
                                {playerElements}
                            </div>
                        )}
                </div>
            </section >
        </>
    )
}
