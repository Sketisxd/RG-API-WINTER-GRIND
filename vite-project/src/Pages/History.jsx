import React from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"
import { Link } from "react-router-dom"

export const History = () => {

  const params = useParams()
  const [matchesList, setMatchesList] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [championStats, setChampionStats] = React.useState([])


  React.useEffect(() => {
    axios.get('/api/getmatchlist', { params: { username: params.id } })
      .then(function (response) {
        setMatchesList(response.data)
        setLoading(false)
        console.log(response.data)
      })
  }, [params])


  function unixTimestamp(time) { // function to convert unixTimestamp to real date.
    const gameDate = new Date(time);
    const currentDate = Date.now();
    let elapsed = (currentDate - gameDate) / 1000

    if (elapsed >= 86400) {
      return (Math.round(elapsed / 86400) + " days ago")
    }
    if (elapsed >= 3600) {
      return (Math.round(elapsed / 3600) + " hours ago")
    }
    if (elapsed >= 60) {
      return (Math.round(elapsed / 60) + " minutes ago")
    }
    else {
      return (Math.round(elapsed) + " seconds ago")
    }
  }

  const matchesListElement = matchesList.map((player, index) => {
    return (
      <div className="flex items-center gap-5 px-5 py-2 border border-black max-w-md min-w-96 " style={{ backgroundColor: player.win ? '#064b80' : "#45192b" }}>
        <div className="text-xs ">
          <p>Ranked Solo</p>
          <p className="t ">{unixTimestamp(player.gameDate)}</p>
          <div className=""></div>
          <p className="mt-3">{player.win ? "Victory" : "Defeat"}</p>
        </div>

        <div className="">
          <img src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${player.championName}.png`} className="w-16"></img>
        </div>

        <div className="flex flex-col text-sm ">
          <p className="">{player.kills}/<span className="">{player.deaths}</span>/{player.assists}</p >
          <p className="">{player.deaths != 0 ? ((player.kills + player.assists) / player.deaths).toFixed(2) : <span className="text-yellow-400 ">Perfect</span>} KDA</p>
        </div>
      </div >

    )
  })
  let player = {
    games:0,
    wins:0,
    losses:0,
  }
  let champion = {}
  matchesList.forEach((match) => {
    player.games++
    if(match.win === true) player.wins++
    else player.losses++
    
    if (champion.hasOwnProperty(match.championName)) {
      champion[match.championName].games++

      if (match.win === true) champion[match.championName].wins++
      else champion[match.championName].losses++

      champion[match.championName].kills += match.kills
      champion[match.championName].assists += match.assists
      champion[match.championName].deaths += match.deaths
    }
    else {
      champion[match.championName] = {
        games: 1,
        wins: 0,
        losses: 0,
        kills: match.kills,
        assists: match.assists,
        deaths: match.deaths,
      };

      if (match.win === true) champion[match.championName].wins++
      else champion[match.championName].losses++

    }

  })

  React.useEffect(() => {
    if (champion) {
     const championArray = Object.entries(champion);
      championArray.sort((a, b) => b[1].games - a[1].games)
      championArray.splice(3)
      setChampionStats(championArray)

    }
  }, [matchesList])
  let championsStatsElements

  championsStatsElements = championStats.map(([championName, championData]) => {
    return (
      <>
        <div className='flex flex-row place-items-center gap-2 text-xs'>
          <img src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${championName}.png`} className="w-8"></img>
          <div className="flex flex-col">
            <p>{(championData.wins / championData.games * 100).toFixed(0)}% ({championData.wins} W {championData.losses} L)</p>
            <p> {championData.deaths != 0 ? ((championData.kills + championData.assists) / championData.deaths).toFixed(2) : <span className="text-yellow-400 ">Perfect</span>} KDA</p>
          </div>
        </div >
      </>
    )
  })


  return (
    <div className="grid justify-center gap-5 historyContainer ">
      <Link to="/"><button className="border p-2 border-black bg-blue-800">Go back</button></Link>
      <h5>{params.name}</h5>
      <h5>Last 10 matches:</h5>
      {loading ?
        <p>Loading....</p>
        :
        <> <div className="flex gap-5 text-sm bg-gray-900 border border-black p-2 stats">
          <div className='flex gap-5'>
            <p>{player.games}G {player.wins}W {player.losses}L</p>
            {championsStatsElements}
          </div>
        </div>
          <div className="flex flex-col place-items-center gap-2 ">
            {matchesListElement}
          </div>
        </>
      }
    </div>
  )
}
