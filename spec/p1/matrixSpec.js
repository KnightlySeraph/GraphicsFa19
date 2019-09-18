// allows Matrix to be found
var Matrix = require("../../src/shared/matrix-math").Matrix;

/**
 *
 * @param {Matrix} mat Matrix to test
 * @param {Array} expected Array with the expected results
 */
function testMatrix(mat, expected) {

    expect(mat.getData().length).toBe(16);
    // console.log(mat.getData());
    // console.log(expected);
    let data = mat.getData();
    for (let i = 0; i < 16; i++) {
        expect(data[i]).toBeCloseTo(expected[i], 3,
            " Actual: " + data + " Expected: " + expected);
    }
}


describe("Matrix Constructor", function() {
    it("Identity", function() {
        testMatrix(new Matrix, [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]);
    });

    it("Matrix - Array", function() {
        let data = new Matrix([
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        ]);
        testMatrix(data, [1, 5, 9, 13,
            2, 6, 10, 14,
            3, 7, 11, 15,
            4, 8, 12, 16
        ]);
    });
});
