import { Computer } from "./computer";
import { GameBoardDOM } from "./create-dom/gameboard-dom";
import { fillAround, getUniqueCoord, isSubArrOf, isSuitableToShip } from "./find";
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

        const computerBoard = document.querySelector(`.${this.player2.name}-board`);
        const cells = computerBoard.querySelectorAll('.board-cell');
        for(let i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', () => {
                const newMoveX = cells[i].dataset.row;
                const newMoveY = cells[i].dataset.col;
                this.makeStep(newMoveX, newMoveY, player1Moves, player2Moves);
            });
        }
    }

    computerMove(computerMoves) {
        let coord;
        do{
            coord = getUniqueCoord(computerMoves);
        } while(this.boardDOM1.getAttack(coord));
        computerMoves.push(coord);
    }

    isGameEnd() {
        if(this.player1.gameboard.areAllSunk() || this.player2.gameboard.areAllSunk()) {
            return true;
        } 
        return false;
    }

    makeStep(player1X, player1Y, player1Moves, player2Moves) {
        if(!isSubArrOf([player1X, player1Y], player1Moves) && !this.boardDOM2.getAttack([player1X, player1Y])) {
            player1Moves.push([player1X, player1Y]);
            this.computerMove(player2Moves);
        }
        if(this.isGameEnd()) {
            console.log("Game end");
            return;
        }
    }
}