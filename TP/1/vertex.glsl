// attribute vec2 position;

// void main() {
//     gl_Position = vec4(position[0], position[1], 0, 1);

//     gl_PointSize = (position[0] + 1.0) * 30.0;
// }


attribute vec4 position;
attribute float size;

void main () {
  gl_Position = position;
  gl_PointSize = size;
}
