const SIZE = 10;
const MAX_ITERS = 10;

export function isSubArrOf(subArray, array) {
    for(let i = 0; i < array.length; i++) {
        if(array[i][0] == subArray[0] && array[i][1] == subArray[1]){
            return true;
        }
    }
    return false;
}

export function isSuitableToShip(coord, board) {
    const [x, y] = coord;
    if(x >= SIZE || y >= SIZE || x < 0 || y < 0 || board[x][y] === 1) return false;
    return true;    
}

export function getUniqueCoord(moves) {
    let newMoveX;
    let newMoveY;
    let i = 0;
    do {
        newMoveX = Math.floor(Math.random() * SIZE);
        newMoveY = Math.floor(Math.random() * SIZE);
        if(i++ === MAX_ITERS) {
            [newMoveX, newMoveY] = getLastCoord(moves);
        }
    } while(isSubArrOf([newMoveX, newMoveY], moves));
    return [newMoveX, newMoveY];
}

export function fillAround(coord, places, sign) {
    const [x, y] = coord;
    places[x][y] = sign;    
    if (x > 0 && y > 0) places[x - 1][y - 1] = sign;                                    // ↖
    if (y > 0) places[x][y - 1] = sign;                                                 // ↑
    if (y < places[0].length - 1) places[x][y + 1] = sign;                              // ↓
    if (x > 0) places[x - 1][y] = sign;                                                 // ←
    if (x < places.length - 1) places[x + 1][y] = sign;                                 // →
    if (x < places.length - 1 && y > 0) places[x + 1][y - 1] = sign;                    // ↙
    if (x < places.length - 1 && y < places[0].length - 1) places[x + 1][y + 1] = sign; // ↘
    if (x > 0 && y < places[0].length - 1) places[x - 1][y + 1] = sign;                 // ↗
}

export function getRandCrossMove(coord) {
    const [x, y] = coord;
    const value = Math.random();
    if(value < 1/4) {
        if(x + 1 < SIZE) return [x + 1, y];
    } else if(value < 1/2) {
        if(y + 1 < SIZE) return [x, y + 1];
    } else if(value < 3/4) {
        if(x - 1 >= 0) return [x - 1, y];
    } else {
        if(y - 1 >= 0) return [x, y - 1];
    }
    return coord
}

export function getRandLineMove(coord, line) {
    const [x, y] = coord;
    const value = Math.random();
    if(line === 'x') {
        if(value < 1/2) {
            if(y + 1 < SIZE) return [x, y + 1];
        } else {
            if(y - 1 >= 0) return [x, y - 1];
        }
    } else if(line === 'y') {
        if(value < 1/2) {
            if(x + 1 < SIZE) return [x + 1, y];
        } else {
            if(x - 1 >= 0) return [x - 1, y];
        }
    }
    return coord;
}

export function getNearestHit(hits, line) {
    const coord = hits[Math.floor(Math.random() * hits.length)];
    return getRandLineMove(coord, line);
}

export function fillNearest(coord, moves) {
    const [x, y] = coord;
    if (x > 0 && y > 0 && !isSubArrOf([x - 1, y - 1], moves)) moves.push([x - 1, y - 1]);              // ↖
    if (y > 0 && !isSubArrOf([x,y - 1], moves)) moves.push([x,y - 1]);                                 // ↑
    if (y < SIZE - 1 && !isSubArrOf([x,y + 1], moves)) moves.push([x,y + 1]);                          // ↓
    if (x > 0 && !isSubArrOf([x - 1,y], moves)) moves.push([x - 1,y]);                                 // ←
    if (x < SIZE - 1 && !isSubArrOf([x + 1,y], moves)) moves.push([x + 1,y]);                          // →
    if (x < SIZE - 1 && y > 0 && !isSubArrOf([x + 1,y - 1], moves)) moves.push([x + 1,y - 1]);         // ↙
    if (x < SIZE - 1 && y < SIZE - 1 && !isSubArrOf([x + 1,y + 1], moves)) moves.push([x + 1,y + 1]);  // ↘
    if (x > 0 && y < SIZE - 1 && !isSubArrOf([x - 1, y + 1], moves)) moves.push([x - 1, y + 1]);       // ↗
}

