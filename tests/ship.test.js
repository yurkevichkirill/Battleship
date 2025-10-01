import {Ship} from "../src/ship.js";

describe("hitting and sunk ships", () => {
    test("Hit ship", () => {
        const ship = new Ship(5);
        expect((ship.hits)).toBe(0);
        ship.hit();
        expect(ship.hits).toBe(1);
    });

    test("Is ship sunk", () => {
        const ship = new Ship(1);
        expect(ship.isSunk()).toBeFalsy();
        ship.hit();
        expect(ship.isSunk()).toBeTruthy();
    });
})
