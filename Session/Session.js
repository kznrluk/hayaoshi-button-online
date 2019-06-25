const Hayaoshi = require('../Hayaoshi/Hayaoshi');

module.exports = class Session {
    constructor(ioRoom) {
        this.hayaoshi = new Hayaoshi();
        this.room = ioRoom;
        this.room.on('connection', socket => this.connection(socket));
    }

    connection(socket) {
        console.log(socket.id);
        socket.use(packet => {
            const apiName = packet[0];
            if (apiName === 'joinSession') {
                this.joinSession(socket, packet[1]);
            }

            if (apiName === 'reset') {
                this.reset(socket);
            }

            if (apiName === 'pushButton') {
                this.pushButton(socket);
            }
        })
        // ディスコネ時処理
    }

    joinSession(socket, name) {
        this.hayaoshi.joinPlayers(socket.id, name);
        this.emitSessionStatus(socket);
    }

    pushButton(socket) {
        if (this.hayaoshi.isPlayerIdExist(socket.id) && !this.hayaoshi.isButtonPushed()) {
            const pushedPlayerDetail = this.hayaoshi.buttonPushed(socket.id);
            this.emitButtonPushed(socket, pushedPlayerDetail);
        }
    }

    reset(socket) {
        this.hayaoshi.resetPlayers();
        this.emitReset();
        this.emitSessionStatus(socket);
    }

    emitSessionStatus() {
        this.room.emit('sessionStatus', this.hayaoshi.createSessionDetails());
    }

    emitButtonPushed(socket, playerDetail) {
        this.room.emit('buttonPushed', playerDetail);
    }

    emitReset() {
        this.room.emit('reset');
    }
}
