import * as ArrHelp from "./arr-help.js"

export class Game {
    static SIZE = 10;
    static COUNT_1 = 4;
    static COUNT_2 = 3;
    static COUNT_3 = 2;
    static COUNT_4 = 1;
    static PAUSE_TIME = 700;

    constructor(boardDOM1, boardDOM2) {
        this.boardDOM1 = boardDOM1;        
        this.boardDOM2 = boardDOM2;
        this.isGameStart = false;
        this.isFirstMoves = true;
        this.isPlayed = false;
    }

    changeAxis(gameBoardDOM) {
        const places = gameBoardDOM.player.gameboard.places;
        let lastX1;
        let lastY1;
        let lastX2;
        let lastY2;

        let newX1;
        let newY1;
        let newX2;
        let newY2;

        let lastCursorX;
        let lastCursorY;

        let curShip;
        const board = document.querySelector(`.${gameBoardDOM.player.name}-board`);

        board.addEventListener('dblclick', (e) => {
            if(gameBoardDOM.isLocked) return
            if(this.isGameStart) return;
            if (!e.target.classList.contains('board-cell')) return;
        
            const cell = e.target;

            lastCursorX = cell.dataset.row;
            lastCursorY = cell.dataset.col;
            curShip = gameBoardDOM.player.gameboard.getShipByCoord([lastCursorX, lastCursorY]);                
            if(!curShip) return;
            
            [[lastX1, lastY1], [lastX2, lastY2]] = curShip.coordinates;

            let delta;
            newX1 = lastX1;
            newY1 = lastY1;
            if(lastX1 === lastX2) {
                delta = lastY2 - lastY1;
                newX2 = newX1 + delta;
                newY2 = newY1;
            } else {
                delta = lastX2 - lastX1;
                newY2 = newY1 + delta;
                newX2 = newX1;
            }

            ArrHelp.fillAround([lastX1, lastY1], places, 0);
            ArrHelp.fillAround([lastX2, lastY2], places, 0);
            this.updatePlacesBoard(gameBoardDOM, curShip.coordinates);

            if(ArrHelp.isSuitableToShip([newX1, newY1], places) && ArrHelp.isSuitableToShip([newX2, newY2], places)) {
                curShip.coordinates = [[newX1, newY1], [newX2, newY2]];
                ArrHelp.fillAround([newX1, newY1], places, 1);
                ArrHelp.fillAround([newX2, newY2], places, 1);
                gameBoardDOM.placeShips();
            } else {
                ArrHelp.fillAround([lastX1, lastY1], places, 1);
                ArrHelp.fillAround([lastX2, lastY2], places, 1);
            }

            e.preventDefault();
        });
    }
    
