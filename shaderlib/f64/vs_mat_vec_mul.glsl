attribute vec3 positions;

uniform mat4 mat_hi;
uniform mat4 mat_lo;
uniform vec4 vec_hi;
uniform vec4 vec_lo;

uniform float EPSILON;
uniform vec4 ref_hi;
uniform vec4 ref_lo;

varying vec4 vColor;


const vec4 CORRECT = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 WRONG = vec4(1.0, 0.0, 0.0, 1.0);

#pragma glslify: check_error = require(./utility)
#pragma glslify: vec_dot_f64 = require(./vec-dot-f64)

void main(void) {

  gl_Position = vec4(positions, 1.0);

  vec2 row0_hi_lo = vec_dot_f64(mat_hi[0], mat_lo[0], vec_hi, vec_lo);
  vec2 row1_hi_lo = vec_dot_f64(mat_hi[1], mat_lo[1], vec_hi, vec_lo);
  vec2 row2_hi_lo = vec_dot_f64(mat_hi[2], mat_lo[2], vec_hi, vec_lo);
  vec2 row3_hi_lo = vec_dot_f64(mat_hi[3], mat_lo[3], vec_hi, vec_lo);

  float ret = (check_error(row0_hi_lo, vec2(ref_hi.x, ref_lo.x), EPSILON)
            + check_error(row1_hi_lo, vec2(ref_hi.y, ref_lo.y), EPSILON)
            + check_error(row2_hi_lo, vec2(ref_hi.z, ref_lo.z), EPSILON)
            + check_error(row3_hi_lo, vec2(ref_hi.w, ref_lo.w), EPSILON)) / 4.0;

  vColor = CORRECT * ret + WRONG * (1.0 - ret);
}
