/* global Matrix createProgram Vector*/
/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Cube"}] */
/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Tetra"}] */

/**
 * vertex shader
 */
const cubeVertex = `
    attribute vec4 cubeLocation;
    attribute vec4 cubeColor;

    uniform mat4 model;
    uniform mat4 projection;
    uniform mat4 view;

    varying lowp vec4 cColor;

    void main() {
       gl_Position = projection * view * model * cubeLocation;
       cColor = cubeColor;
    }

`;

/**
 * fragment shader
 */
const cubeFragment = `
    precision lowp float;
    varying lowp vec4 cColor;

    void main() {
        gl_FragColor = cColor;
    }
`;

class Shape {
    constructor (gl) {
        this.program = createProgram(gl, cubeVertex, cubeFragment);

        this.world = new Matrix().scale(0.5, 0.5, 0.5).translate(-0.5, -0.5, -0.5); // TODO modify this line


        // create identity matrices for each transformation
        this.scaleMatrix = new Matrix(); // scale matrix
        this.rotateMatrix = new Matrix(); // rotate matrix
        this.translateMatrix = new Matrix(); // translate
        // create identity matrix for the model
        // this.model = this.translateMatrix; // model matrix
        this.model = new Matrix();

        this.location = {
            x: 0,
            y: 0,
            z: 0
        };

        this.size = {
            x: 0,
            y: 0,
            z: 0
        };

        this.orientation = {
            x: 0,
            y: 0,
            z: 0
        };
    }

    /**
     * Creates the buffers for the program. Intended for internal use.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     */
    bufferData(gl) {
        this.verticesBuffer = gl.createBuffer();
        this.trianglesBuffer = gl.createBuffer();
        this.colorsBuffer = gl.createBuffer();
        this.edgesBuffer = gl.createBuffer();
        this.edgeColorsBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.triangles, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.edges, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.edgeColors, gl.STATIC_DRAW);