    dragAndDrop(gameBoardDOM) {
        const places = gameBoardDOM.player.gameboard.places;
        let lastX1;
        let lastY1;
        let lastX2;
        let lastY2;

        let newX1;
        let newY1;
        let newX2;
        let newY2;

        let lastCursorX;
        let lastCursorY;

        let newCursorX;
        let newCursorY;

        let isDragging = false;
        let curShip;

        const board = document.querySelector(`.${gameBoardDOM.player.name}-board`);

        board.addEventListener('mousedown', (e) => {
            if(gameBoardDOM.isLocked) return
            if(this.isGameStart) return;
            if (!e.target.classList.contains('board-cell')) return;
        
            const cell = e.target;
            isDragging = true;

            lastCursorX = cell.dataset.row;
            lastCursorY = cell.dataset.col;
            curShip = gameBoardDOM.player.gameboard.getShipByCoord([lastCursorX, lastCursorY]);                
            if(!curShip) return;

            [[lastX1, lastY1], [lastX2, lastY2]] = curShip.coordinates;
            e.preventDefault();
        });

        board.addEventListener('mousemove', (e) => {
            if(gameBoardDOM.isLocked) return
            if(this.isGameStart) return;
            if (!isDragging || !curShip) return;
        
            if (!e.target.classList.contains('board-cell')) return;
            
            const cell = e.target;
            newCursorX = cell.dataset.row;
            newCursorY = cell.dataset.col;
                
            const deltaX = newCursorX - lastCursorX;
            const deltaY = newCursorY - lastCursorY;

            newX1 = lastX1 + deltaX;
            newY1 = lastY1 + deltaY;
            newX2 = lastX2 + deltaX;
            newY2 = lastY2 + deltaY;

            ArrHelp.fillAround([lastX1, lastY1], places, 0);
            ArrHelp.fillAround([lastX2, lastY2], places, 0);
            this.updatePlacesBoard(gameBoardDOM, curShip.coordinates);

            const allCoords = ArrHelp.getShipRange(curShip.coordinates);
            const free = ArrHelp.getFreeCells(places, allCoords);
            free.forEach((coord) => {
                gameBoardDOM.markField(coord, 'good-place')
            });

            e.preventDefault();
        })

        board.addEventListener('mouseup', (e) => {
            if(gameBoardDOM.isLocked) return
            if(this.isGameStart) return;
            if (!isDragging || !curShip) return;
        
            if (!e.target.classList.contains('board-cell')) return;
            
            const cell = e.target;
            newCursorX = cell.dataset.row;
            newCursorY = cell.dataset.col;
                
            const deltaX = newCursorX - lastCursorX;
            const deltaY = newCursorY - lastCursorY;

            newX1 = lastX1 + deltaX;
            newY1 = lastY1 + deltaY;
            newX2 = lastX2 + deltaX;
            newY2 = lastY2 + deltaY;            

            if(ArrHelp.isSuitableToShip([newX1, newY1], places) && ArrHelp.isSuitableToShip([newX2, newY2], places)) {
                curShip.coordinates = [[newX1, newY1], [newX2, newY2]];
                ArrHelp.fillAround([newX1, newY1], places, 1);
                ArrHelp.fillAround([newX2, newY2], places, 1);
                gameBoardDOM.placeShips();
            } else {
                ArrHelp.fillAround([lastX1, lastY1], places, 1);
                ArrHelp.fillAround([lastX2, lastY2], places, 1);
            }

            isDragging = false;
            e.preventDefault();
        })
    }

    startPlacing(mode = 'player', playerNum = 1) {
        if(mode === 'player') {
            this.placePlayer(playerNum);
            if(playerNum == 1) {
                this.dragAndDrop(this.boardDOM1);
                this.changeAxis(this.boardDOM1);
            } else if(playerNum == 2) {
                this.dragAndDrop(this.boardDOM2);
                this.changeAxis(this.boardDOM2);
            }
        } else {
            this.randomPlace(this.boardDOM2);
            this.boardDOM2.placeShips();
        }
    }

    placePlayer(playerNum) {
        if(playerNum == 1) {
            this.randomPlace(this.boardDOM1);
            this.boardDOM1.placeShips();
        } else {
            this.randomPlace(this.boardDOM2);
            this.boardDOM2.placeShips();
        }
    }

    randomPlace(gameBoardDOM) {
        gameBoardDOM.player.gameboard.removeShips();
        this.placeShipsSize(4, Game.COUNT_4, gameBoardDOM);
        this.placeShipsSize(3, Game.COUNT_3, gameBoardDOM);
        this.placeShipsSize(2, Game.COUNT_2, gameBoardDOM);
        this.placeShipsSize(1, Game.COUNT_1, gameBoardDOM);
    }

    placeShipsSize(size, count, gameBoardDOM) {
        const gameboard = gameBoardDOM.player.gameboard;
        const places = gameboard.places;

        for(let i = 0; i < count; i++) {
            let coordX1
            let coordY1;
            let coordX2;
            let coordY2;

            do {
                coordX1 = Math.floor(Math.random() * (Game.SIZE - size + 1));
                coordY1 = Math.floor(Math.random() * (Game.SIZE - size + 1));
                if(Math.random() > 0.5) {
                    coordX2 = coordX1 + size - 1;
                    coordY2 = coordY1;
                } else {
                    coordX2 = coordX1;
                    coordY2 = coordY1 + size - 1;
                }
            } while(!ArrHelp.isSuitableToShip([coordX1, coordY1], places) || !ArrHelp.isSuitableToShip([coordX2, coordY2], places));
            gameboard.place(size, [[coordX1, coordY1], [coordX2, coordY2]]);
            ArrHelp.fillAround([coordX1, coordY1], places, 1);
            ArrHelp.fillAround([coordX2, coordY2], places, 1);  
        }
    }

    updatePlacesBoard(gameBoardDOM, exeptCoords) {
        const ships = gameBoardDOM.player.gameboard.ships;
        const places = gameBoardDOM.player.gameboard.places;
        for(let i = 0; i < ships.length; i++) {
            for(let j = 0; j < ships[i].coordinates.length; j++) {
                if(ArrHelp.isSubArrOf(ships[i].coordinates[j], exeptCoords)) continue;
                ArrHelp.fillAround(ships[i].coordinates[j], places, 1);                
            }
        }
    }

