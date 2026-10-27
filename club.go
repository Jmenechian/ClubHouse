package main

type Club struct {
	name    string
	players []Player
}

func newClub(name string) *Club {
	return &Club{name: name}
}

func createTeam(name string) *Club {
	club := newClub(name)

	club.addPlayer(createPlayer("1", Goalkeeper))
	club.addPlayer(createPlayer("2", Defender))
	club.addPlayer(createPlayer("3", Defender))
	club.addPlayer(createPlayer("4", Defender))
	club.addPlayer(createPlayer("5", Defender))
	club.addPlayer(createPlayer("6", Midfielder))
	club.addPlayer(createPlayer("7", Midfielder))
	club.addPlayer(createPlayer("8", Midfielder))
	club.addPlayer(createPlayer("9", Midfielder))
	club.addPlayer(createPlayer("10", Attacker))
	club.addPlayer(createPlayer("11", Attacker))

	return club
}

func (c *Club) addPlayer(player Player) {
	c.players = append(c.players, player)
}
