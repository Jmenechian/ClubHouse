# Clubhouse FC — Project Roadmap

## Project goal

Build a football club management / incremental game where the player creates a fictional club, develops its squad and facilities, and plays quick automated matches to earn rewards.

The player writes and understands the project. Work in small objectives, review each useful milestone, and avoid jumping straight into a complete game.

## Working agreement

- Do not write or modify code unless explicitly asked.
- Help define behavior, explain concepts, and review the player's implementation for bugs and likely problems.
- TDD is optional. Small, understandable objectives are the priority.
- When asked to change code, keep the change focused and explain the reasoning.

## Initial scope

- One club and one local save.
- Club name and a randomly generated starting squad of 11 players.
- Each player has a name, one of four position groups, and three ratings: attack, defense, and goalkeeping.
- Position groups: goalkeeper, defender, midfielder, forward.
- A basic screen to inspect the roster.
- Save and reload the same club and players.

Leagues, cups, fatigue/stamina, tactics, elaborate match presentation, and multiple saved clubs are outside the initial scope. Later progression could become a challenge ladder or a more realistic competition structure; that decision stays open.

## Stack direction

- Backend: Go.
- Frontend: React with TypeScript.
- Local persistence: SQLite is the current preference; a JSON file is an acceptable simpler first step.
- HTTP framework: undecided. Start by considering Go's standard net/http package; choose Gin only if it provides a concrete benefit.

## Milestone 1 — Create a club worth opening again

1. **Define the starting data.** A club has a name and 11 players. Each player has a name, position group, attack, defense, and goalkeeping.
2. **Generate one player.** Produce a random name and ratings within an agreed range. Position should influence ratings so goalkeepers and outfield players tend to have different strengths.
3. **Generate a starting squad.** Create 1 goalkeeper, 4 defenders, 4 midfielders, and 2 forwards. This is a generation rule; formation selection comes later.
4. **Create a named club.** Connect club creation to squad generation.
5. **Show the club and roster.** Build a basic React screen with the club name and a readable player table.
6. **Save and reopen it.** Restarting the application brings back the same club and players.

**Done when:** the player can create a club, inspect its squad, close the application, and return to the same saved club.

## Milestone 2 — Make the squad feel like yours

7. **Inspect an individual player.** Select a player from the roster to see their details.
8. **Train a player.** Choose one rating to improve through a simple action.
9. **Save the improvement.** Training survives a restart.
10. **Introduce one training limit.** Decide what training costs or when it becomes available so improvement involves a choice.

**Done when:** the player can choose someone to develop and see a lasting change.

## Milestone 3 — Complete the first playable loop

11. **Generate an opposing team.** Reuse the squad-generation rules.
12. **Resolve one quick match.** Use a simple calculation based on team ratings, with some randomness.
13. **Show the result.** Display a score and a brief explanation of what happened.
14. **Award a single currency.** Playing a match earns a reward.
15. **Spend that reward.** Use it for training, then introduce one facility upgrade that improves training.

**Done when:** the player can play, earn, improve, and play again, with progress saved.

## Decisions to make before the first implementation

- Choose the rating scale and the initial rating ranges for each position.
- Define a few example players to make the generation rules concrete.
- Decide how names are generated; a small fictional name list is sufficient initially.
- Define basic club-name validation when implementing club creation.
- Select JSON or SQLite before implementing persistence.

## Suggested first development objective

Define the player data and generate one player in Go. Keep this independent of HTTP, React, and persistence so the game rules are easy to understand. Then extend it to the 11-player squad.

A local Git repository is enough to begin; a hosted remote can be added whenever useful. Add project setup instructions as the actual setup takes shape.
