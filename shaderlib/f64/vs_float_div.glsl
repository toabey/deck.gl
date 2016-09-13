attribute vec3 positions;

uniform vec2 a;
uniform vec2 b;

uniform float EPSILON;
uniform vec2 ref;


varying vec4 vColor;

const vec4 CORRECT = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 WRONG = vec4(1.0, 0.0, 0.0, 1.0);

#pragma glslify: check_error = require(./utility)
#pragma glslify: div_f64 = require(./div-f64)


void main(void) {

  gl_Position = vec4(positions, 1.0);

  vec2 result = div_f64(a, b);

  float ret = check_error(result, ref, EPSILON);

  vColor = CORRECT * ret + WRONG * (1.0 - ret);
}
