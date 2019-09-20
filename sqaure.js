




function render() {
    // DO stuff
    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById("myCanvas")
    /** @type {WebGLRenderingContext} */
    let gl = canvas.getContext("webgl")

    // Set width and height
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Enable depth test and clear depth
    gl.enable(gl.DEPTH_TEST);
    gl.clearDepth(1);
    
    gl.clearColor(0.0, 0.0, 1.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.COLOR_DEPTH_BIT)
    sqaure(gl)
}

/**
 * Draws a sqaure
 * 
 * @param {WebGLRenderingContext} gl WebGL context to draw to
 */
function sqaure(gl) {
    // Create the vertices for the sqaure
    // let sqaureVertices = [-0.5, -0.5, 0,
    //     -0.5, 0.5, 0,
    //     0.5, -0.5, 0, 
    //     0.5, 0.5, 0];
    //     console.log(sqaureVertices);

    //     // create buffer
    //     let sqaureBuffer = gl.createBuffer();
    //     // bind buffer
    //     gl.bindBuffer(gl.ARRAY_BUFFER, sqaureBuffer);
    //     // buffer data
    //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqaureVertices), gl.STATIC_DRAW);

    //     let program = createProgram(gl, sqaureVertex, document.getElementById("fragShader").innerText);

    //     let vert = gl.getAttribLocation(program, "vertex");
    //     gl.vertexAttribPointer(vert, 3, gl.FLOAT, false, 0, 0);
    //     gl.enableVertexAttribArray(vert);

    //     gl.useProgram(program);

    //     // make sure buffer is active
    //     gl.bindBuffer(gl.ARRAY_BUFFER, sqaureBuffer);
    //     gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    let s = new Sqaure();
    s.render(gl);

        
}