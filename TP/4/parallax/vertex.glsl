attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 MVMatrix;
uniform mat4 PMatrix;

varying vec2 vTextureCoord;


void main(void) {
gl_Position =  PMatrix * MVMatrix * vec4(aVertexPosition, 1.0, 1.0);
vTextureCoord = aTextureCoord;
}