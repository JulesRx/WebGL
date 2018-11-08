
function loadText(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.overrideMimeType("text/plain");
    xhr.send(null);
    if(xhr.status === 200)
        return xhr.responseText;
    else {
        return null;
    }
}

var gl;
var viewportWidth, viewportHeight;
var program;
var texture;
var attribPos;
var attribTex;
var buffer, bufferCopy;
var bufferTex, bufferTexCopy;
var tx=0, ty=0;
var uPMatrix, uMVMatrix;
var uSampler, uSampler2;
var uTex;
var time =0;
var projMatrix = mat4.create();

function initShaders() {
    var vertSource = loadText('vertex.glsl');
    var fragSource = loadText('fragment.glsl');

    var vertex = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex, vertSource);
    gl.compileShader(vertex);

    if(!gl.getShaderParameter(vertex, gl.COMPILE_STATUS))
        console.log("Erreur lors de la compilation du vertex shader:\n"+gl.getShaderInfoLog(vertex));

    var fragment = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment, fragSource);
    gl.compileShader(fragment);

    if(!gl.getShaderParameter(fragment, gl.COMPILE_STATUS))
        console.log("Erreur lors de la compilation du fragment shader:\n"+gl.getShaderInfoLog(fragment));

    program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS))
        console.log("Erreur lors du linkage du program:\n"+gl.getProgramInfoLog(program));

    gl.useProgram(program);

    attribPos = gl.getAttribLocation(program, "aVertexPosition");
    attribTex = gl.getAttribLocation(program, "aTextureCoord");
    uPMatrix = gl.getUniformLocation(program, "PMatrix");
    uMVMatrix = gl.getUniformLocation(program, "MVMatrix");
    uSampler = gl.getUniformLocation(program, "uSampler");
    uSampler2 = gl.getUniformLocation(program, "uSampler2");
}

function initBuffers() {
    var texcoords = [ 0.0, 0.0,
                      0.0, 1.0,
                      1.0, 1.0,

                      1.0, 1.0,
                      1.0, 0.0,
                      0.0, 0.0];

    var square = [-1.0, -1.0,
                  -1.0,  1.0,
                  1.0,  1.0,

                  1.0, 1.0,
                  1.0, -1.0,
                 -1.0, -1.0];

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(square), gl.STATIC_DRAW);

    buffer.vertexSize = 2;
    buffer.numVertices = 6;

    bufferCopy = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCopy);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(square), gl.STATIC_DRAW);

    bufferTex= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTex);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    bufferTexCopy = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTexCopy);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    bufferTex.vertexSize = 2;
    bufferTex.numVertices = 6;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function render(image, text) {
    gl.bindTexture(gl.TEXTURE_2D, text);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTextures() {
    texture = gl.createTexture();
    texture2 = gl.createTexture();
    var image = new Image();
    var image2 = new Image();
    image.onload = function() { render(image, texture);}
    image2.onload = function() { render(image2, texture2);}

    image.src='paysage_droite2.png';
    image2.src='paysage_droite.png';

}


function drawRight() {

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.uniform1i(uSampler, 1);

    var view = mat4.create();
    mat4.identity(view, view);
    //mat4.lookAt([-1,0], [0,0], [0,1]);
    //mat4.translate(view,view,[-2,0.0,-5.0]);
    mat4.lookAt(view, [0,0,3], [-0.25,0,0], [0,1,0]);
    gl.uniformMatrix4fv(uMVMatrix, false, view);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribPos, buffer.vertexSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribPos);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTex);
    gl.vertexAttribPointer(attribTex, bufferTex.vertexSize, gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(attribTex);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffer.numVertices);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

var time = 0;

function draw() {
    requestAnimationFrame(draw);
    gl.clearColor(0.0,0.0,1.0,0.5);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT
            );
    mat4.perspective(projMatrix, Math.PI/4, 1, 0.1, 100);
    var view = mat4.create();
    mat4.identity(view, view);
    mat4.lookAt(view, [0,0,5], [0, 0,0], [0,1,0]);
    var angle = time % (Math.PI/8) ;
    mat4.rotate(view, view, angle, [0, 1, 0]);
    gl.uniformMatrix4fv(uPMatrix, false, projMatrix);
    gl.uniformMatrix4fv(uMVMatrix, false, view);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uSampler, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.uniform1i(uSampler, 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribPos, buffer.vertexSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribPos);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTex);
    gl.vertexAttribPointer(attribTex, bufferTex.vertexSize, gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(attribTex);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffer.numVertices);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    time += 0.001;

}

function main() {
    var canvas = document.getElementById('dawin-webgl');
    viewportWidth= canvas.width;
    viewportHeight = canvas.height;
    gl = canvas.getContext('webgl', {'premultipliedAlpha': false});
    if (!gl) {
        console.log('ERREUR : Echec du chargement du contexte !');
        return;
    }
    gl.enable(gl.SCISSOR_TEST);
    gl.enable(gl.DEPTH_TEST);
    gl.scissor(0,0,viewportWidth, viewportHeight);
    initShaders();
    initBuffers();
    initTextures();

    setTimeout(draw, 1000);
    //setTimeout(drawRight, 1000);
}
