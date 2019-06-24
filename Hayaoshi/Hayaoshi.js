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

        pushedPlayer.buttonPushed();
        return pushedPlayer.createPlayerDetails();
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
