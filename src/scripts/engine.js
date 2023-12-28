let playButton = document.querySelector("#playbtn");
let myModal = document.querySelector(".modal");
let modalStatus = document.querySelector("#modal-status");
let playerTime = document.querySelector(".modal-playerPoints span:nth-child(1)");
let playerScore = document.querySelector(".modal-playerPoints span:nth-child(2)");
let playerLife = document.querySelector(".modal-playerPoints span:nth-child(3)");

const state = {
    view: {
        life: document.querySelector("#life"),
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeleft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
    },

    values: {
        life: 3,
        gameVelocity: 635,
        hitPosition: null,
        result: 0,
        currentTime: 60,
        bgMusic: null,
    },

    actions: {
        timerId: 0,
        countDownTimerID: null,
    }
};

// GAME OVER AND RESET

function updateScore() {
    playerScore.textContent = "Score:" + state.values.result;

    state.values.result = 0;
    state.view.score.textContent = state.values.result;
}

function updateLife() {
    playerLife.textContent = "Life:" + state.values.life;

    state.values.life = 3;
    state.view.life.textContent = "x" + state.values.life;
}

function updateTime() {
    playerTime.textContent = "Time:" + state.values.currentTime;

    state.values.currentTime = 60;
    state.view.timeleft.textContent = state.values.currentTime;
}

function gameOver() {
    stopBackgroundMusic();
    modalStatus.textContent = "GAME OVER";
    myModal.classList.remove('hidden');
    clearInterval(state.actions.countDownTimerID);
    clearInterval(state.actions.timerId);

    // Preencher os campos da modal com os últimos valores e resetar
    updateTime(state.values.currentTime);
    updateScore(state.values.result);
    updateLife(state.values.life);
}

// TIMER

function countDownTimer() {
    state.actions.countDownTimerID = setInterval(countDown, 1000);
}

function countDown() {
    state.values.currentTime--;
    state.view.timeleft.textContent = state.values.currentTime;

    if(state.values.currentTime <= 0) {
        gameOver();
    }
}

// SOUNDS AND MUSIC

function stopBackgroundMusic() {
    state.values.bgMusic.pause();
}

function playBackgroundMusic(audioName, typeAudio, volume, loopChoice) {
    let audio = new Audio(`./src/audios/${audioName}.${typeAudio}`);
    audio.volume = volume;
    audio.loop = loopChoice;
    state.values.bgMusic = audio;
    state.values.bgMusic.play();
}

function playSound(audioName, typeAudio, volume, loopChoice) {
    let audio = new Audio(`./src/audios/${audioName}.${typeAudio}`);
    audio.volume = volume;
    audio.loop = loopChoice;
    audio.play();
}

// SHOW ENEMY

function moveEnemy() {
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

// HIT BOX

function removeListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.removeEventListener("mousedown", handleSquareClick);
    });
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", handleSquareClick);
    });
}

function handleSquareClick() {
    if (this.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit", "mp3", 0.5, false);
    } else {
        state.values.life--;
        state.view.life.textContent = "x" + state.values.life;
        playSound("death", "mp3", 0.5, false);
        if (state.values.life <= 0) {
            gameOver();
        }
    }
}

// INITIALIZING

function init() {
    moveEnemy();
    countDownTimer();
    addListenerHitBox();
    playBackgroundMusic("bgMusic", "mp3", 0.3, true);
    myModal.classList.add('hidden');
}

playButton.addEventListener("click", () => {
    init();
});
