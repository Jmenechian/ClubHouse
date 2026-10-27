package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type teamResponse struct {
	Name    string         `json:"name"`
	Players []playerDetail `json:"players"`
}

type playerDetail struct {
	Name     string `json:"name"`
	Position string `json:"position"`
}

func positionName(position Position) string {
	switch position {
	case Goalkeeper:
		return "Goalkeeper"
	case Defender:
		return "Defender"
	case Midfielder:
		return "Midfielder"
	case Attacker:
		return "Attacker"
	default:
		return "Unknown"
	}
}

func main() {
	team := createTeam("BVB")

	http.HandleFunc("GET /api/team", func(w http.ResponseWriter, r *http.Request) {
		players := make([]playerDetail, 0, len(team.players))
		for _, player := range team.players {
			players = append(players, playerDetail{
				Name:     player.name,
				Position: positionName(player.position),
			})
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(teamResponse{Name: team.name, Players: players}); err != nil {
			http.Error(w, "could not encode team", http.StatusInternalServerError)
		}
	})

	log.Println("Go API listening on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
