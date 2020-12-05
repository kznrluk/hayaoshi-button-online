const express = require('express');
const Rooms = require('./Session/Rooms');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Passwords = require('./Session/Passwords');

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
    const roomId = rooms.createNewRoom({ isResetButtonMasterOnly });
    res.redirect(`/session.html?sessionId=${roomId}`);
});

app.get('/roomCount', (req, res) => {
    res.send(String(rooms.rooms.length));
});

http.listen(3000);
console.log('Server listening....');
