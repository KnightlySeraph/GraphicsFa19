
const sqaureVertex = `
attribute vec4 vertex;
uniform vec3 offset;

void main() {
    // Assign a value to gl_Position
    gl_Position = vertex + vec4(offset, 0);
}

`;


/**
* @param {WebGLRenderingContext} gl WebGL context to draw to
* @param {Number} shaderType the type of shader
* @param {String} src source code
* @return {WebGLShader} compiled shader or null
*/
function loadShader (gl, shaderType, src) {
let shader = gl.createShader(shaderType);
gl.shaderSource(shader, src);
gl.compileShader(shader);

if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Get compiler shaders
    console.error(gl.getShaderInfoLog(shader));
    // Delete the shader
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
    // Buffers
    // Vertices
    // Color
    // Location
    // Size
    // rotation
    // etc.

    // Constructor
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

    // Getters and Setters
    getLoc() {
        return this.loc;
    }

    setLoc(x, y, z) {
        this.loc.x = x;
        this.loc.y =y;
        this.loc.z = z;
    }

    getSize() {
        return this.size;
    }

    setSize(x, y, z) {
        this.size.x = x;
        this.size.y = y;
        this.size.z = z;
    }
    // render
    /**
     * Draws some shape
     * @param {WebGLRedneringContext} gl WebGL context to draw to
     */
    render (gl) {
        console.error("Implment function");
    }
}

class Sqaure extends Shape {

    constructor () {
        super();

        // Sqaure set up

    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    render (gl) {
        // Create the vertices for the sqaure
        let sqaureVertices = [-0.5, -0.5, 0,
        -0.5, 0.5, 0,
        0.5, -0.5, 0, 
        0.5, 0.5, 0];
        console.log(sqaureVertices);

        // create buffer
        let sqaureBuffer = gl.createBuffer();
        // bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, sqaureBuffer);
        // buffer data
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqaureVertices), gl.STATIC_DRAW);

        let program = createProgram(gl, sqaureVertex, document.getElementById("fragShader").innerText);

        let vert = gl.getAttribLocation(program, "vertex");
        gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vert);

        gl.useProgram(program);

        let pos = gl.getUniformLocation(program, "offset");
        gl.uniform3fv(pos, new Float32Array([this.loc.x, this.loc.y, this.loc.z]));

        // make sure buffer is active
        gl.bindBuffer(gl.ARRAY_BUFFER, sqaureBuffer);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    }
}