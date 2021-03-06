/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "render" }] */

const sqaureVertex = `
attribute vec4 vertex;

void main() {
    // Assign a value to gl_Position
    gl_Position = vertex;
}

`;


/**
* @param {WebGLRenderingContext} gl WebGL context to draw to
* @param {Number} shaderType the type of shader
* @param {String} src source code
* @return {WebGLShader} compiled shader or null
*/
function loadShader(gl, shaderType, src) {
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
* @param {WebGLRenderingContext} gl Context to Draw to
* @param {String} vertexSrc Vertex Shader Code
* @param {String} fragmentSrc Fragment Shader Code
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


function render () {
    // DO stuff
    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById("myCanvas");
    /** @type {WebGLRenderingContext} */
    let gl = canvas.getContext("webgl");

    // Set width and height
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Enable depth test and clear depth
    gl.enable(gl.DEPTH_TEST);
    gl.clearDepth(1);

    gl.clearColor(0.8863, 0.4157, 0.9216, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.COLOR_DEPTH_BIT);
    star1(gl);
    star2(gl);
    star3(gl);
    hexagon(gl);
    circle(gl);
}


/**
 *
 * @param {WebGLRenderingContext} gl WebGL context to draw to
 */
function hexagon(gl) {
    let hexVertices = [-0.9, 0.75, 0,
        -0.75, 0.9, 0,
        -0.6, 0.9, 0,
        -0.45, 0.75, 0,
        -0.6, 0.6, 0,
        -0.75, 0.6, 0];

    // create buffer
    let hexBuffer = gl.createBuffer();
    // bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, hexBuffer);
    // buffer data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexVertices), gl.STATIC_DRAW);

    let program = createProgram(gl, sqaureVertex, document.getElementById("fragShader").innerText);

    let vert = gl.getAttribLocation(program, "vertex");
    gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vert);

    gl.useProgram(program);

    // make sure buffer is active
    gl.bindBuffer(gl.ARRAY_BUFFER, hexBuffer);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
}

/**
 *
 * @param {WebGLRenderingContext} gl WebGL context to draw to
 */
function star1(gl) {
    let starVertices = [0.5, 0.75, 0,
        0.25, 0.25, 0,
        0.65, 0.5, 0];


    // create buffer
    let starBuffer = gl.createBuffer();
    // bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
    // buffer data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(starVertices), gl.STATIC_DRAW);

    let program = createProgram(gl, sqaureVertex, document.getElementById("fragShader").innerText);

    let vert = gl.getAttribLocation(program, "vertex");
    gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vert);

    gl.useProgram(program);

    // make sure buffer is active
    gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function star2(gl) {
    let starVertices = [0.25, 0.6, 0,
        0.6, 0.6, 0,
        0.75, 0.25, 0];


    // create buffer
    let starBuffer = gl.createBuffer();
    // bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
    // buffer data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(starVertices), gl.STATIC_DRAW);

    let program = createProgram(gl, sqaureVertex, document.getElementById("fragShader").innerText);

    let vert = gl.getAttribLocation(program, "vertex");
    gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vert);

    gl.useProgram(program);

    // make sure buffer is active
    gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function star3(gl) {
    let starVertices = [0.6, 0.6, 0,
        0.75, 0.6, 0,
        0.64, 0.5, 0];


    // create buffer
    let starBuffer = gl.createBuffer();
    // bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
    // buffer data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(starVertices), gl.STATIC_DRAW);

    let program = createProgram(gl, sqaureVertex, document.getElementById("fragShader").innerText);

    let vert = gl.getAttribLocation(program, "vertex");
    gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vert);

    gl.useProgram(program);

    // make sure buffer is active
    gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function circle(gl) {
    let cRadius = 0.1;
    let circleVertices = [0, 0, 0];

    for (let i = 0; i < 360; i++) {
        let x = cRadius * Math.cos(i);
        let y = cRadius * Math.sin(i);
        circleVertices.push(x);
        circleVertices.push(y);
        circleVertices.push(0);
    }

    // create buffer
    let circleBuffer = gl.createBuffer();
    // bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
    // buffer data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleVertices), gl.STATIC_DRAW);

    let program2 = createProgram(gl, sqaureVertex, document.getElementById("fragShader2").innerText);

    let vert = gl.getAttribLocation(program2, "vertex");
    gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vert);

    gl.useProgram(program2);

    // make sure buffer is active
    gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 361);
}
