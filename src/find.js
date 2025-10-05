const SIZE = 10;
const MAX_ITERS = 10;

export function isSubArrOf(subArray, array) {
    for(let i = 0; i < array.length; i++) {
        if(array[i][0] === subArray[0] && array[i][1] === subArray[1]){
            return true;
        }
    }
    return false;
}

export function isSuitableToShip(coord, board) {
    const [x, y] = coord;
    if(board[x][y]) return false;
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
            const lastCoord = getLastCoord(moves);
            if(lastCoord) {
                [newMoveX, newMoveY] = getLastCoord(moves);
            }
        }
    } while(isSubArrOf([newMoveX, newMoveY], moves));
    return [newMoveX, newMoveY];
}

export function fillAround(coord, places) {
    const [x, y] = coord;
    places[x][y] = 1;    
    if (x > 0 && y > 0) places[x - 1][y - 1] = 1;                    // ↖
    if (y > 0) places[x][y - 1] = 1;                                 // ↑
    if (y < places[0].length - 1) places[x][y + 1] = 1;              // ↓
    if (x > 0) places[x - 1][y] = 1;                                 // ←
    if (x < places.length - 1) places[x + 1][y] = 1;                 // →
    if (x < places.length - 1 && y > 0) places[x + 1][y - 1] = 1;    // ↙
    if (x < places.length - 1 && y < places[0].length - 1) places[x + 1][y + 1] = 1; // ↘
    if (x > 0 && y < places[0].length - 1) places[x - 1][y + 1] = 1; // ↗
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
