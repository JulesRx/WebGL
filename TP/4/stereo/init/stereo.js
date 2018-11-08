
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
var program;
var texture, texture2;
var attribPos;
var attribTex;
var buffer;
var bufferTex;
var uSampler;
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

}

function initBuffers() {
    //TODO: remplir un buffer avec les coordonnees du rectangle (qui fait la taille du canvas)
    // et le buffer des coordonnees de texture a associer a
    // chaque sommet
}

//Fonction permettant de charger une texture
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

//Fonction chargeant l'image
function initTextures() {
    // TODO
    // Creer la texture
    // Creer l'image liee a la texture
    // Appeler render en callback au chargement de l'image
    // Specifier la source de l'image
}


function drawRight() {
    // TODO
    // Utiliser viewport pour dessiner sur la droite
    // Activer, lier (bind) la texture
    // Passer la texture au sampler
    // Dessiner
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function drawLeft() {

    gl.clearColor(0.2,0.2,0.2,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT
            );

    // TODO
    // Utiliser viewport pour dessiner sur la droite
    // Activer, lier (bind) la texture
    // Passer la texture au sampler
    // Utiliser les buffers
    // Dessiner

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

}

function main() {
    var canvas = document.getElementById('dawin-webgl');
    gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('ERREUR : Echec du chargement du contexte !');
        return;
    }
    initShaders();
    initBuffers();
    initTextures();

    // setTimeout pour s'assurer que les images soient bien chargees
    setTimeout(drawLeft, 1000);
    setTimeout(drawRight, 1000);
}
