precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uSampler2;
void main() {
   vec4 color0 = texture2D(uSampler, vTextureCoord);
   vec4 color1 = texture2D(uSampler2, vTextureCoord);
   gl_FragColor = vec4(vec3(color0), 1);
//gl_FragColor = texture2D(uSampler, vTextureCoord);
}