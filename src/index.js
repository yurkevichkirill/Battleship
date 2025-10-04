import { GameBoardDOM } from "./create-dom/gameboard-dom";
import { Game } from "./game";
import { Gameboard } from "./gameboard";
import { Player } from "./player";
import { Ship } from "./ship";

import "./styles.css";
const player1 = new Player("Kirill");
const player2 = new Player("Computer");
const game = new Game(player1, player2);
game.randomPlace(player1);
game.randomPlace(player2);
game.playWithComputer();

// const main = document.querySelector(".main");

// const real = new Player();
// const computer = new Player();

// real.gameboard.place(3, [[0, 0], [0, 2]]);
// real.gameboard.place(4, [[2, 3], [6, 3]]);

// computer.gameboard.place(4, [[0, 9], [3, 9]]);
// computer.gameboard.place(4, [[7, 5], [7, 8]]);

// const boardDOM = new GameBoardDOM(real.gameboard);
// main.append(boardDOM.gbDOM);

// real.gameboard.recieveAttack([0, 0]);
// boardDOM.showHit([0, 0]);
// real.gameboard.recieveAttack([1, 0]);
// console.log(real.gameboard.missedAttacks);
// boardDOM.showMissed();

