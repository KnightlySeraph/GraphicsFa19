/* eslint no-unused-vars: ["warn", {"varsIgnorePattern": "(Matrix)|(Vector)|(Camera)"}] */

/**
 * Represents a 4x4 matrix suitable for performing transformations
 * on a vector of homogeneous coordinates.
 */
class Matrix {
    /**
     * Creates a 4x4 matrix. If no parameter is given, the identity
     * matrix is created. If values is provided it should be an array
     * and it will provide UP TO 16 values for the matrix. If there are
     * less than 16 values, the remaining values in the array should
     * correspond to the identify matrix. If there are more than 16,
     * the rest should be ignored.
     *
     * The data is assumed to be in COLUMN MAJOR order.
     *
     * IMPORTANT NOTE: The values array will be in ROW MAJOR order
     * because that makes the most sense for people when they are
     * entering data. This array will need to be transposed so that
     * it is in COLUMN MAJOR order.
     *
     * As an example, when creating a Matrix object, the user may do
     * something like:
     *      m = new Matrix([1, 2, 3, 4,
     *                      5, 6, 7, 8,
     *                      9, 10, 11, 12,
     *                      13, 14, 15, 16]);
     *
     * This gives the constructor an array with values:
     *      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
     * (since it is in ROW MAJOR order).
     *
     * The data in the array needs to be reordered so that it is,
     * logically, in COLUMN MAJOR order. The resulting array should
     * be:
     *      [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]
     *
     * To see if values was passed to the function, you can check if
     *      typeof values !== "undefined"
     * This will be true if values has a value.
     *
     * @param {number[]} values (optional) An array of floating point values.
     *
     */
    constructor(values = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) {
        // TODO
        // this.mat = values;
        this.mat = this.transpose(values);
        
    }

    /**
     * Returns a Float32Array array with the data from the matrix. The
     * data should be in COLUMN MAJOR form.
     *
     * @return {Float32Array} Array with the matrix data.
     */
    getData() {
        // TODO
        return new Float32Array(this.mat);
    }

    /**
     * Returns a new matrix that is a copy of the current one
     * Except the values have been transposed
     *
     * @return {values []} A copy matrix with its values transposed
     */
    transpose(values) {
        let newMat = values.slice(0);

        // Reorder Indices
        newMat[1] = values[4];
        newMat[2] = values[8];
        newMat[3] = values[12];
        newMat[4] = values[1];
        newMat[6] = values[9];
        newMat[7] = values[13];
        newMat[8] = values[2];
        newMat[9] = values[6];
        newMat[11] = values[14];
        newMat[12] = values[3];
        newMat[13] = values[7];
        newMat[14] = values[11];

        return newMat;

    }

    /**
     * Gets a value from the matrix at position (r, c).
     *
     * @param {number} r Row number (0-3) of value in the matrix.
     * @param {number} c Column number (0-3) of value in the matrix.
     */
    getValue(r, c) {
        // TODO
        return this.mat[r + 4 * c];
    }

    /**
     * Updates a single position (r, c) in the matrix with value.
     *
     * @param {number} r Row number (0-3) of value in the matrix.
     * @param {number} c Column number (0-3) of value in the matrix.
     * @param {number} value Value to place in the matrix.
     */
    setValue(r, c, value) {
        // TODO

        this.mat[r + 4 * c] = value;
    }

