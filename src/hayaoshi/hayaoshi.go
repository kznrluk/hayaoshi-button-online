package hayaoshi

import (
	"errors"
	"sort"
)

type Player struct {
	Id         string
	Name       string
	PushedRank int
}

type Hayaoshi struct {
	Players []Player
}

func ButtonPushed(players []Player, id string) ([]Player, error) {
	var pushedPlayer Player
	for _, v := range players {
		if v.Id == id {
			pushedPlayer = v
		}
	}

	if pushedPlayer.Id == "" {
		return nil, errors.New("存在しないプレイヤーです。")
	}

	var pushedRank int = 0
	for _, v := range players {
		if v.PushedRank != 0 {
			pushedRank++
		}
	}

	pushedPlayer.PushedRank = pushedRank

	sort.Slice(players, func(i, j int) bool {
		return players[i].PushedRank < players[j].PushedRank
	})

	var pushedPlayers []Player
	for _, v := range players {
		if pushedRank != 0 {
			pushedPlayers = append(pushedPlayers, v)
		}
	}

	return pushedPlayers, nil
}

func ResetPlayers(players []Player) {
	for _, v := range players {
		v.PushedRank = 0
	}
}
