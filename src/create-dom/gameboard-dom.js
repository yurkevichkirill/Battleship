export class GameBoardDOM {
    constructor(gameboard, name) {
        this.gameboard = gameboard;

        this.gbDOM = document.createElement('div');
        this.gbDOM.className = `board ${name}-board`;

        this.initializeBoard();
        //this.placeShips(gameboard.ships);
    }

    initializeBoard() {
        for(let i = 0; i < this.gameboard.size; i++) {
            const boardRow = document.createElement('div');
            boardRow.className = 'board-row';
            for(let j = 0; j < this.gameboard.size; j++) {
                const boardCell = document.createElement('div');
                boardCell.dataset.row = i;
                boardCell.dataset.col = j;
                boardCell.className = 'board-cell';
                boardRow.append(boardCell);
            }
            this.gbDOM.append(boardRow);
        }
    }

    placeShips() {
        this.cleanBoard();
        this.gameboard.ships.forEach((ship) => {
            const [x1, y1] = ship.coordinates[0];
            const [x2, y2] = ship.coordinates[1];
            if(x1 === x2) {
                for(let i = y1; i <= y2; i++) {
                    this.markField([x1, i], 'placed-ship');
                }
            } else if(y1 === y2) {
                for(let i = x1; i <= x2; i++) {
                    this.markField([i, y1], 'placed-ship');
                }
            }
        })
    }

    markField(coordinate, className) {
        const [x, y] = coordinate;
        const rows = this.gbDOM.children;

        for(let i = 0; i < rows.length; i++) {
            const cells = rows[i].children;
            for(let j = 0; j < cells.length; j++) {
                if(cells[j].dataset.row == x && cells[j].dataset.col == y) {
                    cells[j].classList.add(className);
                    return;
                }
            }
        }
    }

    cleanBoard() {
        const rows = this.gbDOM.children;
        for(let i = 0; i < rows.length; i++) {
            const cells = rows[i].children;
            for(let j = 0; j < cells.length; j++) {
                cells[j].className = "board-cell";
            }
        }
    }

    showMissed() {
        this.markField(this.gameboard.missedAttacks.at(-1), 'missed-attack');
    }

    showHit(coordinate){
        this.markField(coordinate, 'hit');
    }

    getAttack(coordinate) {
        if(this.gameboard.recieveAttack(coordinate)) {
            this.showHit(coordinate);
            return true;
        } else {
            this.showMissed();
            return false
        }
    }

    getCurCoordinates() {

    }
}