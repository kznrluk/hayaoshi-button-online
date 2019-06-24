const Session = require('./Session');

module.exports = class Rooms {
    constructor(io) {
        this.io = io;
        this.rooms = [];
    }

    createNewRoom() {
        const id = this.rooms.length + 1;
        this.rooms.push(new Session(this.io.of(`/session/${id}`)));
        return id;
    }
}
