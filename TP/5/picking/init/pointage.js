var renderer;
var scene;
var camera;

var controls;

//Permet de stocker les spheres
var spheres = [];

var mouse = new THREE.Vector2();

function main() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10000);

    //Permet de zoomer, tourner la camera avec la souris
    controls = new THREE.OrbitControls( camera );

    // TODO
    // Creer la scene avec 100 spheres avec rayon aleatoire compris entre 1 et 5
    // Donner une couleur aleatoire a chacune de ces spheres
    // Definir une couleur unique (=pas de doublon de couleur) sur un autre MeshBasicMaterial
    // Puis stocker les spheres sous forme d'OBJETS avec 3 attributs (un pour la Mesh, un autre pour le material concernant les couleurs aleatoires, et un autre pour le material avec les couleurs uniques)

    camera.position.z = 200;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 800);
    renderer.setClearColor(new THREE.Color(0.2,0.2, 0.2),1.0);
    renderer.clear();
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    document.body.appendChild( renderer.domElement );

    render();
}

//Permet de recuperer la position de la souris
function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function pointage() {
    var gl = renderer.getContext();

    // TODO
    // Faire le rendu avec les couleurs UNIQUES
    renderer.render(scene, camera);

    // Recupere la couleur pointe sous le curseur de la souris
    var couleur = new Uint8Array(4);
    gl.readPixels(mouse.x, renderer.domElement.height - mouse.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, couleur);

    // On retrouve l'index correspondant dans le tableau a partir de la couleur
    var id = (couleur[0] << 16) | (couleur[1] << 8) | (couleur[2]);
    // On recupere l'objet pointe par la souris
    var data = spheres[id];

    // TODO
    // Faire le rendu avec les couleurs ALEATOIRES (= les couleurs propres des spheres)

    if(data){
        // TODO
        // Afficher la sphere pointee en jaune
    }
    renderer.render(scene, camera);
}

function render() {
    requestAnimationFrame( render );
    pointage();
    renderer.render( scene, camera );
}
