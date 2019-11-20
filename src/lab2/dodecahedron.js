/* global Matrix createProgram Vector */
/* eslint no-unused-vars: ["warn", { "varsIgnorePattern": "Dodecahedron" }] */

/**
 * vertex shader
 */
const decVertex = `
    attribute vec4 location;
    
    uniform mat4 view;
    uniform mat4 model;
    uniform mat4 projection;

    // TODO Need the normal and the current position
    // in WORLD coordinates.
    // Need to be passed to the fragment shader
    
    void main() {
        gl_Position = projection * view * model * location;
    }
`;

/**
 * fragment shader
 */
const decFragment = `
    precision mediump float;

    // TODO Need the location of the viewer 
    // and the point light source
    uniform vec4 lightPos;
    // uniform vec4 point_light;
    
    // TODO get the data from the Vertex shader
   
    // TODO Need values to compute the light illumination
    // Light Values
    uniform vec4 ambLight;
    uniform vec4 ambReflection;
    uniform vec4 difLight;
    uniform vec4 difReflection;
    uniform vec4 specLight;
    uniform vec4 specReflection;

    // Use Phong reflection model
    // Assume that it is a point source, so calculate distance 
    // for the diffuse and specular light

    // Coeffecient Numbers
    uniform float a;
    uniform float b;
    uniform float c;

    // Other
    uniform mat4 fmodel;
    uniform vec4 normal;

    // Specular
    uniform float shiny;

    void main() {
        // TODO Calculate the vectors you need
        // Posiiton of the light
        vec4 light = normalize(-lightPos);

        // TODO calculate distance
        // position of noral minus position of light
        float dist = distance(normal, light);
        float co = (1.0) / (a + (b * dist) + (c * (dist * dist)));
        
        // TODO calculate the illumination
        // If the light is not hitting the front of the polygon, 
        // the color is black.

        // Ambient Illumination
        // Multiply Light times the material
        vec4 aI = ambLight * ambReflection;

        // Diffuse Illumination
        // Diff Dot
        float dDot = max(dot(light, normalize(fmodel * normal)), 0.0);
        // Diffuse Light
        vec4 dI = difLight * dDot;
        dI = normalize(dI);

        // Specular Illumination
        float rv = dot(light, normalize(fmodel * normal));
        rv = pow(rv, shiny);
        rv = max(rv, 0.0);
        rv = rv;
        vec4 sI = rv * specLight * specReflection;

               
        // TODO update color
        gl_FragColor = co * (sI + dI + aI); // update 
        gl_FragColor.a = 1.0; // make sure the alpha is 1
    }
`;

/**
 * vertex shader
 */
const edgeVertex = `
    attribute vec4 location;

    uniform mat4 view;
    uniform mat4 model;
    uniform mat4 projection;

    void main() {
       gl_Position = projection * view * model * location;
    }

`;

/**
 * fragment shader
 */
const edgeFragment = `
    precision mediump float;
    
    uniform vec4 cColor;    

    void main() {
       gl_FragColor = cColor;
    }
`;

/**
 * Creates a dodecahedron centered on the origin.
 */
