/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Square" }] */

const squareVertex = `

    attribute vec4 vertex;
    uniform vec3 offset;

    void main() {
        // assign a value to gl_Position
        gl_Position = vertex + vec4(offset, 0);
    }

`;

/**
 *
 * @param {String} src Source code
 * @param {Number} shaderType
 * @param {WebGLRenderingContext} gl WebGL context to draw to
 *
 * @return {WebGLShader} Compiled shader or null
 */
function loadShader(gl, shaderType, src) {
    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // get the compiler errors
        console.error(gl.getShaderInfoLog(shader));
        // delete the shader
        gl.deleteShader(shader);

        return null;
    }

    return shader;
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {String} vertexSrc
 * @param {String} fragmentSrc
 */
function createProgram(gl, vertexSrc, fragmentSrc) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSrc);
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);

        return null;
    }

    return program;
}


class Shape {

    // buffers
    // vertices
    // color
    // location
    // size
    // rotation
    // etc.

    // constructor
    // TODO constructor
    constructor() {

        this.program = null;
        this.buffer = null;
        this.vertices = null;

        this.color = [0, 0, 0, 1];

        this.loc = {
            x: 0,
            y: 0,
            z: 0
        };

        this.size = {
            width: 1,
            height: 1
        };


    }

    // getters/setter
    getLoc() {
        return this.loc;
    }

    setLoc(x, y, z) {
        this.loc.x = x;
        this.loc.y = y;
        this.loc.z = z;
    }


    // render
    /**
 * Draws something
 *
 * @param {WebGLRenderingContext} _gl WebGL context to draw to
 */
    // eslint-disable-next-line no-unused-vars
    render(gl) {
        console.error("Implement me!");
        // throw exception?
    }
}

class Square extends Shape {

    constructor() {
        super();

        // square's setup
    }

    // render
    /**
 * Draws something
 *
 * @param {WebGLRenderingContext} gl WebGL context to draw to
 */
    render(gl) {
        // create the verices for the square
        let squareVertices = [-0.5, -0.5, 0,
            -0.5, 0.5, 0,
            0.5, -0.5, 0,
            0.5, 0.5, 0];
        // squareVertices.push(0, 1, 0);
        console.log("Square:", squareVertices);

        // create buffer
        let squareBuffer = gl.createBuffer();
        // bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
        // buffer the data
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertices), gl.STATIC_DRAW);

        let program = createProgram(gl, squareVertex,
            document.getElementById("fragShader").innerText);

        let vert = gl.getAttribLocation(program, "vertex");
        gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vert);

        gl.useProgram(program);

        let pos = gl.getUniformLocation(program, "offset");
        gl.uniform3fv(pos, new Float32Array([this.loc.x, this.loc.y, this.loc.z]));


        // make sure the buffer is active
        gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    }

}

