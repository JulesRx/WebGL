function loadText(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.overrideMimeType('text/plain');
  xhr.send(null);
  if (xhr.status === 200)
    return xhr.responseText;
  else {
    return null;
  }
}

var canvas, gl, program;

var attribPos,
  attribColor,
  uniformPerspectiveMat,
  uniformTranslationMat,
  uniformRotationMat,
  uniformScaleMat;

var buffers = [],
  vertexPositions = [],
  vertexColors = [];

var translationValues = { x: 0, y: 0, z: 0 };
var rotationValues = { x: 0, y: 0, z: 0 };
var zoomFactor = 1.0;
var yFov = 80;
var cubeColor, altCubeColor;

var xTranslationInput, yTranslationInput, zTranslationInput,
  xRotationInput, yRotationInput, zRotationInput,
  zoomFactorInput,
  yFovInput,
  mousePressed = false,
  ctrlPressed = false;

function initContext() {
  canvas = document.getElementById('canvas');
  gl = canvas.getContext('webgl');
  if (!gl) {
    console.error('ERREUR : Échec du chargement du contexte');
    return;
  }
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
}

function setCanvasResolution() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function initShaders() {
  var vertexShaderSource = loadText('assets/glsl/vertex.glsl');
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);

  var fragmentShaderSource = loadText('assets/glsl/fragment.glsl');
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
  }

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragmentShader));
  }

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getProgramInfoLog(program));
  }

  gl.useProgram(program);
}

function initAttributes() {
  attribPos = gl.getAttribLocation(program, 'position');
  attribColor = gl.getAttribLocation(program, 'vertexColor');

  uniformPerspectiveMat = gl.getUniformLocation(program, 'perspective');
  uniformTranslationMat = gl.getUniformLocation(program, 'translation');
  uniformRotationMat = gl.getUniformLocation(program, 'rotation');
  uniformScaleMat = gl.getUniformLocation(program, 'scale');
}

function initPerspective() {
  setCanvasResolution();

  var perspectiveMat = mat4.create();

  var fieldOfView = yFov * Math.PI / 180;
  var aspect = canvas.clientWidth / canvas.clientHeight;
  mat4.perspective(perspectiveMat, fieldOfView, aspect, 0.1, 100.0);

  gl.uniformMatrix4fv(uniformPerspectiveMat, false, perspectiveMat);
}

function setCube() {
  vertexPositions = [
    // F
    -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    // B
    -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0,
    -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
    // U
    -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
    // D
    -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
    // R
    1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
    1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
    // L
    -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
  ];

  // Rubik's Faces
  vertexColors = [
    Array(6).fill([0.0, 1.0, 0.0]).flat(),      // F: Green
    Array(6).fill([0.0, 0.0, 1.0]).flat(),      // B: Blue
    Array(6).fill([0.95, 0.95, 0.95]).flat(),   // U: White
    Array(6).fill([1.0, 1.0, 0.0]).flat(),      // D: Yellow
    Array(6).fill([1.0, 0.0, 0.0]).flat(),      // R: Red
    Array(6).fill([1.0, 0.65, 0.0]).flat(),     // L: Orange
  ].flat();
}

function initBuffers() {
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(attribColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribColor);
  buffers['color'] = colorBuffer;

  var posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(attribPos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribPos);
  buffers['pos'] = posBuffer;
}

function initInputs() {
  xTranslationInput = document.getElementById('xTranslationInput');
  xTranslationInput.addEventListener('input', function () {
    translationValues.x = this.value;
  });

  yTranslationInput = document.getElementById('yTranslationInput');
  yTranslationInput.addEventListener('input', function () {
    translationValues.y = this.value;
  });

  zTranslationInput = document.getElementById('zTranslationInput');
  zTranslationInput.addEventListener('input', function () {
    translationValues.z = this.value;
  });

  xRotationInput = document.getElementById('xRotationInput');
  xRotationInput.addEventListener('input', function () {
    rotationValues.x = this.value;
  });

  yRotationInput = document.getElementById('yRotationInput');
  yRotationInput.addEventListener('input', function () {
    rotationValues.y = this.value;
  });

  zRotationInput = document.getElementById('zRotationInput');
  zRotationInput.addEventListener('input', function () {
    rotationValues.z = this.value;
  });

  zoomFactorInput = document.getElementById('zoomFactorInput');
  zoomFactorInput.addEventListener('input', function () {
    zoomFactor = this.value;
  });

  yFovInput = document.getElementById('yFovInput');
  yFovInput.addEventListener('input', function () {
    yFov = this.value;
    initPerspective();
  });
}

