let isMute = true;
let isButtonEnabled = true;

const getSessionId = () => {
    return new URLSearchParams(location.href.split('?')[1]).get('sessionId');
};

const playerNameInput = document.getElementById('playerName');
const joinButton = document.getElementById('join');
const pushButton = document.getElementById('push');
const resetButton = document.getElementById('reset');
const displayPushedPlayers = document.getElementById('displayPushedPlayers');

const socket = io.connect('/session/' + getSessionId());

const enableButton = (bool) => {
    isButtonEnabled = bool;
    pushButton.className = (bool)
        ? pushButton.className.replace('disabled', 'pushable')
        : pushButton.className.replace('pushable', 'disabled');
}

socket.on('sessionStatus', ({ players }) => {
    const ownData = players.find(p => p.id === socket.id);
    if (ownData) {
        document.getElementById('playGame').style.display = "flex";
        [joinButton, playerNameInput].forEach(e => e.disabled = true);
    }
});

socket.on('buttonPushed', (players) => {
    if (!isMute) {
        new Audio('/sound/buzzer.wav').play();
    }

    const texts = players
        .filter(player => player.pushedRank !== null)
        .map(player => {
            if (player.id === socket.id) {
                enableButton(false);
            }
            const elm = document.createElement('p');
            elm.className = 'displayPushedPlayerName';
            elm.textContent = `${player.name}さんが${player.pushedRank+1}番目にボタンを押しました`;
            return elm;
        });

    displayPushedPlayers.innerHTML = '';
    displayPushedPlayers.append(...texts);
});

socket.on('reset', () => {
    enableButton(true);
    displayPushedPlayers.innerHTML = '';
});

joinButton.addEventListener('click', (event) => {
    const playerName = playerNameInput.value;
    const loginScreen = document.getElementById('loginScreenWrap');
    loginScreen.style.display = 'none';
    socket.emit('joinSession', playerName);
});

pushButton.addEventListener('click', (event) => {
    if (isButtonEnabled) {
        socket.emit('pushButton');
    }
})

resetButton.addEventListener('click', (event) => {
    socket.emit('reset');
})

document.getElementById('share_button').addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: '早押しボタンオンライン',
            text: '一緒に早押しボタンで遊びませんか？',
            url: location.href,
        })
    } else {
        alert('友達にリンクを送って、部屋に招待しよう！');
    }
});

document.getElementById('volume_button').addEventListener('click', (ev) => {
    const muteIconClass = 'fas fa-volume-mute';
    const unmuteIconClass = 'fas fa-volume-up';
    isMute = !isMute;
    document.getElementById('volume_button_icon').className = isMute ? muteIconClass : unmuteIconClass;
});

document.getElementById('image_button').addEventListener('click', () => {
    document.body.style.backgroundImage = `url("https://source.unsplash.com/random?q=${Math.random()}")`;
});