        this.buffered = true;
    }

    // render
    /**
     * Draws a cube using the provided context and the projection
     * matrix.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     * @param {Matrix} projection Projection matrix
     */
    render(gl, projection, view) {
        if (!this.buffered) {
            this.bufferData(gl);
        }

        // TODO Create bindings between the cube data and the shaders
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        let vert = gl.getAttribLocation(this.program, "cubeLocation");
        gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vert);
        // TODO bind verticesBuffer to the cubeLocation attribute (ARRAY_BUFFER)

        // TODO bind colorsBuffer to the cubeColor attribute (ARRAY_BUFFER)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        let col = gl.getAttribLocation(this.program, "cubeColor");
        gl.vertexAttribPointer(col, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(col);


        gl.useProgram(this.program);

        // TODO bind projection (get its data as an array) to the projection uniform (it is a matrix)
        // TODO bind this.model (get its data as an array) to the matModel uniform (it is a matrix)

        let model = gl.getUniformLocation(this.program, "model");
        gl.uniformMatrix4fv(model, false, this.getModel().getData());

        let proj = gl.getUniformLocation(this.program, "projection");
        gl.uniformMatrix4fv(proj, false, projection.getData());

        // Bind the view uniform
        let v = gl.getUniformLocation(this.program, "view");
        gl.uniformMatrix4fv(v, false, view.getData());


        if (!this.wire) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
            gl.drawElements(gl.TRIANGLES, this.triangles.length, gl.UNSIGNED_BYTE, 0);
        }

        // wire frame
        // TODO bind edgeColorsBuffer to the cubeColor attribute (ARRAY_BUFFER)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorsBuffer);
        let eCol = gl.getAttribLocation(this.program, "cubeColor");
        gl.vertexAttribPointer(eCol, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(eCol);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.drawElements(gl.LINES, this.edges.length, gl.UNSIGNED_BYTE, 0);
    }

    /**
     * Sets the this.scaleMatrix variable to a new scaling matrix that uses the
     * parameters for the scaling informaton.
     *
     * @param {number} sx Amount to scale the cube in the x direction
     * @param {number} sy Amount to scale the cube in the y direction
     * @param {number} sz Amount to scale the cube in the z direction
     */
    scale(sx, sy, sz) {
        // TODO
        this.scaleMatrix = new Matrix().scale(sx, sy, sz);
    }

    /**
     * Sets the this.rotateMatrix variable to a new rotation matrix that uses the
     * parameters for the rotation informaton.
     *
     * @param {number} xtheta Amount in degrees to rotate the cube around the x-axis
     * @param {number} ytheta Amount in degrees to rotate the cube around the y-axis
     * @param {number} ztheta Amount in degrees to rotate the cube around the z-axis
     */
    rotate(xtheta, ytheta, ztheta) {
        // TODO
        let x = new Matrix().rotateX(xtheta);
        let y = new Matrix().rotateY(ytheta);
        let z = new Matrix().rotateZ(ztheta);

        this.rotateMatrix = z.mult(y.mult(x));
    }

    /**
     * Sets the this.translateMatrix variable to a new translation matrix that uses the
     * parameters for the translation informaton.
     *
     * @param {number} tx Amount to translate the cube in the x direction.
     * @param {number} ty Amount to translate the cube in the y direction.
     * @param {number} tz Amount to translate the cube in the z direction.
     */
    trans(tx, ty, tz) {
        // TODO
        let t = new Matrix().translate(tx, ty, tz);

        this.translateMatrix = t;
    }

    /**
     *
     * @param {number} x The x location to move to
     * @param {number} y The y location to move to
     * @param {number} z The z location to move to
     */
    move (x, y, z) {
        let m = new Matrix().translate(x, y, z);

        this.translateMatrix = m;

        // Update the location variable
        this.location.x = x;
        this.location.y = y;
        this.location.z = z;
    }

    /**
     * @return {Array} An array of values containing the x,y,z location of the object
     */
    getLocation () {
        let tempList = [this.location.x, this.location.y, this.location.z];

        return tempList;
    }

    /**
     *
     * @param {number} w The width to size
     * @param {number} h The height to size
     * @param {number} d The depth to size
     */
    resize (w, h, d) {
        // Perform a scaling
        let s = new Matrix().scale(w, h, d);

        this.scaleMatrix = s;

        // Update the size variable
        this.size.x = w;
        this.size.y = h;
        this.size.z = d;
    }

    /**
     * @return {Array}  An array containing the width, height and depth of the object
     */
    getSize () {
        let temp = [this.size.x, this.size.y, this.size.z];

        return temp;
    }

    orient (tx, ty, tz) {
        let rot = new Matrix().rotate(tx, ty, tz);
        this.rotateMatrix = rot;

        // Update the values of orientation
        this.orientation.x = tx;
        this.orientation.y = ty;
        this.orientation.z = tz;
    }

    getOrientation () {
        let tempList = [this.orientation.x, this.orientation.y, this.orientation.z];
        return tempList;
    }

    /**
     * Creates a model matrix by combining the other matrices. The matrices should be applied
     * in the order:
     *  world
     *  scaleMatrix
     *  rotateMatrix
     *  translateMatrix
     *
     * @return {Matrix} A matrix with all of the transformations applied to the cube.
     */
    getModel() {
        // TODO update this.model and then return the result
        // this.model.translate();
        // this.model.rotate();
        // this.model.scale();
        this.model = this.translateMatrix.mult(this.rotateMatrix.mult(this.scaleMatrix.mult(this.world)));
        // this.model.world();
        return this.model;
    }
}

/**
 * Creates a cube centered on the origin with a size of 0.5 units. The cube is
 * shaded to show the color gamut.
 */
// eslint-disable-next-line no-unused-vars
class Cube extends Shape {
    /**
     * Creates a cube.
     *
     * @param {WebGLRenderingContext} gl WebGL Context
     */
    constructor(gl) {
        // shaders
        super(gl);
        this.wire = false;
        // vertices
        this.vertices = new Float32Array([
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
            1, 1, 0,
            1, 0, 1,
            0, 1, 1,
            1, 1, 1
        ]);

        // triangles
        this.triangles = new Uint8Array([
            0, 1, 3, 5, // bottom
            6, 7, // front
            2, 4, // top
            0, 1, // back
            1, 4, 5, 7, // right
            6, 2, 3, 0 // left
        ]);
        // colors
        this.colors = new Float32Array([
            0, 0, 0, 1, // black
            1, 0, 0, 1, // red
            0, 1, 0, 1, // grean
            0, 0, 1, 1, // blue
            1, 1, 0, 1, // yellow
            1, 0, 1, 1, // magenta
            0, 1, 1, 1, // cyan
            1, 1, 1, 1 // white
        ]);

        this.edges = new Uint8Array([
            0, 1,
            1, 4,
            4, 2,
            2, 0,
            3, 6,
            6, 7,
            7, 5,
            5, 3,
            0, 3,
            1, 5,
            2, 6,
            4, 7
        ]);

        // edge colors
        this.edgeColors = new Float32Array([
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1 // black
        ]);

        this.buffered = false;
    }

}

