import { Game } from "../game";
import { Player } from "../player";
import { GameBoardDOM } from "./gameboard-dom";
import * as ArrHelp from "../arr-help.js";

const SIZE = 10;

export class PlayingDOM {
    constructor() {
        this.isComputerPlay = false;
        this.isDuoPlay = false;

        this.modeChoice();
    }

    modeChoice() {
        const gameContainer = document.createElement("div");
        gameContainer.classList.add("game-container");

        const title = document.createElement("h1");
        title.classList.add("title");
        title.textContent = "BattleShip";

        const modeChoiceBox = document.createElement("div");
        modeChoiceBox.classList.add("mode-choice-box");

        const gameBox = document.createElement("div");
        gameBox.classList.add("game-box");

        const computerButton = document.createElement("button");
        computerButton.textContent = "Play with Computer";
        computerButton.addEventListener("click", () => {
            if(this.isComputerPlay) return;
            if(this.isDuoPlay) {
                this.cleanLastGame();
                this.isDuoPlay = false;
            }
            this.computerPlayDOM();            
        });

        const duoButton = document.createElement("button");
        duoButton.textContent = "Play with Friend";
        duoButton.addEventListener("click", () => {
            if(this.isDuoPlay) return;
            if(this.isComputerPlay) {
                this.cleanLastGame();
                this.isComputerPlay = false;
            }
            this.duoPlayDOM();
        });

        modeChoiceBox.append(computerButton, duoButton);
        gameContainer.append(title, modeChoiceBox, gameBox);
        document.body.append(gameContainer);
    }

    computerPlayDOM() {
        this.isComputerPlay = true;

        const modeChoiceBox = document.querySelector('.mode-choice-box');
        const title = document.querySelector('.title');

        const signalMessage = document.createElement("p");
        signalMessage.classList.add("signal-message");
        signalMessage.textContent = "Place Your ships";
        document.querySelector('.mode-choice-box').insertAdjacentElement('afterend', signalMessage);

        const playerName = ArrHelp.removeSpaces(prompt("Enter your name:", "Some Player") || 'UndefinedPlayer');
        const computerName = "Computer";

        const player = new Player(playerName);
        const computer = new Player(computerName);

        const gameBoardDOMPlayer = new GameBoardDOM(player);
        const gameBoardDOMComputer = new GameBoardDOM(computer);
        let game = new Game(gameBoardDOMPlayer, gameBoardDOMComputer);

        const gbDOMPlayer = game.boardDOM1.gbDOM;
        const gbDOMComputer = game.boardDOM2.gbDOM;

        const playerField = document.createElement("div");
        playerField.classList.add(`field`);
        playerField.classList.add(`${playerName}-field`);
        playerField.append(gbDOMPlayer);

        const computerField = document.createElement("div");
        computerField.classList.add(`field`);
        computerField.classList.add(`${computerName}-field`);
        computerField.append(gbDOMComputer);

        document.querySelector('.game-box').append(playerField, computerField);

        game.startPlacing();
        game.startPlacing('computer');
        this.hideGameBoard(gameBoardDOMComputer);

        const playerNameDOM = document.createElement("p");
        playerNameDOM.classList.add("player-name");
        playerNameDOM.textContent = playerName;
        playerField.append(playerNameDOM);

        const computerNameDOM = document.createElement("p");
        computerNameDOM.classList.add("computer-name-div");
        computerNameDOM.textContent = computerName;
        computerField.append(computerNameDOM);

        const placeBtns = document.createElement('div');
        placeBtns.classList.add("place-btns");
        playerField.append(placeBtns);

        const randomBtn = document.createElement("button");
        randomBtn.addEventListener('click', () => {
            if(game.isGameStart) return;
            game.randomPlace(gameBoardDOMPlayer);
            gameBoardDOMPlayer.placeShips();
        });
        randomBtn.classList.add("random-btn");
        randomBtn.textContent = "Randomise";
        placeBtns.append(randomBtn);

        const infoBox = document.createElement("div");
        infoBox.classList.add("info-box");
        const infoMove = document.createElement("p");
        infoMove.textContent = "Click and hold to move";
        const infoRotate = document.createElement("p");
        infoRotate.textContent = "Double click to rotate";
        infoBox.append(infoMove, infoRotate);
        document.querySelector(".game-container").append(infoBox);

        const gameBtns = document.createElement("div");
        gameBtns.classList.add("game-btns");
        document.querySelector(".game-container").append(gameBtns);

        const playBtn = document.createElement("button");
        playBtn.classList.add("play-btn");
        playBtn.textContent = "Play";
        gameBtns.append(playBtn);

        playBtn.addEventListener('click', () => {
            if(game.isGameStart) return;            
            modeChoiceBox.remove();
            placeBtns.remove();
            infoBox.remove();
            playBtn.remove();
            gbDOMPlayer.classList.add('inactive-board');
            game.playWithComputer();
            document.querySelector(".signal-message").textContent = `${playerName} moves`;
        });

        const resetBtn = document.createElement("button");
        resetBtn.classList.add("reset-btn");
        resetBtn.textContent = "Reset";
        gameBtns.append(resetBtn);

        resetBtn.addEventListener("click", () => {
            gbDOMPlayer.classList.remove('inactive-board');
            gbDOMComputer.classList.remove('inactive-board');
            title.insertAdjacentElement('afterend', modeChoiceBox)
            gameBtns.insertAdjacentElement('beforebegin', infoBox);
            playerNameDOM.insertAdjacentElement('afterend', placeBtns);
            resetBtn.insertAdjacentElement("beforebegin", playBtn);
            game.reset();
            game.placePlayer(1);
            game.placePlayer(2);
            document.querySelector(".signal-message").textContent = "Place Your ships";
            this.hideGameBoard(gameBoardDOMComputer);
        });
    }

