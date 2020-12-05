const Session = require('./Session');
const uuid = require('uuid');

module.exports = class Rooms {
    constructor(io) {
        this.io = io;
        this.rooms = [];
    }

    createNewRoom(options = {}) {
        const id = uuid.v4();
        this.rooms.push(new Session(this.io.of(`/session/${id}`), options));
        return id;
    }
}