class Tetra extends Shape {
    /**
     * Creates a cube.
     *
     * @param {WebGLRenderingContext} gl WebGL Context
     */
    constructor(gl) {
        super(gl);
        this.wire = false;
        // vertices
        // this.vertices = new Float32Array([
        //     0, 0, 0,
        //     -1, -1, -1,
        //     1, -1, 1,
        //     0, -1, -1
        // ]);

        this.vertices = new Float32Array([
            0, 0, 0,
            -1, -1, 1,
            1, -1, 1,
            0, -1, -1,
            -1, -1, 1,
            1, -1, 1
        ]);

        // triangles
        this.triangles = new Uint8Array([
            0, 1, 3, 5, // bottom
            6, 7, // front
            2, 4, // top
            0, 1, // back
            1, 4, 5, 7, // right
            6, 2, 3, 0 // left
        ]);
        // colors
        this.colors = new Float32Array([
            0, 0, 0, 1, // black
            1, 0, 0, 1, // red
            0, 1, 0, 1, // grean
            0, 0, 1, 1, // blue
            1, 1, 0, 1, // yellow
            1, 0, 1, 1, // magenta
            0, 1, 1, 1, // cyan
            1, 1, 1, 1 // white
        ]);

        this.edges = new Uint8Array([
            0, 1,
            1, 4,
            4, 2,
            2, 0,
            3, 6,
            6, 7,
            7, 5,
            5, 3,
            0, 3,
            1, 5,
            2, 6,
            4, 7
        ]);

        // edge colors
        this.edgeColors = new Float32Array([
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1 // black
        ]);

        // move from model coordinates to world coordinates.
        // TODO The cube is defined to be 1 unit is size with one corner on the origin
        // TODO Move it so it is centered on the origin and scale it so it is half size.
        // TODO Assign the value to this.world.
        // TODO modify this line
        this.world = new Matrix().scale(0.5, 0.5, 0.5).translate(-0.5, -0.5, -0.5); // TODO modify this line


        // create identity matrices for each transformation
        this.scaleMatrix = new Matrix(); // scale matrix
        this.rotateMatrix = new Matrix(); // rotate matrix
        this.translateMatrix = new Matrix(); // translate
        // create identity matrix for the model
        // this.model = this.translateMatrix; // model matrix
        this.model = new Matrix();

        this.location = {
            x: 0,
            y: 0,
            z: 0
        };

        this.size = {
            x: 0,
            y: 0,
            z: 0
        };

        this.orientation = {
            x: 0,
            y: 0,
            z: 0
        };


        this.buffered = false;
    }
}

class Circle extends Shape {

    constructor (gl, sides) {
        super(gl);
        // Shaders
        this.program = createProgram(gl, cubeVertex, cubeFragment);

        this.circleVertices = [0, 0, 0];
        this.cRadius = 1;

        // Setup vertices for a circle
        for (let i = 0; i < 360; i++) {
            let x = this.cRadius * Math.cos(i);
            let y = this.cRadius * Math.sin(i);

            // Push stuff
            this.circleVertices.push(x);
            this.circleVertices.push(0);
            this.circleVertices.push(y);
        }


        this.vertices = new Float32Array(this.cylinderVertices);

        // triangles
        this.triangles = new Uint8Array([
            0, 1, 3, 5, // bottom
            6, 7, // front
            2, 4, // top
            0, 1, // back
            1, 4, 5, 7, // right
            6, 2, 3, 0 // left
        ]);
        // colors
        this.colors = new Float32Array([
            0, 0, 0, 1, // black
            1, 0, 0, 1, // red
            0, 1, 0, 1, // grean
            0, 0, 1, 1, // blue
            1, 1, 0, 1, // yellow
            1, 0, 1, 1, // magenta
            0, 1, 1, 1, // cyan
            1, 1, 1, 1 // white
        ]);

        this.edges = new Uint8Array([
            0, 1,
            1, 4,
            4, 2,
            2, 0,
            3, 6,
            6, 7,
            7, 5,
            5, 3,
            0, 3,
            1, 5,
            2, 6,
            4, 7
        ]);

        // edge colors
        this.edgeColors = new Float32Array([
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1 // black
        ]);

        // move from model coordinates to world coordinates.
        // TODO The cube is defined to be 1 unit is size with one corner on the origin
        // TODO Move it so it is centered on the origin and scale it so it is half size.
        // TODO Assign the value to this.world.
        // TODO modify this line
        this.world = new Matrix().scale(0.5, 0.5, 0.5).translate(-0.5, -0.5, -0.5); // TODO modify this line


        // create identity matrices for each transformation
        this.scaleMatrix = new Matrix(); // scale matrix
        this.rotateMatrix = new Matrix(); // rotate matrix
        this.translateMatrix = new Matrix(); // translate
        // create identity matrix for the model
        // this.model = this.translateMatrix; // model matrix
        this.model = new Matrix();

        this.location = {
            x: 0,
            y: 0,
            z: 0
        };

        this.size = {
            x: 0,
            y: 0,
            z: 0
        };

        this.orientation = {
            x: 0,
            y: 0,
            z: 0
        };


        this.buffered = false;
    }