class Dodecahedron {
    /**
     * Creates a dodecahedron.
     *
     * @param {WebGLRenderingContext} gl WebGL Context
     */
    constructor(gl) {
        // shaders
        this.wire = false;
        this.decProgram = createProgram(gl, decVertex, decFragment);

        // vertices
        let gRatio = (1 + Math.sqrt(5)) / 2;
        let invGRatio = 1 / gRatio;

        this.vertices = new Float32Array([
            1, 1, 1, // 0
            1, 1, -1,
            1, -1, 1,
            1, -1, -1,
            -1, 1, 1, // 4
            -1, 1, -1,
            -1, -1, 1,
            -1, -1, -1,
            0, invGRatio, gRatio, // 8
            0, invGRatio, -gRatio,
            0, -invGRatio, gRatio,
            0, -invGRatio, -gRatio,
            invGRatio, gRatio, 0, // 12
            invGRatio, -gRatio, 0,
            -invGRatio, gRatio, 0,
            -invGRatio, -gRatio, 0,
            gRatio, 0, invGRatio, // 16
            gRatio, 0, -invGRatio,
            -gRatio, 0, invGRatio,
            -gRatio, 0, -invGRatio
        ]);

        // triangles
        this.triangles = new Uint8Array([
            7, 11, 3, 13, 15,
            7, 19, 5, 9, 11,
            7, 15, 6, 18, 19,
            4, 14, 5, 19, 18,
            1, 17, 3, 11, 9,
            12, 1, 9, 5, 14,
            2, 10, 6, 15, 13,
            16, 2, 13, 3, 17,
            18, 6, 10, 8, 4,
            0, 12, 14, 4, 8,
            0, 8, 10, 2, 16,
            0, 16, 17, 1, 12
        ]);

        // move from model coordinates to world coordinates.
        this.world = new Matrix().scale(0.25, 0.25, 0.25);

        // create identity matrices for each transformation
        this.scaleMatrix = new Matrix(); // scale matrix
        this.rotateMatrix = new Matrix(); // rotate matrix
        this.translateMatrix = new Matrix(); // translate

        this.lightPosition = new Float32Array([0, 1, 1, 0]);

        this.ambientColor = new Float32Array([1, 1, 1, 1]);
        this.diffuseColor = new Float32Array([1, 1, 1, 1]);
        this.specularColor = new Float32Array([1, 1, 1, 1]);

        this.ambientMaterial = new Float32Array([0.5, 0.5, 0.5, 1]);
        this.diffuseMaterial = new Float32Array([0.5, 0.5, 0.5, 1]);
        this.specularMaterial = new Float32Array([0.5, 0.5, 0.5, 1]);

        this.shiny = 1;

        this.a = 0.25;
        this.b = 0.20;
        this.c = 0.15;

        this.aRay = new Ray(gl);
        this.aRay.rotate(new Vector(this.lightPosition));
        this.aRay.setColor(this.ambientColor);

        this.dRay = new Ray(gl);
        this.dRay.rotate(new Vector(this.lightPosition));
        this.dRay.setColor(this.ambientColor);
        this.dRay.translate(0.02, 0.05, 0.02);

        this.sRay = new Ray(gl);
        this.sRay.rotate(new Vector(this.lightPosition));
        this.sRay.setColor(this.ambientColor);
        this.sRay.translate(-0.02, -0.05, -0.02);

        this.buffered = false;
    }

    /**
     * Creates the buffers for the program. Intended for internal use.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     */
    bufferData(gl) {
        this.verticesBuffer = gl.createBuffer();
        this.trianglesBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.triangles, gl.STATIC_DRAW);

