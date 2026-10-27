package main

import "math/rand"

type Ratings struct {
	attack  int
	defence int
	gk      int
}

func createRatings() Ratings {
	ratings := Ratings{
		attack:  rand.Intn(100),
		defence: rand.Intn(100),
		gk:      rand.Intn(100),
	}
	return ratings
}

type Position int

const (
	Attacker Position = iota
	Defender
	Midfielder
	Goalkeeper
)

type Player struct {
	name     string
	position Position
	ratings  Ratings
}

func createPlayer(name string, position Position) Player {
	player := Player{
		name:     name,
		position: position,
		ratings:  createRatings(),
	}

	return player
}
