attribute vec3 positions;

uniform vec2 a;

uniform vec2 ref;
uniform float EPSILON;

varying vec4 vColor;

const vec4 CORRECT = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 WRONG = vec4(1.0, 0.0, 0.0, 1.0);

#pragma glslify: check_error = require(./utility)
#pragma glslify: log_f64 = require(./log-f64)

void main(void) {

  gl_Position = vec4(positions, 1.0);

  vec2 result = log_f64(a);

  float ret = check_error(result, ref, EPSILON);

  vColor = CORRECT * ret + WRONG * (1.0 - ret);
}