    // Overloaded Render function
    // render
    /**
     * Draws a cube using the provided context and the projection
     * matrix.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     * @param {Matrix} projection Projection matrix
     */
    render(gl, projection, view) {
        if (!this.buffered) {
            this.bufferData(gl);
        }

        // TODO Create bindings between the cube data and the shaders
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        let vert = gl.getAttribLocation(this.program, "cubeLocation");
        gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vert);
        // TODO bind verticesBuffer to the cubeLocation attribute (ARRAY_BUFFER)

        // TODO bind colorsBuffer to the cubeColor attribute (ARRAY_BUFFER)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        let col = gl.getAttribLocation(this.program, "cubeColor");
        gl.vertexAttribPointer(col, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(col);


        gl.useProgram(this.program);

        // TODO bind projection (get its data as an array) to the projection uniform (it is a matrix)
        // TODO bind this.model (get its data as an array) to the matModel uniform (it is a matrix)

        let model = gl.getUniformLocation(this.program, "model");
        gl.uniformMatrix4fv(model, false, this.getModel().getData());

        let proj = gl.getUniformLocation(this.program, "projection");
        gl.uniformMatrix4fv(proj, false, projection.getData());

        // Bind the view uniform
        let v = gl.getUniformLocation(this.program, "view");
        gl.uniformMatrix4fv(v, false, view.getData());


        if (!this.wire) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
            gl.drawElements(gl.TRIANGLE_FAN, this.triangles.length, gl.UNSIGNED_BYTE, 0);
        }

        // wire frame
        // TODO bind edgeColorsBuffer to the cubeColor attribute (ARRAY_BUFFER)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorsBuffer);
        let eCol = gl.getAttribLocation(this.program, "cubeColor");
        gl.vertexAttribPointer(eCol, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(eCol);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.drawElements(gl.LINES, this.edges.length, gl.UNSIGNED_BYTE, 0);
    }

}

class Cylinder extends Shape {

    constructor (gl, sides) {
        super(gl);
        // Shaders
        this.program = createProgram(gl, cubeVertex, cubeFragment);

        this.cylinderVertices = [0, 1, 1];
        this.cRadius = 1;

        // Setup top vertices for the cylinder
        for (let i = 0; i < sides; i++) {
            let x = this.cRadius * Math.cos(i);
            let z = this.cRadius * Math.sin(i);

            // Top
            this.cylinderVertices.push(x);
            this.cylinderVertices.push(1);
            this.cylinderVertices.push(z);

            // Bottom
            this.cylinderVertices.push(x);
            this.cylinderVertices.push(-1);
            this.cylinderVertices.push(z);

        }


        this.vertices = new Float32Array(this.cylinderVertices);

        // triangles
        this.triangles = new Uint8Array([
            0, 1, 3, 5, // bottom
            6, 7, // front
            2, 4, // top
            0, 1, // back
            1, 4, 5, 7, // right
            6, 2, 3, 0 // left
        ]);
        // colors
        this.colors = new Float32Array([
            0, 0, 0, 1, // black
            1, 0, 0, 1, // red
            0, 1, 0, 1, // grean
            0, 0, 1, 1, // blue
            1, 1, 0, 1, // yellow
            1, 0, 1, 1, // magenta
            0, 1, 1, 1, // cyan
            1, 1, 1, 1 // white
        ]);

        this.edges = new Uint8Array([
            0, 1,
            1, 4,
            4, 2,
            2, 0,
            3, 6,
            6, 7,
            7, 5,
            5, 3,
            0, 3,
            1, 5,
            2, 6,
            4, 7
        ]);

        // edge colors
        this.edgeColors = new Float32Array([
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1 // black
        ]);

        // move from model coordinates to world coordinates.
        // TODO The cube is defined to be 1 unit is size with one corner on the origin
        // TODO Move it so it is centered on the origin and scale it so it is half size.
        // TODO Assign the value to this.world.
        // TODO modify this line
        this.world = new Matrix().scale(0.5, 0.5, 0.5).translate(-0.5, -0.5, -0.5); // TODO modify this line


        // create identity matrices for each transformation
        this.scaleMatrix = new Matrix(); // scale matrix
        this.rotateMatrix = new Matrix(); // rotate matrix
        this.translateMatrix = new Matrix(); // translate
        // create identity matrix for the model
        // this.model = this.translateMatrix; // model matrix
        this.model = new Matrix();

        this.location = {
            x: 0,
            y: 0,
            z: 0
        };

        this.size = {
            x: 0,
            y: 0,
            z: 0
        };

        this.orientation = {
            x: 0,
            y: 0,
            z: 0
        };


        this.buffered = false;
    }

}

