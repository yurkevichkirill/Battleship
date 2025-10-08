import { Gameboard } from "./gameboard.js";

export class Player {
    constructor(name = "something") {
        this.gameboard = new Gameboard();
        this.name = name;
        this.moves = [];
    }

    reset() {
        this.moves = [];
        this.gameboard.reset();
    }
}