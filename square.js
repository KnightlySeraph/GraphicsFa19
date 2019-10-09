/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "(render)|(square)" }] */
/* globals Square */


function render(canvas, gl) {
    // DO stuff
    // console.info("This ran.");
    // /** @type {HTMLCanvasElement} */
    // let canvas = document.getElementById("myCanvas");
    // /** @type {WebGLRenderingContext} */
    // let gl = canvas.getContext("webgl");

    // TODO set width/height
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // TODO set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    // TODO enable depth test and clear depth
    gl.enable(gl.DEPTH_TEST);
    gl.clearDepth(1);

    gl.clearColor(1.0, 0.0, 0.0, 1.0);

    // square(gl);
}


var speedx = 0.05;
var speedy = 0.05;
var speedz = 0;
var rotateZ = 0;

let s = new Square();
/**
 * Draws a square
 *
 * @param {WebGLRenderingContext} gl WebGL context to draw to
 */
function square(gl) {
    // let canvas = document.getElementById("myCanvas");
    // /** @type {WebGLRenderingContext} */
    // let gl = canvas.getContext("webgl");
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // s.setLoc(0.25, -0.25, 0);
    let currLoc = s.getLoc();
    if (currLoc.x > 1 || currLoc.x < -1) {
        speedx *= -1;
    }
    if (currLoc.y > 1 || currLoc.y < -1) {
        speedy *= -1;
    }
    if (currLoc.z > 1 || currLoc.z < -1) {
        speedz *= -1;
    }
    s.setLoc(currLoc.x + speedx, currLoc.y + speedy, currLoc.z + speedz);
    rotateZ += Math.PI / 45;
    s.setRotation(0, 0, rotateZ);
    s.render(gl);

    // console.info("Animated", time);

    // requestAnimationFrame(square);
    //     // create the verices for the square
    //     let squareVertices = [-0.5, -0.5, 0,
    //         -0.25, 0.5, 0,
    //         0.5, -0.5, 0,
    //         0.5, 0.75, 0];
    //    // squareVertices.push(0, 1, 0);
    //     console.log("Square:", squareVertices);

    //     // create buffer
    //     let squareBuffer = gl.createBuffer();
    //     // bind buffer
    //     gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
    //     // buffer the data
    //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertices), gl.STATIC_DRAW);

    //     let program = createProgram(gl, squareVertex,
    //         document.getElementById("fragShader").innerText);

    //     let vert = gl.getAttribLocation(program, "vertex");
    //     gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
    //     gl.enableVertexAttribArray(vert);

    //     gl.useProgram(program);

    //     // make sure the buffer is active
    //     gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
    //     gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


}
