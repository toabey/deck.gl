attribute vec3 positions;

uniform vec4 a_hi;
uniform vec4 a_lo;
uniform vec4 b_hi;
uniform vec4 b_lo;

uniform float EPSILON;
uniform vec2 ref;

varying vec4 vColor;


const vec4 CORRECT = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 WRONG = vec4(1.0, 0.0, 0.0, 1.0);

#pragma glslify: check_error = require(./utility)
#pragma glslify: vec_dot_f64 = require(./vec-dot-f64)


void main(void) {

  gl_Position = vec4(positions, 1.0);

  vec2 result = vec_dot_f64(a_hi, a_lo, b_hi, b_lo);

  float ret = check_error(result, ref, EPSILON);

  vColor = CORRECT * ret + WRONG * (1.0 - ret);
}