    /**
     * Returns a new Matrix that has the identity matrix.
     * This operation should not change the current matrix.
     *
     * @return {Matrix} Identity matrix
     */
    identity() {
        // TODO

        return Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    /**
     * Multiplies the current matrix by the parameter matrix and returns the result.
     * This operation should not change the current matrix or the parameter.
     *
     * @param {Matrix} matB Matrix to post-multiply the current matrix by.
     *
     * @return {Matrix} Product of the current matrix and the parameter.
     */
    mult(matB) {
        // TODO
        let values = [];
        let vert = 0;
        let mMat = new Matrix();
        // console.log("Mult is being called");

        // Loop Through and multiply
        // for (let t = 0; t < 15; t += 4) {
        //     for (let i = 0; i < 4; i++) {
        //         for (let z = 0; z < 4; z++) {
        //             vert += this.mat[z + t] * matB.mat[z * 4 + i];
        //         }
        //         values.push(vert);
        //         vert = 0;
        //     }
        // }

        for (let t = 0; t < 4; t++) {
            for (let i = 0; i < 4; i++) {
                for (let z = 0; z < 4; z++) {
                    vert += this.getValue(t, z) * matB.getValue(z, i);
                }
                // values.push(vert);
                mMat.setValue(t, i, vert);
                vert = 0;
            }
        }
       

        return mMat;
    }

    /**
     * Creates a new Matrix that is the current matrix translated by
     * the parameters.
     *
     * This should not change the current matrix.
     *
     * @param {number} x Amount to translate in the x direction.
     * @param {number} y Amount to translate in the y direction.
     * @param {number} z Amount to translate in the z direction.
     *
     * @return {Matrix} Result of translating the current matrix.
     */
    translate(x, y, z) {
        // TODO

        let t = new Matrix([1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1]);

        console.log(t);
        console.log(this.mult(t));

        return this.mult(t);
    }

    /**
     * Rotatation around the x-axis. If provided, the rotation is done around
     * the point (x, y, z). By default, that point is the origin.
     *
     * This should not change the current matrix.
     *
     * @param {number} theta Amount in DEGREES to rotate around the x-axis.
     * @param {number} x x coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} y y coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} z z coordinate of the point around which to rotate. Defaults to 0.
     *
     * @return {Matrix} Result of rotating the current matrix.
     */
    rotateX(theta, x = 0, y = 0, z = 0) {
        // TODO
        theta = theta * (Math.PI / 180);
        let c = Math.cos(theta);
        let s = Math.sin(theta);

        let rx = new Matrix([1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1]);

        return this.mult(rx);

    }

    /**
     * Rotatation around the y-axis. If provided, the rotation is done around
     * the point (x, y, z). By default, that point is the origin.
     *
     * This should not change the current matrix.
     *
     * @param {number} theta Amount in DEGREES to rotate around the y-axis.
     * @param {number} x x coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} y y coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} z z coordinate of the point around which to rotate. Defaults to 0.
     *
     * @return {Matrix} Result of rotating the current matrix.
     */
    rotateY(theta, x = 0, y = 0, z = 0) {
        // TODO
        theta = theta * (Math.PI / 180);
        let c = Math.cos(theta);
        let s = Math.sin(theta);

        let ry = new Matrix([c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1]);

        return this.mult(ry);
    }

    /**
     * Rotatation around the z-axis. If provided, the rotation is done around
     * the point (x, y, z). By default, that point is the origin.
     *
     * This should not change the current matrix.
     *
     * @param {number} theta Amount in DEGREES to rotate around the z-axis.
     * @param {number} x x coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} y y coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} z z coordinate of the point around which to rotate. Defaults to 0.
     *
     * @return {Matrix} Result of rotating the current matrix.
     */
    rotateZ(theta, x = 0, y = 0, z = 0) {
        // TODO
        theta = theta * (Math.PI / 180);
        let c = Math.cos(theta);
        let s = Math.sin(theta);

        let rz = new Matrix([c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]);

        return this.mult(rz);
    }

    /**
     * Rotatation around the z-axis followed by a rotation around the y-axis and then
     * the z-axis. If provided, the rotation is done around the point (x, y, z).
     * By default, that point is the origin.
     *
     * The rotation must be done in order z-axis, y-axis, x-axis.
     *
     * This should not change the current matrix.
     *
     * @param {number} thetax Amount in DEGREES to rotate around the x-axis.
     * @param {number} thetay Amount in DEGREES to rotate around the y-axis.
     * @param {number} thetaz Amount in DEGREES to rotate around the z-axis.
     * @param {number} x x coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} y y coordinate of the point around which to rotate. Defaults to 0.
     * @param {number} z z coordinate of the point around which to rotate. Defaults to 0.
     *
     * @return {Matrix} Result of rotating the current matrix.
     */
    rotate(thetax, thetay, thetaz, x = 0, y = 0, z = 0) {
        // TODO
    }

    /**
     * Scaling relative to a point. If provided, the scaling is done relative to
     * the point (x, y, z). By default, that point is the origin.
     *
     * This should not change the current matrix.
     *
     * @param {number} sx Amount to scale in the x direction.
     * @param {number} sy Amount to scale in the y direction.
     * @param {number} sz Amount to scale in the z direction.
     * @param {number} x x coordinate of the point around which to scale. Defaults to 0.
     * @param {number} y y coordinate of the point around which to scale. Defaults to 0.
     * @param {number} z z coordinate of the point around which to scale. Defaults to 0.
     *
     * @return {Matrix} Result of scaling the current matrix.
     */
    scale(sx, sy, sz, x = 0, y = 0, z = 0) {
        // TODO

        let s = new Matrix([sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1]);
        return this.mult(s);
    }

    /**
     * Prints the matrix as an HTML table.
     *
     * @return {string} HTML table with the contents of the matrix.
     */
    asHTML() {
        let output = "<table>";

        for (let r = 0; r < 4; r++) {
            output += "<tr>";

            for (let c = 0; c < 4; c++) {
                output += "<td>" + this.getValue(r, c).toFixed(2) + "</td>";
            }

            output += "</tr>";
        }

        output += "</table>";

        return output; // TODO
    }
}


/**
 * Represents a vector in 3d space.
 */
class Vector {
    /**
     * Creates a vector. If no parameter is given, the vector is set to
     * all 0's. If values is provided it should be an array
     * and it will provide UP TO 3 values for the vector. If there are
     * less than 3 values, the remaining values in the array should
     * set to 0. If there are more than 3, the rest should be ignored.
     *
     * To see if values was passed to the function, you can check if
     *      typeof values !== "undefined"
     * This will be true if values has a value.
     *
     * @param {number[]} values (optional) An array of floating point values.
     *
     */
    constructor(values) {
        // TODO

        if (values !== "undefined") {
            this.x = values[0];
            this.y = values[1];
            this.z = values[2];
        } else {
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
        }
    }

