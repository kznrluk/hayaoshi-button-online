module.exports = class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.isPushed = false;
    }

    buttonPushed() {
        this.isPushed = true;
    }

    reset() {
        this.isPushed = false;
    }

    createPlayerDetails() {
        return {
            id: this.id,
            name: this.name,
            isPushed: this.isPushed,
        }
    }
}
