import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'


export const Home = () => {

    const [playerData, setPlayerData] = useState([])
    const [loading, setLoading] = useState(true)
    const [displayError, setDisplayError] = useState(null)


    useEffect(() => {
        axios.get("/api/player-data")
            .then(function (response) {
                setPlayerData(response.data)
                setLoading(false)
            })
            .catch(setDisplayError("Riot Games api not working currently :("))
    }, [])


function winRate(wins, losses) {
   return Math.ceil(wins / (losses + wins) * 100)
}
    let divisionSortOrder = ['GRANDMASTER', 'MASTER', 'DIAMOND', "EMERALD", "PLATINUM", "GOLD", "SILVER", "BRONZE", "IRON"]
    let rankSortOrder = ['I', 'II', 'III', 'IV']

    const playerDataOrdered = playerData.sort(function (a, b) {
        const aLeague = a.leagueData[0] || {}
        const bLeague = b.leagueData[0] || {}
       return (
            divisionSortOrder.indexOf(aLeague.tier) - divisionSortOrder.indexOf(bLeague.tier) ||
            rankSortOrder.indexOf(aLeague.rank) - rankSortOrder.indexOf(bLeague.rank) ||
            (bLeague.leaguePoints || 0) - (aLeague.leaguePoints || 0)
        )
    })

    const playerElements = playerDataOrdered.map((player, index) => {
        const summoner = player.summonerData || {}
        const league = player.leagueData[0] || {}
        return (
            <div className=" playerTableAll text-sm ">
            

                    <div className="playerTableElement flex gap-4 border border-black p-2 cursor-pointer ">
                        <div className="imgInfo flex gap-1">
                            <p>{index + 1}.</p>
                            <img className="w-20 h-20 border border-black" src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${summoner.profileIconId}.png`} />
                        </div>

                        <div className="flex flex-col">
                            <h3>{player.name}</h3>
                            <p>{league.tier} {league.rank} {league.leaguePoints} LP  </p>
                            {/* <p className="text-xs mt-5">View match history</p> */}
                        </div>

                        <div className="winrateInfo flex gap-1 ml-auto">
                            <span className="">{league.wins}W </span>
                            <span className="">{league.losses}L |</span>
                            <p className={winRate(league.wins, league.losses)>=50 ? 'text-green-300' : 'text-red-600'}>{winRate(league.wins, league.losses)} %</p>
                        </div>
                    </div>
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