function getLastCoord(moves) {
    const fullArr = [];
    for(let i = 0; i < SIZE; i++) {
        for(let j = 0; j < SIZE; j++) {
            fullArr.push([i, j]);
        }
    }

    for(let i = 0; i < SIZE * SIZE; i++) {
        if(!isSubArrOf(fullArr[i], moves)) {
            return fullArr[i];
        }
    }
}

export function getShipRange(coords) {
    const [[x1, y1], [x2, y2]] = coords;
    const allCoords = [];
    if(x1 === x2) {
        for(let i = y1; i <= y2; i++) {
            allCoords.push([x1, i]);
        }
    } else {
        for(let i = x1; i <= x2; i++) {
            allCoords.push([i, y1]);
        }
    }
    return allCoords;
}

export function getNearestCoords(coords) {
    const nearCoords = [];
    const [[x1, y1], [x2, y2]] = coords;
    let length;
    if(x1 === x2) {
        length = y2 - y1 + 1;
        const x = x1;
        checkAndPush(x + 1, y1 - 1, nearCoords);
        checkAndPush(x, y1 - 1, nearCoords);
        checkAndPush(x - 1, y1 - 1, nearCoords);
        checkAndPush(x + 1, y1, nearCoords);
        checkAndPush(x - 1, y1, nearCoords);
        checkAndPush(x + 1, y2 + 1, nearCoords);
        checkAndPush(x, y2 + 1, nearCoords);
        checkAndPush(x - 1, y2 + 1, nearCoords);

        if(length > 1) {
            checkAndPush(x + 1, y2, nearCoords);
            checkAndPush(x - 1, y2, nearCoords);
        }
        if(length > 2) {
            checkAndPush(x + 1, y1 + 1, nearCoords);
            checkAndPush(x - 1, y1 + 1, nearCoords);
        }
        if(length > 3) {
            checkAndPush(x + 1, y2 - 1, nearCoords);
            checkAndPush(x - 1, y2 - 1, nearCoords);
        }
    } else {
        length = x2 - x1 + 1;
        const y = y1;
        checkAndPush(x1 - 1, y - 1, nearCoords);
        checkAndPush(x1 - 1, y , nearCoords);
        checkAndPush(x1 - 1, y + 1, nearCoords);
        checkAndPush(x1, y - 1, nearCoords);
        checkAndPush(x1, y + 1, nearCoords);
        checkAndPush(x2 + 1, y - 1, nearCoords);
        checkAndPush(x2 + 1, y, nearCoords);
        checkAndPush(x2 + 1, y + 1, nearCoords);

        if(length > 1) {
            checkAndPush(x2, y - 1, nearCoords);
            checkAndPush(x2, y + 1, nearCoords);
        }
        if(length > 2) {
            checkAndPush(x1 + 1, y1 + 1, nearCoords);
            checkAndPush(x1 + 1, y1 - 1, nearCoords);
        }
        if(length > 3) {
            checkAndPush(x2 - 1, y2 + 1, nearCoords);
            checkAndPush(x2 - 1, y2 - 1, nearCoords);
        }
    }
    return nearCoords;
}

function checkAndPush(x, y, arr) {
    if(x >= 0 && x < SIZE && y >=0 && y < SIZE) {
        arr.push([x, y]);
    }
}

export function getFreeCells(places, shipCoords) {
    const free = [];
    for(let i = 0; i < places.length; i++) {
        for(let j = 0; j < places[i].length; j++) {
            if(places[i][j] == 0 && !isSubArrOf([i, j], shipCoords)) {
                free.push([i, j]);
            }
        }
    }
    return free;
}

export function removeSpaces(name) {
    return name.replace(/\s+/g, '').trim();
}

export function getCell(cells, x, y) {
    for(let i = 0; i < cells.length; i++) {
        if(cells[i].dataset.row == x && cells[i].dataset.col == y) {
            return cells[i];
        }
    }
}

export function feelGrid(places, sign) {
    for(let i = 0; i < places.length; i++) {
        for(let j = 0; j < places[i].length; j++) {
            places[i][j] = sign;
        }
    }
}