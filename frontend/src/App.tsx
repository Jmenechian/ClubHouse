import { useEffect, useState } from 'react'
import './App.css'

type Player = {
  name: string
  position: string
}

type Team = {
  name: string
  players: Player[]
}

function App() {
  const [team, setTeam] = useState<Team | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTeam() {
      try {
        const response = await fetch('/api/team')
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data: Team = await response.json()
        setTeam(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load team')
      }
    }

    void loadTeam()
  }, [])

  if (error) {
    return <main><h1>Could not load team</h1><p>{error}. Is the Go server running?</p></main>
  }

  if (!team) {
    return <main><h1>Loading team...</h1></main>
  }

  return (
    <main>
      <h1>{team.name}</h1>
      <p>Welcome to the team.</p>
      <ul>
        {team.players.map((player, index) => (
          <li key={`${player.name}-${index}`}>
            {player.name} — {player.position}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