    playDuo() {
        this.isGameStart = true;
        if(!this.isPlayed) {
            this.isPlayed = true;
        } else {
            return;
        }
        const player1Board = document.querySelector(`.${this.boardDOM1.player.name}-board`);
        const cells1 = player1Board.querySelectorAll('.board-cell');

        const player2Board = document.querySelector(`.${this.boardDOM2.player.name}-board`);
        const cells2 = player2Board.querySelectorAll('.board-cell');

        cells1.forEach((cell) => {
            cell.addEventListener('click', (e) => {
                const newMoveX = cell.dataset.row;
                const newMoveY = cell.dataset.col;
                if(!this.isGameEnd() && this.isGameStart) {
                    if(!this.isFirstMoves){
                        this.stepVsReal(newMoveX, newMoveY, this.boardDOM1, this.boardDOM2);
                    }
                }
            });
        });

        cells2.forEach((cell) => {
            cell.addEventListener('click', (e) => {
                const newMoveX = cell.dataset.row;
                const newMoveY = cell.dataset.col;
                if(!this.isGameEnd() && this.isGameStart) {
                    if(this.isFirstMoves){
                        this.stepVsReal(newMoveX, newMoveY, this.boardDOM2, this.boardDOM1);
                    }
                }
            });
        });
    }

    stepVsReal(player1X, player1Y, boardDOM, enemyBoardDOM) {
        const enemyMoves = enemyBoardDOM.player.moves;
        if(!ArrHelp.isSubArrOf([player1X, player1Y], enemyMoves)) {
            const isHit = boardDOM.getAttack([player1X, player1Y]);
            enemyMoves.push([player1X, player1Y]);
            if(!isHit) {
                this.isFirstMoves = !this.isFirstMoves;
                this.makeBoardInactive();
            } else {
                const ship = boardDOM.player.gameboard.getShipByCoord([player1X, player1Y]);
                if(ship?.isSunk()) {
                    const nearCoords = ArrHelp.getNearestCoords(ship.coordinates);
                    nearCoords.forEach((coord) => {
                        if(!ArrHelp.isSubArrOf(coord, enemyBoardDOM.player.moves)) {
                            enemyBoardDOM.player.moves.push(coord);
                            boardDOM.showMissed(coord);
                        }
                    });
                }
            }
        }
        if(!ArrHelp.isSubArrOf([player1X, player1Y], enemyMoves) && !boardDOM.getAttack([player1X, player1Y])) {
            enemyMoves.push([player1X, player1Y]);
            this.isFirstMoves = !this.isFirstMoves;
            this.makeBoardInactive();
        }
        if(this.isFirstMoves) {
            this.changeSignalInfo(`${this.boardDOM1.player.name} moves`);
            if(this.isGameEnd()) {
                this.changeSignalInfo(`Game over. ${this.boardDOM1.player.name} wins!`);
                alert(`Game over. ${this.boardDOM1.player.name} wins!`);
            }
        } else {
            this.changeSignalInfo(`${this.boardDOM2.player.name} moves`);
            if(this.isGameEnd()) {
                this.changeSignalInfo(`Game over. ${this.boardDOM2.player.name} wins!`);
                alert(`Game over. ${this.boardDOM2.player.name} wins!`);
            }
        }
    }


