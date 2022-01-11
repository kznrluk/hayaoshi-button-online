const express = require('express');
const Rooms = require('./Session/Rooms');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Passwords = require('./Session/Passwords');
const getStore = require('./Store/Store');

app.use(express.static('static'));

const rooms = new Rooms(io);
const pass = new Passwords();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/createPassword', (req, res) => {
    const sessionId = req.query.sessionId;
    const password = pass.createPassword(sessionId);
    res.json({ password });
});

app.get('/getSessionIdFromPassword', (req, res) => {
    const password = req.query.pass;
    const sessionId = pass.getSessionId(password);
    if (sessionId) {
        res.json({ sessionId });
    } else {
        res.json({ sessionId: false });
    }
});

app.get('/createNewRoom', (req, res) => {
    const isResetButtonMasterOnly = req.query.isResetButtonMasterOnly === 'true';
    const isSoundButtonMasterOnly = req.query.isSoundButtonMasterOnly === 'true';
    const isSimpleBackground = req.query.isSimpleBackground === 'true';
    const roomId = rooms.createNewRoom({ isResetButtonMasterOnly, isSoundButtonMasterOnly, isSimpleBackground });
    res.redirect(`/session.html?sessionId=${roomId}`);
});

const serverOpenDate = new Date().toString();
app.get('/analytics', (req, res) => {
    const store = getStore();
    res.json({
        roomCount: rooms.rooms.length,
        openDate: serverOpenDate,
        ...store.data()
    });
});

http.listen(3000);
console.log('Server listening....');
