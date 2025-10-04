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
        gameboard.place(3, [[0, 0], [0, 2]]);
        gameboard.place(5, [[2, 3], [6, 3]]);

        gameboard.recieveAttack([0, 0]);
        gameboard.recieveAttack([0, 1]);
        gameboard.recieveAttack([0, 2]);

        gameboard.recieveAttack([2, 3]);
        gameboard.recieveAttack([3, 3]);
        gameboard.recieveAttack([4, 3]);
        gameboard.recieveAttack([5, 3]);
        gameboard.recieveAttack([6, 3]);

        expect(gameboard.areAllSunk()).toBeTruthy();
    });
})