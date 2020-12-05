module.exports = class Player {
    constructor(id, name, isMaster) {
        this.isMaster = isMaster;
        this.id = id;
        this.name = name;
        this.pushedRank = null;
    }

    buttonPushed(rank) {
        this.pushedRank = rank;
    }

    reset() {
        this.pushedRank = null;
    }

    createPlayerDetails() {
        return {
            id: this.id,
            name: this.name,
            pushedRank: this.pushedRank,
            isMaster: this.isMaster,
        }
    }
}
