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

// variables globales du programme;
var canvas;
var gl; //contexte
var program; //shader program
var attribPos; //attribute position
var attribSize; //attribute size
var pointSize = 10.;

function initContext() {
    canvas = document.getElementById('dawin-webgl');
    gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('ERREUR : echec chargement du contexte');
        return;
    }
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
}

//Initialisation des shaders et du program
function initShaders() {

}

//Fonction initialisant les attributs pour l'affichage (position et taille)
function initAttributes() {

}

//Fonction permettant le dessin dans le canvas
function draw() {

}


function main() {
    initContext();
    //initShaders();
    gl.clear(gl.COLOR_BUFFER_BIT);
    //draw();
}