class Sphere extends Shape {
    constructor(gl, detail) {
        // shaders
        super(gl);
        this.wire = false;


        this.triangleList = [];
        
        let t1 = new Triangle([0, 1, 0,
            -1, 0, 1,
            1, 0, 1]);
        let t2 = new Triangle([0, 1, 0,
            1, 0, 1,
            1, 0, -1]);
        let t3 = new Triangle([0, 1, 0,
            1, 0, -1,
            -1, 0, -1]);
        let t4 = new Triangle([0, 1, 0,
            -1, 0, 1,
            -1, 0, -1]);
        let t5 = new Triangle([0, -1, 0,
            -1, 0, 1,
            1, 0, 1]);
        let t6 = new Triangle([0, -1, 0,
            1, 0, 1,
            1, 0, -1]);
        let t7 = new Triangle([0, -1, 0,
            1, 0, -1,
            -1, 0, -1]);
        let t8 = new Triangle([0, -1, 0,
            1, 0, 1,
            1, 0, -1]);

        this.triangleList.push(t1);
        this.triangleList.push(t2);
        this.triangleList.push(t3);
        this.triangleList.push(t4);
        this.triangleList.push(t5);
        this.triangleList.push(t6);
        this.triangleList.push(t7);
        this.triangleList.push(t8);

        this.points = [];
        this.tempList = [];

        // Tesselate
        if (detail !== 0.5) {
   
            for (let i = 0; i < detail; i++) {

                for (let x = 0; x < this.triangleList.length; x++) {

                    // Get Tesselated list of new triangles
                    let t = this.triangleList[x].tesselate();

                    for (let z = 0; z < t.length; z++) {
                        this.tempList.push(t[z]);
                    }

                }

                // Update the triangle list
                this.triangleList = [];
                this.triangleList = this.tempList;
                // Clear the temp list
                this.tempList = [];
            }
        }

        
        // Populate points
        for (let i = 0; i < this.triangleList.length; i++) {
            // Unpack the returned list
            let d = this.triangleList[i].getData();

            // push points
            this.points.push(d[0]);
            this.points.push(d[1]);
            this.points.push(d[2]);
            this.points.push(d[3]);
            this.points.push(d[4]);
            this.points.push(d[5]);
            this.points.push(d[6]);
            this.points.push(d[7]);
            this.points.push(d[8]);
        }
        console.log(this.points);

        // create base octahedron
        this.vertices = new Float32Array(this.points);
        this.triangles = new Uint16Array(this.points);


        // // triangles
        // this.triangles = new Uint8Array([
        //     0, 1, 3, 5, // bottom
        //     6, 7, // front
        //     2, 4, // top
        //     0, 1, // back
        //     1, 4, 5, 7, // right
        //     6, 2, 3, 0 // left
        // ]);
        // colors
        this.colors = new Float32Array([
            0, 0, 0, 1, // black
            1, 0, 0, 1, // red
            0, 1, 0, 1, // grean
            0, 0, 1, 1, // blue
            1, 1, 0, 1, // yellow
            1, 0, 1, 1, // magenta
            0, 1, 1, 1, // cyan
            1, 1, 1, 1 // white
        ]);

        this.edges = new Uint8Array([
            0, 1,
            1, 4,
            4, 2,
            2, 0,
            3, 6,
            6, 7,
            7, 5,
            5, 3,
            0, 3,
            1, 5,
            2, 6,
            4, 7
        ]);

        // edge colors
        this.edgeColors = new Float32Array([
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1, // black
            0, 0, 0, 1 // black
        ]);

        this.buffered = false;
    }
}