function initMouseEvents() {
  canvas.addEventListener('mousedown', function () {
    mousePressed = true;
  });

  canvas.addEventListener('mouseup', function () {
    mousePressed = false;
  });

  canvas.addEventListener('mouseleave', function () {
    mousePressed = false;
  });

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey)
      ctrlPressed = true;
  });

  document.addEventListener('keyup', function (e) {
    ctrlPressed = false;
  });

  canvas.addEventListener('mousemove', function (e) {
    if (!mousePressed) {
      return;
    }

    if (ctrlPressed) {
      translationValues.x += (event.movementX / 100);
      translationValues.x = translationValues.x - 2 * Math.PI * Math.floor((translationValues.x + Math.PI) / (2 * Math.PI))
      xTranslationInput.value = translationValues.x;

      translationValues.y -= (event.movementY / 100);
      translationValues.y = translationValues.y - 2 * Math.PI * Math.floor((translationValues.y + Math.PI) / (2 * Math.PI))
      yTranslationInput.value = translationValues.y;
    } else {
      rotationValues.x -= (event.movementY / 100);
      rotationValues.x = rotationValues.x - 2 * Math.PI * Math.floor((rotationValues.x + Math.PI) / (2 * Math.PI))
      xRotationInput.value = rotationValues.x;

      rotationValues.y -= (event.movementX / 100);
      rotationValues.y = rotationValues.y - 2 * Math.PI * Math.floor((rotationValues.y + Math.PI) / (2 * Math.PI))
      yRotationInput.value = rotationValues.y;
    }
  });

  canvas.addEventListener('wheel', function (e) {
    e.preventDefault();

    if (ctrlPressed) {
      translationValues.z = (e.deltaY > 0) ? Math.min(translationValues.z + 0.2, 10) : Math.max(translationValues.z - 0.2, -10);

      zTranslationInput.value = translationValues.z;
    } else {
      zoomFactor = (e.deltaY > 0) ? Math.min(zoomFactor + 0.02, 5)
        : Math.max(zoomFactor - 0.02, 0.1);

      zoomFactorInput.value = zoomFactor;
    }
  });
}

function refreshTransformations() {
  var rotationMat = mat4.create();
  mat4.rotateX(rotationMat, rotationMat, -rotationValues.x);
  mat4.rotateY(rotationMat, rotationMat, -rotationValues.y);
  mat4.rotateZ(rotationMat, rotationMat, -rotationValues.z);
  gl.uniformMatrix4fv(uniformRotationMat, false, rotationMat);

  var translationMat = mat4.create();
  var translationVec = vec3.fromValues(translationValues.x, translationValues.y, translationValues.z - 5);
  mat4.fromTranslation(translationMat, translationVec);
  gl.uniformMatrix4fv(uniformTranslationMat, false, translationMat);

  var scaleMat = mat4.create();
  var scaleVec = vec3.fromValues(zoomFactor, zoomFactor, zoomFactor, 1);
  mat4.fromScaling(scaleMat, scaleVec);
  gl.uniformMatrix4fv(uniformScaleMat, false, scaleMat);
}

function draw() {
  refreshTransformations();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositions.length / 3);

  requestAnimationFrame(draw);
}

function resetCube() {
  translationValues = { x: 0, y: 0, z: 0 };
  rotationValues = { x: 0, y: 0, z: 0 };
  zoomFactor = 1.0;
  yFov = 80;
  initPerspective();

  xTranslationInput.value = translationValues.x;
  yTranslationInput.value = translationValues.y;
  zTranslationInput.value = translationValues.z;

  xRotationInput.value = rotationValues.x;
  yRotationInput.value = rotationValues.y;
  zRotationInput.value = rotationValues.y;

  zoomFactorInput.value = zoomFactor;

  yFovInput.value = yFov;
}

function main() {
  initContext();
  initShaders();
  initAttributes();
  initPerspective();

  setCube();
  initBuffers();
  initInputs();
  initMouseEvents();

  draw();

  window.addEventListener('resize', function () {
    initPerspective();
  });
}
