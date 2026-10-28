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

type playerInfoResponse struct {
	Name     string        `json:"name"`
	Position string        `json:"position"`
	Ratings  ratingsDetail `json:"ratings"`
}

type ratingsDetail struct {
	Attack  int `json:"attack"`
	Defence int `json:"defence"`
	GK      int `json:"gk"`
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

	http.HandleFunc("GET /api/player", func(w http.ResponseWriter, r *http.Request) {
		playerName := r.URL.Query().Get("name")
		if playerName == "" {
			http.Error(w, "missing player name", http.StatusBadRequest)
			return
		}

		player, found := team.getPlayerByName(playerName)
		if !found {
			http.Error(w, "player not found", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(playerInfoResponse{
			Name:     player.name,
			Position: positionName(player.position),
			Ratings: ratingsDetail{
				Attack:  player.ratings.attack,
				Defence: player.ratings.defence,
				GK:      player.ratings.gk,
			},
		}); err != nil {
			http.Error(w, "could not encode player", http.StatusInternalServerError)
		}
	})

	http.HandleFunc("GET /api/trainPlayer", func(w http.ResponseWriter, r *http.Request) {
		playerName := r.URL.Query().Get("name")
		if playerName == "" {
			http.Error(w, "missing player name", http.StatusBadRequest)
			return
		}

		trainingType := r.URL.Query().Get("type")
		if trainingType == "" {
			http.Error(w, "missing training type", http.StatusBadRequest)
			return
		}

		player, found := team.upgradePlayer(playerName, trainingType)
		if !found {
			http.Error(w, "player not found", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(playerInfoResponse{
			Name:     player.name,
			Position: positionName(player.position),
			Ratings: ratingsDetail{
				Attack:  player.ratings.attack,
				Defence: player.ratings.defence,
				GK:      player.ratings.gk,
			},
		}); err != nil {
			http.Error(w, "could not encode player", http.StatusInternalServerError)
		}
	})


	log.Println("Go API listening on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
