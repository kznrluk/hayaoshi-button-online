const getSessionId = () => {
    const getParamId = new URLSearchParams(location.href.split('?')[1]).get('sessionId');
    return getParamId;
};

const playerNameInput = document.getElementById('playerName');
const joinButton = document.getElementById('join');
const pushButton = document.getElementById('push');
const resetButton = document.getElementById('reset');
const displayPushedPlayerName = document.getElementById('displayPushedPlayerName');

const socket = io.connect('/session/' + getSessionId());

const enableButton = (bool) => {
    pushButton.className = (bool) ? pushButton.className.replace('disabled', 'pushable') : pushButton.className.replace('pushable', 'disabled');
}

socket.on('sessionStatus', ({ players }) => {
    const ownData = players.find(p => p.id === socket.id);
    if (ownData) {
        document.getElementById('playGame').style.display = "inherit";
        [joinButton, playerNameInput].forEach(e => e.disabled = true);
    }
});

socket.on('buttonPushed', (player) => {
    enableButton(false);
    displayPushedPlayerName.textContent = `${player.name}さんがボタンを押しました`;
});

socket.on('reset', () => {
    enableButton(true);
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