    playWithComputer() {
        this.isGameStart = true;
        if(!this.isPlayed) {
            this.isPlayed = true;
        } else {
            return;
        }

        const singleShipHits = [];

        const computerBoard = document.querySelector(`.${this.boardDOM2.player.name}-board`);
        const cells = computerBoard.querySelectorAll('.board-cell');
        for(let i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', async () => {
                const newMoveX = cells[i].dataset.row;
                const newMoveY = cells[i].dataset.col;
                if(!this.isGameEnd() && this.isGameStart) {
                    if(this.isFirstMoves) {
                        this.stepVsComputer(newMoveX, newMoveY, this.boardDOM1.player.moves, this.boardDOM2.player.moves, singleShipHits);
                    }          
                } 
            });
        }
    }

    stepVsComputer(playerX, playerY, playerMoves, computerMoves, singleShipHits) {
        if(!ArrHelp.isSubArrOf([playerX, playerY], playerMoves)) {
            const isHit = this.boardDOM2.getAttack([playerX, playerY]);
            playerMoves.push([playerX, playerY]);
            if(!isHit) {
                this.isFirstMoves = false;
                this.makeBoardInactive();
                setTimeout(async () => {
                    await this.computerMove(computerMoves, singleShipHits);
                    
                    if(this.isGameEnd()) {
                        this.changeSignalInfo(`Game over. ${this.boardDOM2.player.name} wins!`);
                        alert(`Game over. ${this.boardDOM2.player.name} wins!`);
                        singleShipHits.splice(0, singleShipHits.length);
                        return;
                    }
                }, Game.PAUSE_TIME);
                this.changeSignalInfo(`${this.boardDOM2.player.name} moves`);
            } else {
                const ship = this.boardDOM2.player.gameboard.getShipByCoord([playerX, playerY]);
                if(ship?.isSunk()) {
                    const nearCoords = ArrHelp.getNearestCoords(ship.coordinates);
                    nearCoords.forEach((coord) => {
                        if(!ArrHelp.isSubArrOf(coord, playerMoves)) {
                            playerMoves.push(coord);
                            this.boardDOM2.showMissed(coord);
                        }
                    });
                }
            }
        }

        if(this.isGameEnd()) {
            this.changeSignalInfo(`Game over. ${this.boardDOM1.player.name} wins!`);
            alert(`Game over. ${this.boardDOM1.player.name} wins!`);
            singleShipHits.splice(0, singleShipHits.length);
        }
    }
    
    async computerMove(computerMoves, singleShipHits) {
        let coord;
        let isHit;
        do{   
            if(computerMoves.length === 0) {
                coord = ArrHelp.getUniqueCoord(computerMoves);
            } else {
                coord = this.getLogicCoord(computerMoves, singleShipHits) || ArrHelp.getUniqueCoord(computerMoves);
            }       
            computerMoves.push(coord);
            isHit = this.boardDOM1.getAttack(coord);
            if(isHit) {
                singleShipHits.push(coord);
            }

            if(isHit && !this.isGameEnd()) {
                await new Promise(resolve => setTimeout(resolve, Game.PAUSE_TIME));
            }
        } while(isHit && !this.isGameEnd());
        this.isFirstMoves = true;
        this.makeBoardInactive();
        this.changeSignalInfo(`${this.boardDOM1.player.name} moves`);
    }    

    getLogicCoord(moves, hits) {
        if(hits.length === 0) return;
        const lastCoord = hits.at(-1);
        const curShip = this.boardDOM1.player.gameboard.getShipByCoord(lastCoord);
        if(curShip?.isSunk()) {
            const nearCoords = ArrHelp.getNearestCoords(curShip.coordinates);
            nearCoords.forEach((coord) => {
                if(!ArrHelp.isSubArrOf(coord, moves)) {
                    moves.push(coord);
                    this.boardDOM1.showMissed(coord);
                }
            });
            hits.splice(0, hits.length);
            return;
        }
        if(hits.length > 1) {
            const last2Coord = hits.at(-2);
            let newCoord;
            if(lastCoord[0] === last2Coord[0]) {
                do {
                    newCoord = ArrHelp.getNearestHit(hits, 'x');
                } while(ArrHelp.isSubArrOf(newCoord, moves));
            } else if(lastCoord[1] == last2Coord[1]) {
                do {
                    newCoord = ArrHelp.getNearestHit(hits, 'y');
                } while(ArrHelp.isSubArrOf(newCoord, moves));
            }
            return newCoord;
        } else {
            let newCoord;
            do {
                newCoord = ArrHelp.getRandCrossMove(lastCoord);
            } while(ArrHelp.isSubArrOf(newCoord, moves));
            return newCoord;
        }        
    }

    isGameEnd() {
        if(this.boardDOM1.player.gameboard.areAllSunk() || this.boardDOM2.player.gameboard.areAllSunk()) {
            return true;
        }
        return false;
    }

    changeSignalInfo(text) {
        document.querySelector(".signal-message").textContent = text;
    }

    reset() {
        this.boardDOM1.isLocked = false;
        this.boardDOM2.isLocked = false;
        this.isGameStart = false;
        this.isFirstMoves = true;
        this.boardDOM1.player.reset();
        this.boardDOM2.player.reset();        
    }

    makeBoardInactive() {
        this.boardDOM1.changeActive();
        this.boardDOM2.changeActive();
    }
}