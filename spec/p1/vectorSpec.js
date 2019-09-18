// gets access to Vector so it can be tested
var Vector = require("../../src/shared/matrix-math").Vector;

/**
 * Compares a Vector to some expected data.
 *
 * @param {Vector} vec Vector to check
 * @param {Array} expected Array of values expected from vec
 */
function testVector(vec, expected) {
    // Check to see if the array returned from getData has
    // a length of 4.
    // expect takes a value and the result returned can be
    // compared with toBe (for equals), toBeLessThan,
    // toBeGreaterThan, etc., to the expected value.
    expect(vec.getData().length).toBe(4);

    // Checks to see if the array has the same values as the
    // expected array. Since these are floating-point numbers,
    // the data is compared to see if it is close enough (in
    // this case, the same to 3 decimal places).
    let data = vec.getData();
    for (let i = 0; i < 4; i++) {
        expect(data[i]).toBeCloseTo(expected[i], 3,
            " Actual: " + data + " Expected: " + expected);
    }
}

// describe is a function call that creates a test suite
// You can create as many test suites as you need by
// adding more calls to describe.
// The first parameter is the name of the suite (so pick
// something useful) and the second is a function with
// no parameters.  Doing
//      function () {
//          //code
//      }
// creates a function inline.
// NOTE: describe is a function, so it needs ( )'s
// around the body.
describe("Vector Constructor", function() {

    // it creates a test that will be run within the
    // suite. It is also a function and its first parameter
    // is also a description. The second parameter is a
    // function with the code to run the test.
    it("Vector constructor - No data", function() {
        // check the default constructor
        testVector(new Vector(), [0, 0, 0, 0]);
    });

    // a second test that checks creating a Vector with
    // exactly 3 values in the array.
    // Note that Vector takes an array and not multiple
    // parameters.
    it("Vector constructor - 3 values", function() {
        testVector(new Vector([2.5, 3.15, -30]), [2.5, 3.15, -30, 0]);
    });

});