    duoPlayDOM() {
        this.isDuoPlay = true;

        const modeChoiceBox = document.querySelector('.mode-choice-box');
        const title = document.querySelector('.title');

        const signalMessage = document.createElement("p");
        signalMessage.classList.add("signal-message");
        signalMessage.textContent = "Place Your ships";
        document.querySelector('.mode-choice-box').insertAdjacentElement('afterend', signalMessage);

        const player1Name = ArrHelp.removeSpaces(prompt("Enter first player's name:", "Some Player1") || 'UndefinedPlayer1');
        const player2Name = ArrHelp.removeSpaces(prompt("Enter second player's name:", "Some Player2") || 'UndefinedPlayer2');

        const player1 = new Player(player1Name);
        const player2 = new Player(player2Name);

        const gameBoardDOMPlayer1 = new GameBoardDOM(player1);
        const gameBoardDOMPlayer2 = new GameBoardDOM(player2);
        let game = new Game(gameBoardDOMPlayer1, gameBoardDOMPlayer2);

        const gbDOMPlayer1 = game.boardDOM1.gbDOM;
        const gbDOMPlayer2 = game.boardDOM2.gbDOM;

        const player1Field = document.createElement("div");
        player1Field.classList.add(`field`);
        player1Field.classList.add(`${player1Name}-field`);
        player1Field.append(gbDOMPlayer1);

        const player2Field = document.createElement("div");
        player2Field.classList.add(`field`);
        player2Field.classList.add(`${player2Name}-field`);
        player2Field.append(gbDOMPlayer2);

        document.querySelector('.game-box').append(player1Field, player2Field);

        game.startPlacing('player', 1);
        game.startPlacing('player', 2);

        const player1NameDOM = document.createElement("p");
        player1NameDOM.classList.add("player-name");
        player1NameDOM.textContent = player1Name;
        player1Field.append(player1NameDOM);

        const player2NameDOM = document.createElement("p");
        player2NameDOM.classList.add("player-name");
        player2NameDOM.textContent = player2Name;
        player2Field.append(player2NameDOM);

        const placeBtns1 = document.createElement('div');
        placeBtns1.classList.add("place-btns");
        player1Field.append(placeBtns1);

        const placeBtns2 = document.createElement('div');
        placeBtns2.classList.add("place-btns");
        player2Field.append(placeBtns2);        

        const randomBtn1 = document.createElement("button");
        randomBtn1.addEventListener('click', () => {
            if(game.isGameStart) return;
            if(this.isGameBoardLock(gameBoardDOMPlayer1)) return;
            game.randomPlace(gameBoardDOMPlayer1);
            gameBoardDOMPlayer1.placeShips();
        });
        randomBtn1.classList.add("random-btn");
        randomBtn1.textContent = "Randomise";

        const hideBtn1 = document.createElement("button");
        hideBtn1.classList.add("hide-btn");
        hideBtn1.textContent = "Hide";
        hideBtn1.addEventListener('click', () => {
            this.hideGameBoard(gameBoardDOMPlayer1);
        })
        placeBtns1.append(randomBtn1, hideBtn1);

        const randomBtn2 = document.createElement("button");
        randomBtn2.addEventListener('click', () => {
            if(game.isGameStart) return;
            if(this.isGameBoardLock(gameBoardDOMPlayer2)) return;
            game.randomPlace(gameBoardDOMPlayer2);
            gameBoardDOMPlayer2.placeShips();
        });
        randomBtn2.classList.add("random-btn");
        randomBtn2.textContent = "Randomise";

        const hideBtn2 = document.createElement("button");
        hideBtn2.classList.add("hide-btn");
        hideBtn2.textContent = "Hide";
        hideBtn2.addEventListener('click', () => {
            this.hideGameBoard(gameBoardDOMPlayer2);
        })
        placeBtns2.append(randomBtn2, hideBtn2);

        const infoBox = document.createElement("div");
        infoBox.classList.add("info-box");
        const infoMove = document.createElement("p");
        infoMove.textContent = "Click and hold to move";
        const infoRotate = document.createElement("p");
        infoRotate.textContent = "Double click to rotate";
        infoBox.append(infoMove, infoRotate);
        document.querySelector(".game-container").append(infoBox);

        const gameBtns = document.createElement("div");
        gameBtns.classList.add("game-btns");
        document.querySelector(".game-container").append(gameBtns);

        const playBtn = document.createElement("button");
        playBtn.classList.add("play-btn");
        playBtn.textContent = "Play";
        gameBtns.append(playBtn);

        playBtn.addEventListener('click', () => {
            if(game.isGameStart) return;
            gbDOMPlayer1.classList.add('inactive-board');
            modeChoiceBox.remove();
            placeBtns1.remove();
            placeBtns2.remove();
            infoBox.remove();
            playBtn.remove();
            game.playDuo();
            document.querySelector(".signal-message").textContent = `${player1Name} moves`;
            this.hideGameBoard(gameBoardDOMPlayer1);
            this.hideGameBoard(gameBoardDOMPlayer2);
        });

        const resetBtn = document.createElement("button");
        resetBtn.classList.add("reset-btn");
        resetBtn.textContent = "Reset";
        gameBtns.append(resetBtn);

        resetBtn.addEventListener("click", () => {
            gbDOMPlayer1.classList.remove('inactive-board');
            gbDOMPlayer2.classList.remove('inactive-board');
            title.insertAdjacentElement('afterend', modeChoiceBox)
            gameBtns.insertAdjacentElement('beforebegin', infoBox);
            player1NameDOM.insertAdjacentElement('afterend', placeBtns1);
            player2NameDOM.insertAdjacentElement('afterend', placeBtns2);
            resetBtn.insertAdjacentElement("beforebegin", playBtn);
            game.reset();
            game.placePlayer(1);
            game.placePlayer(2);
            document.querySelector(".signal-message").textContent = "Place Your ships";
        });
    }

    hideGameBoard(gameBoardDOM) {
        this.lockGameBoard(gameBoardDOM);
        const cells = gameBoardDOM.gbDOM.querySelectorAll('.board-cell');
        cells.forEach(cell => {
            if(!cell.classList.contains('blank-cell')) {
                cell.classList.add('blank-cell');
            }
        });
    }

    lockGameBoard(gameBoardDOM) {
        if(!gameBoardDOM.isLocked) {
            gameBoardDOM.isLocked = true;
        }
    }

    isGameBoardLock(gameBoardDOM) {
        return gameBoardDOM.isLocked;
    }

    cleanLastGame() {
        const signalMessage = document.querySelector('.signal-message');
        signalMessage?.remove();

        const gameBox = document.querySelector('.game-box');
        gameBox?.firstChild.remove();
        gameBox?.lastChild.remove();

        const infoBox = document.querySelector('.info-box');
        infoBox?.remove();

        const gameBtns = document.querySelector('.game-btns');
        gameBtns?.remove();
    }
}