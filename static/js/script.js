const getSessionId = () => {
    const getParamId = new URLSearchParams(location.href.split('?')[1]).get('sessionId');
    return getParamId;
};

const playerNameInput = document.getElementById('playerName');
const joinButton = document.getElementById('join');
const pushButton = document.getElementById('push');
const resetButton = document.getElementById('reset');
const displayPushedPlayerName = document.getElementById('displayPushedPlayerName');

console.log(getSessionId());
const socket = io.connect('/session/' + getSessionId());

socket.on('sessionStatus', ({ players }) => {
    const ownData = players.find(p => p.id === socket.id);
    if (ownData) {
        document.getElementById('playGame').style.display = "inherit";
        [joinButton, playerNameInput].forEach(e => e.disabled = true);
    }
});

socket.on('buttonPushed', (player) => {
    pushButton.disabled = true;
    displayPushedPlayerName.textContent = `${player.name}さんがボタンを押しました`;
});

socket.on('reset', () => {
    pushButton.disabled = false;
    displayPushedPlayerName.textContent = ``;
});

joinButton.addEventListener('click', (event) => {
    const playerName = playerNameInput.value;
    socket.emit('joinSession', playerName);
});

pushButton.addEventListener('click', (event) => {
    socket.emit('pushButton');
})

resetButton.addEventListener('click', (event) => {
    socket.emit('reset');
})