class Triangle {
    // Split into vertices
    constructor (data = [0, 0, 0, 0, 0, 0, 0, 0, 0], radius = 1) {
        // Split data into vertices
        this.vertex1 = [data[0], data[1], data[2]];
        this.vertex2 = [data[3], data[4], data[5]];
        this.vertex3 = [data[6], data[7], data[8]];

        // Set up a blank list of triangles
        this.triangles = [];

        // Set a radius
        this.radius = radius;
    }

    midpoint (vert1, vert2) {
        // Set new points
        let x = (vert1[0] + vert2[0]) / 2;
        let y = (vert1[1] + vert2[1]) / 2;
        let z = (vert1[2] + vert2[2]) / 2;

        return [x, y, z];
    }

    tesselate () {
        // Create four trinagle based on midpoints and data

        // Get Midpoints
        let mpVert1Vert2 = this.midpoint(this.vertex1, this.vertex2);
        let mpVert1Vert3 = this.midpoint(this.vertex1, this.vertex3);
        let mpVert2Vert3 = this.midpoint(this.vertex2, this.vertex3);

        // Create triangles
        let t1 = new Triangle([this.vertex1[0], this.vertex1[1], this.vertex1[2],
            mpVert1Vert2[0], mpVert1Vert2[1], mpVert1Vert2[2],
            mpVert1Vert3[0], mpVert1Vert3[1], mpVert1Vert3[2]]);

        let t2 = new Triangle([this.vertex2[0], this.vertex2[1], this.vertex2[2],
            mpVert1Vert3[0], mpVert1Vert3[1], mpVert1Vert3[3],
            mpVert2Vert3[0], mpVert2Vert3[1], mpVert2Vert3[2]]);

        let t3 = new Triangle([this.vertex3[0], this.vertex3[1], this.vertex3[2],
            mpVert1Vert2[0], mpVert1Vert2[1], mpVert1Vert2[2],
            mpVert2Vert3[0], mpVert2Vert3[1], mpVert2Vert3[2]]);

        let t4 = new Triangle([mpVert1Vert2[0], mpVert1Vert2[1], mpVert1Vert2[2],
            mpVert1Vert3[0], mpVert1Vert3[1], mpVert1Vert3[2],
            mpVert2Vert3[0], mpVert2Vert3[1], mpVert2Vert3[2]]);
        
        // Pop points to surface of sphere
        t1 = this.pushPoints(t1);
        t2 = this.pushPoints(t2);
        t3 = this.pushPoints(t3);
        t4 = this.pushPoints(t4);

        // Push to triangle list
        this.triangles.push(t1);
        this.triangles.push(t2);
        this.triangles.push(t3);
        this.triangles.push(t4);

        return this.triangles;
    }

    pushPoints (triangle) {
        let p = triangle.getData();

        let vert1 = [p[0], p[1], p[2]];
        let vert2 = [p[3], p[4], p[5]];
        let vert3 = [p[6], p[7], p[8]];

        let vec1 = new Vector(vert1);
        let vec2 = new Vector(vert2);
        let vec3 = new Vector(vert3);

        vec1 = vec1.normalize();
        vec2 = vec2.normalize();
        vec3 = vec3.normalize();

        vec1 = vec1.scale(this.radius);
        vec2 = vec2.scale(this.radius);
        vec3 = vec3.scale(this.radius);

        return new Triangle([vec1.getX(), vec1.getY(), vec1.getZ(),
            vec2.getX(), vec2.getY(), vec2.getZ(),
            vec3.getX(), vec3.getY(), vec3.getZ()]);

    }

    getList () {
        return this.triangles;
    }

    getData () {
        return [this.vertex1[0], this.vertex1[1], this.vertex1[2], this.vertex2[0], this.vertex2[1], this.vertex2[2], this.vertex3[0], this.vertex3[1], this.vertex3[2]];
    }
}
