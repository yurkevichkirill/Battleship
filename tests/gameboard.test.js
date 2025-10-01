import {Gameboard} from "../src/gameboard.js";

describe("Gameboard", () => {
    let gameboard;
    beforeEach(() => {
        gameboard = new Gameboard();
    })

    test("Place ship at (0, 0) (0, 3)", () => {
        const newShip = gameboard.place(4, [[0, 0], [0, 3]]);
        expect(newShip.coordinates).toEqual([[0, 0], [0, 3]]);
        expect(newShip.length).toBe(4);
    });

    test("Attack on ship (0, 2)", () => {
        const newShip = gameboard.place(4, [[0, 0], [0, 3]]);
        gameboard.recieveAttack([0, 2])
        expect(newShip.hits).toBe(1);
    });

    test("Attack out of ship (3, 4)", () => {
        const newShip = gameboard.place(4, [[0, 0], [0, 3]]);
        gameboard.recieveAttack([3, 4]);
        expect(gameboard.missedAttacks).toContainEqual([3, 4]);
    });

    test("All ships are sunk", () => {
        const newShip2 = gameboard.place(1, [[2, 2], [2, 2]]);
        const newShip3 = gameboard.place(2, [[3, 3], [4, 3]]);

        gameboard.recieveAttack([2, 2]);
        gameboard.recieveAttack([3, 3]);

        expect(gameboard.areAllSunk()).toBeFalsy();

        gameboard.recieveAttack([4, 3]);

        expect(gameboard.areAllSunk()).toBeTruthy();
    })
})