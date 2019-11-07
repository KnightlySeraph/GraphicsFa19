// allows classes to be used
var Matrix = require("../../src/shared/matrix-math").Matrix;
var Vector = require("../../src/shared/matrix-math").Vector;
var Camera = require("../../src/shared/matrix-math").Camera;

/**
 *
 * @param {Array} expected Array of expected data
 * @param {Matrix} act Actual data to comapre to expected data
 * @param {string} msg Message to print with a failed test
 */
function testMatrix(act, expected, msg) {
    act.getData().every((val, i) => {
        expect(val).toBeCloseTo(expected[i], 3,
            msg + " Actual: " + act.getData() + " Expected: " + expected);
        return true;
    });
}

describe("Camera", function() {
    it("Camera Constructor", function() {
        let c = new Camera();
        testMatrix(c.getProjection(),
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            "Calling getProjection after creating a Camera");
        testMatrix(c.getView(),
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            "Calling getView after creating a Camera");
    });

    it("Ortho", function() {
        let c = new Camera();
        // Check if the orthogonal matrix returns expected values for these paramters
        let left = -20;
        let right = 20;
        let bottom = -20;
        let top = 20;
        let near = 10;
        let far = 50;
        c.ortho(left, right, bottom, top, near, far);
        testMatrix(c.getProjection(),
            [0.05, 0, 0, 0, 0, 0.05, 0, 0, 0, 0, -0.05, -1.5, 0, 0, 0, 1],
            "Calling getProjection after setting up an ortho projection");
    });

});
