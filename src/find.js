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
    do {
        newMoveX = Math.floor(Math.random() * 10);
        newMoveY = Math.floor(Math.random() * 10);
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
