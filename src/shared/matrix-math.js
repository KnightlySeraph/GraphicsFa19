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
        let temp = [];
        if (values.length < 16) {
            console.warn("Matrix expected 16 values, adding values to matrix");
            for (let i = values.length; i < 15; i++) {
                temp[i] = 0;
            }
        } else if (values.length > 16) {
            console.warn("More values than expected, trimming to 16");
            for (let i = 0; i < 15; i++) {
                temp[i] = values[i];
            }
        } else {
            temp = values;
        }
        this.mat = this.transpose(temp);

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
     * @param {values []} values A list representing a matrix to be transposed
     *
     * @return {values []} A list with reordered indices
     */
    transpose(values) {
        // Copy the current matrix into a new one
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
     *
     * @return {number} The values stored at the index of the matrix
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
        // Vert stores the new data to put in the new matrix
        let vert = 0;
        // A new matrix to modify and then return
        let mMat = new Matrix();

        // Mutliplication loop
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
        // Create the translation matrix

        let t = new Matrix([1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1]);


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
        let xr = this.rotateX(thetax);
        let yr = this.rotateY(thetay);
        let zr = this.rotateZ(thetaz);

        return this.mult(xr).mult(yr).mult(zr);
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
    constructor(values = [0, 0, 0]) {
        // TODO

        if (values !== "undefined") {
            this.x = values[0];
            this.y = values[1];
            this.z = values[2];
        } else if (values.length > 3) {
            console.warn("Vector expected 3 values, " + values.length + " were passed");
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
        return new Vector([this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x]);
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
     * @return {Vector} The sum of the current vector and the parameter.
     */
    add(v) {
        // TODO
        // let vx = this.getX() + v.getX();
        // let vy = this.getY() + v.getY();
        // let vz = this.getZ() + v.getZ();
        // return vx + vy + vz;

        return new Vector([this.x + v.getX(), this.y + v.getY(), this.z + v.getZ()]);
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

        return new Vector([this.x - v.getX(), this.y - v.getY(), this.z - v.getZ()]);
    }

    /**
     *
     * @param {Vector} v The divisor vector
     *
     * @return {Vector} The divided vector
     */
    divide(v) {
        let margin = 0.0000001;
        return new Vector([this.x / (v.getX() + margin), this.y / (v.getY() + margin), this.z / (v.getZ() + margin)]);
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
            return new Vector([this.x / divisor, this.y / divisor, this.z / divisor]);
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
     *@return {number} The magnitude to the vector
     */
    mag() {
        let magnitude = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
        return magnitude;
    }

    /**
     * @return {Vector} Absolute value of the current vector
     */
    abs() {
        return new Vector([Math.abs(this.getX()), Math.abs(this.getY()), Math.abs(this.getZ())]);
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

        return new Vector([this.x * s, this.y * s, this.z * s]);
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
class Camera {
    constructor () {
        this.projectionMatrix = new Matrix();
        this.viewMatrix = new Matrix();
    }

    /**
     *
     * @param {Number} left Left
     * @param {Number} right Right
     * @param {Number} bottom Bottom
     * @param {Number} top Top
     * @param {Number} near Near
     * @param {Number} far Far
     *
     * @returns {Matrix} Calculated orthogonal matrix
     */
    ortho (left, right, bottom, top, near, far) {
        // Create orthgonal matrix
        let a = 2 / (right - left);
        let b = -((left + right) / (right - left));
        let c = 2 / (top - bottom);
        let d = -((top + bottom) / (top - bottom));
        let e = -(2 / (far - near));
        let f = -((far + near) / (far - near));

        let orthogonal = new Matrix([a, 0, 0, b,
            0, c, 0, d,
            0, 0, e, f,
            0, 0, 0, 1]);

        this.projectionMatrix = orthogonal;

        return this.projectionMatrix;

    }

    /**
     *
     * @param {Number} left Left
     * @param {Number} right Right
     * @param {Number} bottom Bottom
     * @param {Number} top Top
     * @param {Number} near Near
     * @param {Number} far Far
     *
     * @return {Matrix} New perspective matrix
     */
    frustum (left, right, bottom, top, near, far) {
        // Create a perspective matrix
        let a = 2 * near / (right - left);
        let b = (right + left) / (right - left);
        let c = 2 * near / (top - bottom);
        let d = (top + bottom) / (top - bottom);
        let e = -((far + near) / (far - near));
        let f = -2 * far * near / (far - near);

        let perspective = new Matrix([a, 0, b, 0,
            0, c, d, 0,
            0, 0, e, f,
            0, 0, -1, 0]);

        this.projectionMatrix = perspective;

        return this.projectionMatrix;

    }

    /**
     *
     * @param {Vector} loc The eye location
     * @param {Vector} look The location being looked at
     * @param {Vector} upVector The up vector
     *
     * @return {Matrix} A modified view matrix
     */
    lookAt (loc, look, upVector) {
        // Subtracting the at from the eye
        let n = loc.subtract(look);

        // Set up U vector
        let u = upVector.crossProduct(n);

        // Set up v vector
        let v = n.crossProduct(u);

        // Normalize the vectors
        n = n.normalize();
        u = u.normalize();
        v = v.normalize();

        // Create the rotation matrix
        let rot = new Matrix([u.getX(), u.getY(), u.getZ(), 0,
            v.getX(), v.getY(), v.getZ(), 0,
            n.getX(), n.getY(), n.getZ(), 0,
            0, 0, 0, 1]);

        // Create a translation matrix
        let trans = rot.translate(-loc.getX(), -loc.getY(), -loc.getZ());

        // Set the new view matrix
        this.viewMatrix = trans;

        return this.viewMatrix;
    }

    /**
     * @param {Vector} loc Location of the camera
     * @param {Vector} vnVector The view normal vector
     * @param {Vector} upVector The view up vector
     *
     * @return {Matrix} A calculated view matrix
     */
    viewPoint (loc, vnVector, upVector) {
        console.log("Ohh, look at me the view point function getting used!");
        // Create n prime
        let nprime = vnVector.normalize();

        // Create v vector
        let v = upVector.subtract(upVector.dotProduct(nprime).dotProduct(nprime));
        // create v prime
        let vprime = v.normalize();
        // create u prime
        let uprime = vprime.crossProduct(nprime);

        // Create the rotation matrix
        let rot = new Matrix([uprime.getX(), uprime.getY(), uprime.getZ(), 0,
            vprime.getX(), vprime.getY(), vprime.getZ(), 0,
            nprime.getX(), nprime.getY(), nprime.getZ(), 0,
            0, 0, 0, 1]);

        // Create a translation matrix
        let trans = new Matrix().translate(loc.getX(), loc.getY(), loc.getZ());

        // Set the new view matrix
        this.viewMatrix = rot.mult(trans);



        return this.viewMatrix;
    }

    /**
     * @return {Matrix} The view matrix of the camera
     */
    getView () {
        return this.viewMatrix;
    }

    /**
     * @return {Matrix} The projection matrix of the camera
     */
    getProjection () {
        return this.projectionMatrix;
    }
}
// allows the class to be send during testing
module.exports = {
    Camera: Camera,
    Matrix: Matrix,
    Vector: Vector
};
