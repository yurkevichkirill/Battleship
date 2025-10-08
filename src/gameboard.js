import { feelGrid } from "./arr-help";
import { Ship } from "./ship";

export class Gameboard {
    constructor(size = 10) {
        this.size = size;
        this.ships = [];
        this.missedAttacks = [];
        this.places =  Array(this.size).fill().map(() => {
            return Array(this.size).fill(0);
        });
    }

    place(length, coordinates) {
        const newShip = new Ship(length);
        newShip.coordinates = coordinates;
        this.ships.push(newShip);
        return newShip;
    }

    recieveAttack(coordinate) {
        const x = +coordinate[0];
        const y = +coordinate[1];
        for(let i = 0; i < this.ships.length; i++) {
            if(this.ships[i].coordinates[0][1] === this.ships[i].coordinates[1][1]) {
                if(y === this.ships[i].coordinates[0][1]) {
                    if(x >= this.ships[i].coordinates[0][0] && x <= this.ships[i].coordinates[1][0]) {
                        this.ships[i].hit();
                        return true;
                    }
                }
            } else if (this.ships[i].coordinates[0][0] === this.ships[i].coordinates[1][0]) {
                if(x === this.ships[i].coordinates[0][0]) {
                    if(y >= this.ships[i].coordinates[0][1] && y <= this.ships[i].coordinates[1][1]) {
                        this.ships[i].hit();
                        return true;
                    }
                }
            }
        }
        this.missedAttacks.push(coordinate);
        return false;
    }

    areAllSunk() {
        for(let i = 0; i < this.ships.length; i++) {
            if(!this.ships[i].isSunk()){
                return false;
            }
        }
        return true;
    }

    getShipByCoord(coord) {
        for(let i = 0; i < this.ships.length; i++) {
            if(this.ships[i].coordinates[0][0] == coord[0]) {
                if(coord[1] >= this.ships[i].coordinates[0][1] && coord[1] <= this.ships[i].coordinates[1][1]) {
                    return this.ships[i];
                }
            }
            if(this.ships[i].coordinates[0][1] == coord[1]) {
                if(coord[0] >= this.ships[i].coordinates[0][0] && coord[0] <= this.ships[i].coordinates[1][0]) {
                    return this.ships[i];
                }
            }            
        }
    }

    removeShips() {
        this.ships = [];
        feelGrid(this.places, 0);
    }

    reset(){
        this.ships = [];
        this.missedAttacks = [];
        feelGrid(this.places, 0);
    }
}