        this.buffered = true;
    }

    // render
    /**
     * Draws a dodecahedron using the provided context and the projection
     * matrix.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     * @param {Matrix} projection Projection matrix
     */
    render(gl, projection, view) {
        if (!this.buffered) {
            this.bufferData(gl);
        }

        let verLoc = gl.getAttribLocation(this.decProgram, "location");
        let matProjection = gl.getUniformLocation(this.decProgram, "projection");
        let matModel = gl.getUniformLocation(this.decProgram, "model");
        let matView = gl.getUniformLocation(this.decProgram, "view");

        gl.useProgram(this.decProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(verLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(verLoc);

        gl.uniformMatrix4fv(matProjection, false, projection.getData());
        gl.uniformMatrix4fv(matModel, false, this.getModel().getData());
        gl.uniformMatrix4fv(matView, false, view.getData());

        // TODO bind all new uniform and attribute values in the shaders
        // fragment shader uniforms
        // let viewer = gl.getUniformLocation(this.decProgram, "v");
        // let point = gl.getUniformLocation(this.decProgram, "p");

        // gl.uniform4fv(viewer, this.viewer.getData());
        
        // gl.uniform4fv(point, this.point);

        // Materials and Color binds
        let ambColor = gl.getUniformLocation(this.decProgram, "ambColor");
        let difColor = gl.getUniformLocation(this.decProgram, "difColor");
        let specColor = gl.getUniformLocation(this.decProgram, "specColor");

        let ambMaterial = gl.getUniformLocation(this.decProgram, "ambReflection");
        let difMaterial = gl.getUniformLocation(this.decProgram, "difReflection");
        let specMaterial = gl.getUniformLocation(this.decProgram, "specReflection");

        gl.uniform4fv(ambColor, this.ambientColor);
        gl.uniform4fv(difColor, this.diffuseColor);
        gl.uniform4fv(specColor, this.specularColor);

        gl.uniform4fv(ambMaterial, this.ambientMaterial);
        gl.uniform4fv(difMaterial, this.diffuseMaterial);
        gl.uniform4fv(specMaterial, this.specularMaterial);

        // Light binds
        let lPos = gl.getUniformLocation(this.decProgram, "lightPos");
        gl.uniform4fv(lPos, this.lightPosition);

        // Specular Stuff
        let s = gl.getUniformLocation(this.decProgram, "shiny");
        gl.uniform1f(s, this.shiny);

        // Other Binds
        // Model
        let mod = gl.getUniformLocation(this.decProgram, "fmodel");
        gl.uniformMatrix4fv(mod, false, this.getModel().getData());

        // Coeffcient binds
        let aB = gl.getUniformLocation(this.decProgram, "a");
        let bB = gl.getUniformLocation(this.decProgram, "b");
        let cB = gl.getUniformLocation(this.decProgram, "c");

        gl.uniform1f(aB, this.a);
        gl.uniform1f(bB, this.b);
        gl.uniform1f(cB, this.c);

        // Normals
        let norm = gl.getUniformLocation(this.decProgram, "normal");


        // Draw shape
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
        for (let i = 0; i < 12; i++) {
            // Send normals to shaders
            gl.uniform4fv(norm, this.getNormal(i).getData());
            gl.drawElements(gl.TRIANGLE_FAN, 5, gl.UNSIGNED_BYTE, i * 5);
        }

        // Draw light rays
        this.aRay.render(gl, projection, view);
        this.dRay.render(gl, projection, view);
        this.sRay.render(gl, projection, view);
    }

    /**
     * Multiplies two 4 element arrays (colors) by position.
     *
     * @param {Number[]} v1 First array
     * @param {Number[]} v2 Second array
     */
    multArray(v1, v2) {
        return new Float32Array([v1[0] * v2[0], v1[1] * v2[1], v1[2] * v2[2], v1[3] * v2[3]]);
    }

    /**
     * Sets the this.scaleMatrix variable to a new scaling matrix that uses the
     * parameters for the scaling informaton.
     *
     * @param {number} sx Amount to scale the shape in the x direction
     * @param {number} sy Amount to scale the shape in the y direction
     * @param {number} sz Amount to scale the shape in the z direction
     */
    scale(sx, sy, sz) {
        this.scaleMatrix = new Matrix();
        this.scaleMatrix = this.scaleMatrix.scale(sx, sy, sz);
    }

    /**
     * Sets the this.rotateMatrix variable to a new rotation matrix that uses the
     * parameters for the rotation informaton.
     *
     * @param {number} xtheta Amount in degrees to rotate the shape around the x-axis
     * @param {number} ytheta Amount in degrees to rotate the shape around the y-axis
     * @param {number} ztheta Amount in degrees to rotate the shape around the z-axis
     */
    rotate(xtheta, ytheta, ztheta) {
        this.rotateMatrix = new Matrix();
        this.rotateMatrix = this.rotateMatrix.rotate(xtheta, ytheta, ztheta);
    }

    /**
     * Sets the this.translateMatrix variable to a new translation matrix that uses the
     * parameters for the translation informaton.
     *
     * @param {number} tx Amount to translate the shape in the x direction.
     * @param {number} ty Amount to translate the shape in the y direction.
     * @param {number} tz Amount to translate the shape in the z direction.
     */
    translate(tx, ty, tz) {
        this.translateMatrix = new Matrix();
        this.translateMatrix = this.translateMatrix.translate(tx, ty, tz);
    }

    /**
     * Creates a model matrix by combining the other matrices. The matrices should be applied
     * in the order:
     *  view
     *  scaleMatrix
     *  rotateMatrix
     *  translateMatrix
     *
     * @return {Matrix} A matrix with all of the transformations applied to the shape.
     */
    getModel() {
        let model = this.translateMatrix.mult(this.rotateMatrix).mult(this.scaleMatrix).mult(this.world);
        return model;
    }

    /**
     * Sets the light colors.
     *
     * @param {Number[]} ambient Color of the ambient light
     * @param {Number[]} diffuse Color of the diffuse light
     * @param {Number[]} specular Color of the specular light
     */
    setColors(ambient, diffuse, specular) {
        this.ambientColor = new Float32Array(ambient);
        this.diffuseColor = new Float32Array(diffuse);
        this.specularColor = new Float32Array(specular);
        this.aRay.setColor(this.ambientColor);
        this.dRay.setColor(this.diffuseColor);
        this.sRay.setColor(this.specularColor);
    }

    /**
     * Setst the material properties.
     *
     * @param {*} ambient Color of the ambient material
     * @param {*} diffuse Color of the diffuse material
     * @param {*} specular Color of the specular material
     * @param {*} shiny Shininess coeffient for the specular light
     */
    setMaterials(ambient, diffuse, specular, shiny) {
        this.ambientMaterial = new Float32Array(ambient);
        this.diffuseMaterial = new Float32Array(diffuse);
        this.specularMaterial = new Float32Array(specular);

        this.shiny = shiny;
    }

    /**
     * Sets the position of the light.
     *
     * @param {*} radius Distance from the light source to the origin
     * @param {*} polarAngle Angle in degrees in the y direction
     * @param {*} azimuth Angle in degrees in the xz plane
     */
    setLightPosition(radius, polarAngle, azimuth) {
        this.lightPosition = new Float32Array([
            radius * Math.sin(polarAngle) * Math.cos(azimuth),
            radius * Math.cos(polarAngle),
            radius * Math.sin(polarAngle) * Math.sin(azimuth),
            0
        ]);

        this.aRay.rotate(new Vector(this.lightPosition));
        this.dRay.rotate(new Vector(this.lightPosition));
        this.sRay.rotate(new Vector(this.lightPosition));
    }

    /**
     * Sets the constants for the light attenuation (a + b * d + c * d^2).
     * @param {Number} a Constant value
     * @param {Number} b Linear value
     * @param {Number} c Quadratic value
     */
    setDistanceConstants(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    getNormal(face) {
        let p1 = this.getPoint(this.triangles[face * 5]);
        let p2 = this.getPoint(this.triangles[face * 5 + 1]);
        let p3 = this.getPoint(this.triangles[face * 5 + 2]);

        let n1 = this.subVec(p3, p1).crossProduct(this.subVec(p2, p1));
        // console.log(p1.getData(), p2.getData(), p3.getData())
        n1.normalize();

        return n1;
    }

    getPoint(index) {
        let x = this.vertices[index * 3];
        let y = this.vertices[index * 3 + 1];
        let z = this.vertices[index * 3 + 2];

        return new Vector([x, y, z]);
    }

    subVec(v1, v2) {
        return new Vector([v1.getX() - v2.getX(), v1.getY() - v2.getY(), v1.getZ() - v2.getZ()]);
    }

    addVec(v1, v2) {
        return new Vector([v1.getX() + v2.getX(), v1.getY() + v2.getY(), v1.getZ() + v2.getZ()]);
    }

}

/**
 * Creates a ray starting at the origin along the x-axis
 */
class Ray {
    /**
     * Creates a ray.
     *
     * @param {WebGLRenderingContext} gl WebGL Context
     */
    constructor(gl) {
        // shaders
        this.wire = false;
        this.program = createProgram(gl, edgeVertex, edgeFragment);
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

        this.world = new Matrix().scale(2, 0.01, 0.01);

        this.rotateMatrix = new Matrix(); // rotate matrix
        this.translateMatrix = new Matrix();

        this.colors = [0, 0, 0, 1];
        this.buffered = false;
    }

    /**
     * Creates the buffers for the program. Intended for internal use.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     */
    bufferData(gl) {
        this.verticesBuffer = gl.createBuffer();
        this.trianglesBuffer = gl.createBuffer();
        this.edgesBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.triangles, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.edges, gl.STATIC_DRAW);

        this.buffered = true;
    }

    // render
    /**
     * Draws a ray using the provided context and the projection
     * matrix.
     *
     * @param {WebGLRenderingContext} gl WebGL context
     * @param {Matrix} projection Projection matrix
     */
    render(gl, projection, view) {
        if (!this.buffered) {
            this.bufferData(gl);
        }

        let verLoc = gl.getAttribLocation(this.program, "location");
        let matProjection = gl.getUniformLocation(this.program, "projection");
        let matModel = gl.getUniformLocation(this.program, "model");
        let matView = gl.getUniformLocation(this.program, "view");
        let eColor = gl.getUniformLocation(this.program, "cColor");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.vertexAttribPointer(verLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(verLoc);

        gl.useProgram(this.program);

        gl.uniformMatrix4fv(matProjection, false, projection.getData());
        gl.uniformMatrix4fv(matModel, false, this.getModel().getData());
        gl.uniformMatrix4fv(matView, false, view.getData());

        gl.uniform4fv(eColor, this.colors);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesBuffer);
        gl.drawElements(gl.TRIANGLE_STRIP, this.triangles.length, gl.UNSIGNED_BYTE, 0);

        gl.uniform4fv(eColor, new Float32Array([0, 0, 0, 1]));

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgesBuffer);
        gl.drawElements(gl.LINES, this.edges.length, gl.UNSIGNED_BYTE, 0);
    }

    /**
     * Sets the this.translateMatrix variable to a new translation matrix that uses the
     * parameters for the translation informaton.
     *
     * @param {number} tx Amount to translate the ray in the x direction.
     * @param {number} ty Amount to translate the ray in the y direction.
     * @param {number} tz Amount to translate the ray in the z direction.
     */
    translate(tx, ty, tz) {
        this.translateMatrix = new Matrix();
        this.translateMatrix = this.translateMatrix.translate(tx, ty, tz);
    }

    /**
     * Sets the this.rotateMatrix variable to a new rotation matrix that uses the
     * parameters for the rotation informaton.
     *
     * @param {Vector} vector Vector to rotate this ray to
     */
    rotate(vector) {
        this.rotateMatrix = this.getRotateToVector(new Vector([1, 0, 0]), vector);
    }

    /**
     * Gets a rotation matrix that moves a start vector to the end vector.
     *
     * @param {Vector} start Original vector
     * @param {Vector} end  Destination vector
     *
     * @return {Matrix} A rotation matrix that moves start to end.
     */
    getRotateToVector (start, end) {
        let nStart = new Vector(start.getData());
        let nEnd = new Vector(end.getData());
        nStart.normalize();
        nEnd.normalize();
        let a = nStart.crossProduct(nEnd);
        a.normalize();

        let c = nStart.dotProduct(nEnd);
        let alpha = Math.acos(c);
        let s = Math.sin(alpha);

        let minC = 1 - c;

        return new Matrix([
            a.getX() * a.getX() * minC + c, a.getX() * a.getY() * minC - s * a.getZ(),
            a.getX() * a.getZ() * minC + s * a.getY(), 0,
            a.getX() * a.getY() * minC + s * a.getZ(), a.getY() * a.getY() * minC + c,
            a.getY() * a.getZ() * minC - s * a.getX(), 0,
            a.getX() * a.getZ() * minC - s * a.getY(), a.getY() * a.getZ() * minC + s * a.getX(),
            a.getZ() * a.getZ() * minC + c, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Changes the color of the ray.
     *
     * @param {Numeric[]} cols The color of the ray.
     */
    setColor(cols) {
        this.colors = cols;
    }

    /**
     * Creates a model matrix by combining the other matrices.
     *
     * @return {Matrix} A matrix with all of the transformations applied to the ray.
     */
    getModel() {
        return this.translateMatrix.mult(this.rotateMatrix.mult(this.world));
    }
}
