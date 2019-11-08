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
            [0.05, 0, 0, 0, 0, 0.05, 0, 0, 0, 0, -0.05, 0, 0, 0, -1.5, 1],
            "Calling getProjection after setting up an ortho projection");
    });

    it("Frustum", function() {
        let c = new Camera();
        let left = -20;
        let right = 20;
        let bottom = -20;
        let top = 20;
        let near = 10;
        let far = 50;
        c.frustum(left, right, bottom, top, near, far);
        testMatrix(c.getProjection(),
            [0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, -1.5, -1, 0, 0, -25, 0],
            "Calling getProjection after setting a frustum");
    });

    it("LookAt", function() {
        let c = new Camera();
        let eye = new Vector([5, 9, 8.5]); // Arbitrarily decided numbers to figure out whether LookAt returns the right thing or not
        let look = new Vector([3, 4, 9]);
        let viewUp = new Vector([0, 2, 5]);
        c.lookAt(eye, look, viewUp);
        testMatrix(c.getView(), // Based on the feedback when this fails it looks like its actually close
            [-0.9239, -0.0968, 0.373, 0, 0.3553, 0.138, 0.9325, 0, -0.1421, 0.9855, -0.0933, 0, -2.6294, 9.1311, 4.0093, 1],
            "Called after setting a lookAt view matrix");
    });

    it("ViewUp", function() {

    });

});