    /**
     * Calculates the cross product of the current vector and the parameter.
     *
     * This should not change the current vector or the parameter.
     *
     * @param {Vector} v Vector to cross with the current vector.
     *
     * @return {Vector} The cross product of the current vector and the parameter.
     */
    crossProduct(v) {
        // TODO
        return Vector([this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x]);
    }

    /**
     * Calculates the dot product of the current vector and the parameter.
     *
     * This should not change the current vector or the parameter.
     *
     * @param {Vector} v Vector to dot with the current vector.
     *
     * @return {number} The dot product of the current vector and the parameter.
     */
    dotProduct(v) {
        // TODO

        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * Adds two Vectors (the current Vector and the parameter)
     *
     * This should not change the current vector or the parameter.
     *
     * @param {Vector} v Vector to add with the current vector.
     *
     * @return {number} The sum of the current vector and the parameter.
     */
    add(v) {
        // TODO

        return Vector([this.x + v.x, this.y + v.y, this.z + v.z]);
    }

    /**
     * Subtracts two Vectors (the current Vector and the parameter)
     *
     * This should not change the current vector or the parameter.
     *
     * @param {Vector} v Vector to subtract from the current vector.
     *
     * @return {number} The difference of the current vector and the parameter.
     */
    subtract(v) {
        // TODO

        return Vector([this.x - v.x, this.y - v.y, this.z - v.z]);
    }

    /**
     * Normalizes the current vector so that is has a
     * length of 1. The result is returned as a new
     * Matrix.
     *
     * This should not change the current vector.
     *
     * @return {Vector} A normalized vector with the same
     * direction as the current vector.
     */
    normalize() {
        // TODO
        let divisor = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
        if (divisor !== 0) {
            return Vector([this.x / divisor, this.y / divisor, this.z / divisor]);
        } else {
            console.error("Cannot divide by zero");
        }
    }

    /**
     * Gets the length (magnitude) of the current vector.
     *
     * @return {number} The length of the current vector.
     */
    length() {
        // TODO

        return Math.abs(Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2)));
    }

    /**
     * Scales the current vector by amount s and returns a
     * new Vector that is the result.
     *
     * This should not change the current vector.
     *
     * @param {number} s Amount to scale the vector.
     *
     * @returns {Vector} A new vector that is the result
     * of the current vector scaled by the parameter.
     */
    scale(s) {
        // TODO

        return Vector([this.x * s, this.y * s, this.z * s]);
    }

    /**
     * Returns the x value of the vector.
     *
     * @return {number} The x value of the vector.
     */
    getX() {
        // TODO

        return this.x;
    }

    /**
     * Returns the y value of the vector.
     *
     * @return {number} The y value of the vector.
     */
    getY() {
        // TODO

        return this.y;
    }

    /**
     * Returns the z value of the vector.
     *
     * @return {number} The z value of the vector.
     */
    getZ() {
        // TODO

        return this.z;
    }

    /**
     * Returns a Float32Array with the contents of the vector. The
     * data in the vector should be in the order [x, y, z, w]. This
     * makes it suitable for multiplying by a 4x4 matrix.
     *
     * The w value should always be 0.
     *
     * @return {Float32Array} The vector as a 4 element array.
     */
    getData() {
        // TODO

        return [this.x, this.y, this.z, 0];
    }
}

// TODO for P2 Add the Camera class

// allows the class to be send during testing
module.exports = {
    // Camera: Camera,  // TODO for P2 uncomment this line
    Matrix: Matrix,
    Vector: Vector
};
