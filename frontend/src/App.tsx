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

type PlayerInfo = Player & {
  ratings: {
    attack: number
    defence: number
    gk: number
  }
}

type TrainingType = 'attack' | 'defence' | 'gk'

const formation = [
  { label: 'Forwards', position: 'Attacker', count: 2 },
  { label: 'Midfielders', position: 'Midfielder', count: 4 },
  { label: 'Defenders', position: 'Defender', count: 4 },
  { label: 'Goalkeeper', position: 'Goalkeeper', count: 1 },
]

function App() {
  const [team, setTeam] = useState<Team | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null)
  const [playerError, setPlayerError] = useState<string | null>(null)
  const [loadingPlayer, setLoadingPlayer] = useState(false)
  const [trainingType, setTrainingType] = useState<TrainingType | null>(null)

  useEffect(() => {
    async function loadTeam() {
      try {
        const response = await fetch('/api/team')
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)
        setTeam(await response.json() as Team)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load team')
      }
    }

    void loadTeam()
  }, [])

  async function selectPlayer(player: Player) {
    setSelectedPlayer(player)
    setPlayerInfo(null)
    setPlayerError(null)
    setTrainingType(null)
    setLoadingPlayer(true)

    try {
      // Load the selected player's details and ratings from the Go API.
      const response = await fetch(`/api/player?name=${encodeURIComponent(player.name)}`)
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setPlayerInfo(await response.json() as PlayerInfo)
    } catch (err) {
      setPlayerError(err instanceof Error ? err.message : 'Could not load player details')
    } finally {
      setLoadingPlayer(false)
    }
  }

  async function trainPlayer(type: TrainingType) {
    if (!selectedPlayer) return

    setTrainingType(type)
    setPlayerError(null)

    try {
      const params = new URLSearchParams({ name: selectedPlayer.name, type })
      const response = await fetch(`/api/trainPlayer?${params}`)
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setPlayerInfo(await response.json() as PlayerInfo)
    } catch (err) {
      setPlayerError(err instanceof Error ? err.message : 'Could not train player')
    } finally {
      setTrainingType(null)
    }
  }

  if (error) return <main className="status"><h1>Could not load team</h1><p>{error}. Is the Go server running?</p></main>
  if (!team) return <main className="status"><h1>Loading team...</h1></main>

  const usedPlayers = new Set<Player>()

  return (
    <main className="team-page">
      <header className="team-header">
        <div><span className="eyebrow">CLUBHOUSE FC</span><h1>{team.name}</h1></div>
        <p>Welcome to the team.</p>
      </header>

      <div className="squad-layout">
        <section className="pitch-panel" aria-label="Team formation">
          <div className="pitch-heading"><div><span className="eyebrow">SQUAD</span><h2>Starting XI</h2></div><span className="formation-tag">4–4–2</span></div>
          <div className="pitch">
            <div className="pitch-markings" aria-hidden="true"><div className="center-circle" /><div className="center-line" /><div className="penalty-area penalty-top" /><div className="penalty-area penalty-bottom" /></div>
            {formation.map((line) => {
              const players = team.players.filter((player) => player.position === line.position && !usedPlayers.has(player)).slice(0, line.count)
              players.forEach((player) => usedPlayers.add(player))
              return <div className={`formation-line line-${line.position.toLowerCase()}`} key={line.position}>
                {players.map((player, index) => <button className={`player-token ${selectedPlayer === player ? 'is-selected' : ''}`} key={`${player.name}-${index}`} onClick={() => void selectPlayer(player)} aria-pressed={selectedPlayer === player}>
                  <span className="player-shirt" aria-hidden="true">{player.position === 'Goalkeeper' ? 'GK' : player.position.slice(0, 1).toUpperCase()}</span>
                  <span className="player-name">{player.name}</span>
                </button>)}
              </div>
            })}
          </div>
          {usedPlayers.size < team.players.length && <p className="bench-note">{team.players.length - usedPlayers.size} player(s) without a formation spot</p>}
        </section>

        <aside className="details-panel" aria-live="polite">
          {!selectedPlayer ? <div className="empty-details"><span className="detail-icon">＋</span><h2>Player details</h2><p>Select a player on the pitch to view their profile and stats.</p></div> : <>
            <span className="eyebrow">PLAYER PROFILE</span><h2>{selectedPlayer.name}</h2><p className="position-label">{selectedPlayer.position}</p>
            {loadingPlayer && <p className="detail-message">Loading player stats…</p>}
            {playerError && <p className="detail-error">Could not load details: {playerError}</p>}
            {playerInfo && <div className="stats-list">
              <h3>Ratings</h3>
              <Rating label="Attack" value={playerInfo.ratings.attack} onTrain={() => void trainPlayer('attack')} disabled={trainingType !== null} loading={trainingType === 'attack'} />
              <Rating label="Defence" value={playerInfo.ratings.defence} onTrain={() => void trainPlayer('defence')} disabled={trainingType !== null} loading={trainingType === 'defence'} />
              <Rating label="Goalkeeping" value={playerInfo.ratings.gk} onTrain={() => void trainPlayer('gk')} disabled={trainingType !== null} loading={trainingType === 'gk'} />
            </div>}
          </>}
        </aside>
      </div>
    </main>
  )
}

function Rating({ label, value, onTrain, disabled, loading }: { label: string; value: number; onTrain: () => void; disabled: boolean; loading: boolean }) {
  return <div className="rating"><div className="rating-heading"><span>{label}</span><strong>{value}</strong></div><div className="rating-track"><span style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} /></div><button className="train-button" type="button" onClick={onTrain} disabled={disabled}>{loading ? 'Training…' : 'Train'}</button></div>
}

export default App
