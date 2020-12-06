const Hayaoshi = require('../Hayaoshi/Hayaoshi');

module.exports = class Session {
    constructor(ioRoom, options) {
        this.hayaoshi = new Hayaoshi();
        this.masterId = null;
        this.isResetButtonMasterOnly = options.isResetButtonMasterOnly ?? false;
        this.isSoundButtonMasterOnly = options.isSoundButtonMasterOnly ?? false;
        this.room = ioRoom;
        this.playSound = true;
        this.room.on('connection', socket => this.connection(socket));
    }

    connection(socket) {
        socket.use(packet => {
            const apiName = packet[0];

            if (apiName === 'editingName' && !this.masterId) {
                // 一番最初にコネクション張った人はマスター
                this.masterId = socket.id;
            }

            if (apiName === 'joinSession') {
                this.joinSession(socket, packet[1], this.masterId === socket.id);
            }

            if (apiName === 'reset') {
                this.reset(socket);
            }

            if (apiName === 'pushButton') {
                this.pushButton(socket);
            }

            if (apiName === 'playSound') {
                this.emitPlaySound(socket, packet[1]);
            }
        })

        socket.on('disconnect', () => {
            if (socket.id === this.masterId) {
                // ルームマスターが切断された
                if (this.isResetButtonMasterOnly) {
                    this.isResetButtonMasterOnly = false;
                }
                if (this.isSoundButtonMasterOnly) {
                    this.isSoundButtonMasterOnly = false;
                }
            }
            this.emitSessionStatus();
        })
    }

    joinSession(socket, name, isMaster) {
        this.hayaoshi.joinPlayers(socket.id, name, isMaster);
        this.emitSessionStatus(socket);
    }

    pushButton(socket) {
        if (this.hayaoshi.isPlayerIdExist(socket.id)) {
            const pushedPlayerDetail = this.hayaoshi.buttonPushed(socket.id);
            this.emitButtonPushed(socket, pushedPlayerDetail);
        }
    }

    reset(socket) {
        if (!this.isResetButtonMasterOnly || this.hayaoshi.isPlayerIdMaster(socket.id)) {
            this.hayaoshi.resetPlayers();
            this.emitReset();
        }
        this.emitSessionStatus(socket);
    }

    emitSessionStatus() {
        this.room.emit('sessionStatus', {
            isResetButtonMasterOnly: this.isResetButtonMasterOnly,
            isSoundButtonMasterOnly: this.isSoundButtonMasterOnly,
            players: this.hayaoshi.createPlayerDetails()
        });
    }

    emitButtonPushed(socket, playerDetail) {
        this.room.emit('buttonPushed', playerDetail);
    }

    emitReset() {
        this.room.emit('reset');
    }

    emitPlaySound(socket, soundUrl) {
        if (this.playSound && (!this.isSoundButtonMasterOnly || this.hayaoshi.isPlayerIdMaster(socket.id))) {
            this.playSound = false;
            this.room.emit('playSound', soundUrl);
            setTimeout(() => {
                this.playSound = true;
            }, 3000);
        }
    }
}
