import { Computer } from "./computer";
import { GameBoardDOM } from "./create-dom/gameboard-dom";
import { fillAround, fillNearest, getNearestHit, getRandCrossMove, getRandLineMove, getUniqueCoord, isSubArrOf, isSuitableToShip } from "./find";
import { Player } from "./player";

export class Game {
    static SIZE = 10;
    static COUNT_1 = 4;
    static COUNT_2 = 3;
    static COUNT_3 = 2;
    static COUNT_4 = 1;

    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.boardDOM1 = new GameBoardDOM(this.player1.gameboard, this.player1.name);        
        this.boardDOM2 = new GameBoardDOM(this.player2.gameboard, this.player2.name);
        document.querySelector('.game-boards').append(this.boardDOM1.gbDOM, this.boardDOM2.gbDOM);
    }
    
    defaultPlace() {
        this.player1.gameboard.place(1, [[0, 1], [0, 1]]);
        this.player1.gameboard.place(1, [[5, 3], [5, 3]]);
        this.player1.gameboard.place(1, [[9, 5], [9, 5]]);
        this.player1.gameboard.place(1, [[7, 7], [7, 7]]);

        this.player1.gameboard.place(2, [[1, 3], [2, 3]]);
        this.player1.gameboard.place(2, [[2, 7], [2, 8]]);
        this.player1.gameboard.place(2, [[8, 1], [8, 2]]);

        this.player1.gameboard.place(3, [[1, 5], [3, 5]]);
        this.player1.gameboard.place(3, [[5, 7], [5, 9]]);

        this.player1.gameboard.place(4, [[3, 1], [6, 1]]);

        this.boardDOM1.placeShips();

        this.player2.gameboard.place(1, [[0, 1], [0, 1]]);
        this.player2.gameboard.place(1, [[5, 3], [5, 3]]);
        this.player2.gameboard.place(1, [[9, 5], [9, 5]]);
        this.player2.gameboard.place(1, [[7, 7], [7, 7]]);

        this.player2.gameboard.place(2, [[1, 3], [2, 3]]);
        this.player2.gameboard.place(2, [[2, 7], [2, 8]]);
        this.player2.gameboard.place(2, [[8, 1], [8, 2]]);

        this.player2.gameboard.place(3, [[1, 5], [3, 5]]);
        this.player2.gameboard.place(3, [[5, 7], [5, 9]]);

        this.player2.gameboard.place(4, [[3, 1], [6, 1]]);

        this.boardDOM2.placeShips();
    }

    randomPlace(player) {
        const places = Array(Game.SIZE).fill().map(() => {
            return Array(Game.SIZE).fill(0);
        });

        this.placeShipsSize(4, Game.COUNT_4, places, player);
        this.placeShipsSize(3, Game.COUNT_3, places, player);
        this.placeShipsSize(2, Game.COUNT_2, places, player);
        this.placeShipsSize(1, Game.COUNT_1, places, player);

        this.boardDOM1.placeShips();
        this.boardDOM2.placeShips();
    }

    placeShipsSize(size, count, places, player) {
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
            } while(!isSuitableToShip([coordX1, coordY1], places) || !isSuitableToShip([coordX2, coordY2], places));
            player.gameboard.place(size, [[coordX1, coordY1], [coordX2, coordY2]]);
            fillAround([coordX1, coordY1], places);
            fillAround([coordX2, coordY2], places);  
        }
    }

    playWithComputer() {
        const player1Moves = [];
        const player2Moves = [];
        const singleShipHits = [];

        const computerBoard = document.querySelector(`.${this.player2.name}-board`);
        const cells = computerBoard.querySelectorAll('.board-cell');
        for(let i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', () => {
                const newMoveX = cells[i].dataset.row;
                const newMoveY = cells[i].dataset.col;
                if(!this.isGameEnd()) {
                    this.makeStep(newMoveX, newMoveY, player1Moves, player2Moves, singleShipHits);
                }
            });
        }
    }

    computerMove(computerMoves, singleShipHits) {
        let coord;
        let isHit;
        do{   
            if(computerMoves.length === 0) {
                coord = getUniqueCoord(computerMoves);
            } else {
                coord = this.getLogicCoord(computerMoves, singleShipHits) || getUniqueCoord(computerMoves);
            }       
            computerMoves.push(coord);
            isHit = this.boardDOM1.getAttack(coord);
            if(isHit) {
                singleShipHits.push(coord);
            }
        } while(isHit);
    }

    isGameEnd() {
        if(this.player1.gameboard.areAllSunk() || this.player2.gameboard.areAllSunk()) {
            return true;
        }
        return false;
    }

    makeStep(player1X, player1Y, player1Moves, player2Moves, singleShipHits) {
        if(!isSubArrOf([player1X, player1Y], player1Moves) && !this.boardDOM2.getAttack([player1X, player1Y])) {
            player1Moves.push([player1X, player1Y]);
            this.computerMove(player2Moves, singleShipHits);
        }
        if(this.isGameEnd()) {
            console.log("Game end");
            return;
        }
    }

    getLogicCoord(moves, hits) {
        if(hits.length === 0) return;
        const lastCoord = hits.at(-1);
        const curShip = this.player1.gameboard.getShipByCoord(lastCoord);
        if(curShip.isSunk()) {
            this.roundSunk(curShip, moves);
            hits.splice(0, hits.length);
            return;
        }
        if(hits.length > 1) {
            const last2Coord = hits.at(-2);
            let newCoord;
            if(lastCoord[0] === last2Coord[0]) {
                do {
                    newCoord = getNearestHit(hits, 'x');
                } while(isSubArrOf(newCoord, moves));
            } else if(lastCoord[1] == last2Coord[1]) {
                do {
                    newCoord = getNearestHit(hits, 'y');
                } while(isSubArrOf(newCoord, moves));
            }
            return newCoord;
        } else {
            let newCoord;
            do {
                newCoord = getRandCrossMove(lastCoord);
            } while(isSubArrOf(newCoord, moves));
            return newCoord;
        }
        
    }

    roundSunk(ship, moves) {
        fillNearest(ship.coordinates[0], moves);
        fillNearest(ship.coordinates[1], moves);
    }
}