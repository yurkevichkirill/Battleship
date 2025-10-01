import { Ship } from "./ship";

export class Gameboard {
    constructor(size = 10) {
        this.ships = [];
        this.missedAttacks = [];
    }

    place(length, coordinates) {
        const newShip = new Ship(length);
        newShip.coordinates = coordinates;
        this.ships.push(newShip);
        return newShip;
    }

    recieveAttack(coordinate) {
        const [x, y] = coordinate;
        for(let i = 0; i < this.ships.length; i++) {
            if(this.ships[i].coordinates[0][1] === this.ships[i].coordinates[1][1]) {
                if(y === this.ships[i].coordinates[0][1]) {
                    if(x >= this.ships[i].coordinates[0][0] && x <= this.ships[i].coordinates[1][0]) {
                        this.ships[i].hit();
                        return;
                    }
                }
            } else if (this.ships[i].coordinates[0][0] === this.ships[i].coordinates[1][0]) {
                if(x === this.ships[i].coordinates[0][0]) {
                    if(y >= this.ships[i].coordinates[0][1] && y <= this.ships[i].coordinates[1][1]) {
                        this.ships[i].hit();
                        return;
                    }
                }
            }
        }
        this.missedAttacks.push(coordinate);
    }

    areAllSunk() {
        for(let i = 0; i < this.ships.length; i++) {
            if(!this.ships[i].isSunk()){
                return false;
            }
        }
        return true;
    }
}