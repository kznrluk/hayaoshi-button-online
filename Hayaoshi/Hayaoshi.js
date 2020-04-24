const Player = require('./Player');


module.exports = class Hayaoshi {
    constructor() {
        this.players = [];
    }

    joinPlayers(id, name) {
        this.players.push(new Player(id, name));
    }

    buttonPushed(pushedPlayerId) {
        const pushedPlayer = this.players.find(p => p.id === pushedPlayerId);
        if (!pushedPlayer) {
            throw new Error('存在しないプレイヤーです。');
        }

        const pushedPlayers = this.players.filter(p => p.pushedRank !== null);
        pushedPlayer.buttonPushed(pushedPlayers.length);

        return this.players
            .filter(p => p.pushedRank !== null)
            .sort((a, b) => {
                if (a.pushedRank === b.pushedRank) return 0;
                if (a.pushedRank === null) return -1;
                if (b.pushedRank === null) return 1;
                return a.pushedRank - b.pushedRank;
            }).map(p => p.createPlayerDetails());
    }

    isPlayerIdExist(id) {
        return this.players.some(p => p.id === id);
    }

    resetPlayers() {
        this.players.forEach(p => p.reset());
    }

    createSessionDetails() {
        return {
            players: this.players.map(p => p.createPlayerDetails()),
        }
    }
}
