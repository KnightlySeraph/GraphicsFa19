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

    it("Transpose", function() {
        let data = new Matrix([0, 1, 2, 3,
            4, 5, 6, 7,
            8, 9, 10, 11,
            12, 13, 14, 15]);
        testMatrix(data, [0, 4, 8, 12,
            1, 5, 9, 13,
            2, 6, 10, 14,
            3, 7, 11, 15]);
    });
});

describe("Matrix Function", function() {
    it("Matrix Multiplcation", function() {
        let data = new Matrix([0, 1, 2, 3,
            4, 5, 6, 7,
            8, 9, 10, 11,
            12, 13, 14, 15]);
        data = data.mult(data);
        testMatrix(data, [56, 152, 248, 344,
            62, 174, 286, 398,
            68, 196, 324, 452,
            74, 218, 362, 506]);
    });

    it("Matrix rotX", function() {
        let data = new Matrix();
        let c = Math.sqrt(2) / 2;
        data = data.rotateX(45);
        testMatrix(data, new Matrix([1, 0, 0, 0,
            0, c, -c, 0,
            0, c, c, 0,
            0, 0, 0, 1]).getData());
    });

    it("Matrix rotY", function() {
        let data = new Matrix();
        let theta = 45 * (Math.PI / 2);
        let c = Math.cos(theta);
        let s = Math.sin(theta);
        data = data.rotateY(45);
        testMatrix(data, new Matrix([c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1]).getData());
    });

    it("Matrix Translation", function() {
        let data = new Matrix();
        data = data.translate(1, 1, 1);
        testMatrix(data, [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            1, 1, 1, 1]);
    });

    it("Matrix Scaling", function() {
        let data = new Matrix();
        data = data.scale(0.5, 0.5, 0.5);
        testMatrix(data, new Matrix([0.5, 0, 0, 0,
            0, 0.5, 0, 0,
            0, 0, 0.5, 0,
            0, 0, 0, 1]).getData());
    });

    it("Matrix getVal", function() {
        let data = new Matrix([5, 4, 2, 3,
            2, 5, 6, 9,
            0, 0, 1, 4,
            8, 5, 2, 0]);
        expect(data.mat[14]).toBe(data.getValue(2, 3));
    });
});
