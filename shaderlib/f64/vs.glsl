attribute vec3 positions;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform vec2 a;
uniform vec2 b;
uniform vec4 c_hi;
uniform vec4 c_lo;
uniform vec4 d_hi;
uniform vec4 d_lo;
uniform vec4 e_hi;
uniform vec4 e_lo;
uniform mat4 m_hi;
uniform mat4 m_lo;
uniform vec2 sum_ab;
uniform vec2 sub_ab;
uniform vec2 mul_ab;
uniform vec2 div_ab;
uniform vec2 rad_a;
uniform vec2 vec_mult_cd;
uniform mat4 mat_mult_vec_mc_f64;

uniform vec2 res0;
uniform vec2 res1;
uniform vec2 res2;
uniform vec2 res3;

varying vec4 vColor;

const float EPSILON = 1e-4;

#pragma glslify: sum_f64 = require(./sum-f64)
#pragma glslify: sub_f64 = require(./sub-f64)
#pragma glslify: mult_f64 = require(./mult-f64)
#pragma glslify: div_f64 = require(./div-f64)
#pragma glslify: radians_f64 = require(./radians-f64)
#pragma glslify: vec_mult_f64 = require(./vec-mult-f64)

mat4 mat_mult_vec_f64(mat4 mat_hi, mat4 mat_lo, vec4 vec_hi, vec4 vec_lo) {
  // vec4 row1_hi = vec4(mat_hi[0][0], mat_hi[1][0], mat_hi[2][0], mat_hi[3][0]);
  // vec4 row1_lo = vec4(mat_lo[0][0], mat_lo[1][0], mat_lo[2][0], mat_lo[3][0]);
  // vec4 row2_hi = vec4(mat_hi[0][1], mat_hi[1][1], mat_hi[2][1], mat_hi[3][1]);
  // vec4 row2_lo = vec4(mat_lo[0][1], mat_lo[1][1], mat_lo[2][1], mat_lo[3][1]);
  // vec4 row3_hi = vec4(mat_hi[0][2], mat_hi[1][2], mat_hi[2][2], mat_hi[3][2]);
  // vec4 row3_lo = vec4(mat_lo[0][2], mat_lo[1][2], mat_lo[2][2], mat_lo[3][2]);
  // vec4 row4_hi = vec4(mat_hi[0][3], mat_hi[1][3], mat_hi[2][3], mat_hi[3][3]);
  // vec4 row4_lo = vec4(mat_lo[0][3], mat_lo[1][3], mat_lo[2][3], mat_lo[3][3]);
  vec2 x_hi_lo = vec_mult_f64(mat_hi[0], mat_lo[0], vec_hi, vec_lo);
  vec2 y_hi_lo = vec_mult_f64(mat_hi[1], mat_lo[1], vec_hi, vec_lo);
  vec2 z_hi_lo = vec_mult_f64(mat_hi[2], mat_lo[2], vec_hi, vec_lo);
  vec2 w_hi_lo = vec_mult_f64(mat_hi[3], mat_lo[3], vec_hi, vec_lo);
  return mat4(
    vec4(x_hi_lo, 0.0, 0.0),
    vec4(y_hi_lo, 0.0, 0.0),
    vec4(z_hi_lo, 0.0, 0.0),
    vec4(w_hi_lo, 0.0, 0.0)
  );
}

void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(positions, 1.0);

  // bool pass = distance(sum_ab, sum_f64(a, b)) < EPSILON;
  // bool pass = distance(sub_ab, sub_f64(a, b)) < EPSILON;
  // bool pass = distance(mul_ab, mult_f64(a, b)) < EPSILON;
  // bool pass = distance(div_ab, div_f64(a, b)) < EPSILON;
  // bool pass = distance(rad_a, radians_f64(a)) < EPSILON;
  bool pass = distance(vec_mult_cd, vec_mult_f64(c_hi, c_lo, d_hi, d_lo)) < EPSILON;

  vec2 x_hi_lo = vec_mult_f64(m_hi[0], m_lo[0], e_hi, e_lo);
  vec2 y_hi_lo = vec_mult_f64(m_hi[1], m_lo[1], e_hi, e_lo);
  vec2 z_hi_lo = vec_mult_f64(m_hi[2], m_lo[2], e_hi, e_lo);
  vec2 w_hi_lo = vec_mult_f64(m_hi[3], m_lo[3], e_hi, e_lo);

  // vec4 xx_hi = vec4(m_hi[0]);
  // vec4 xx = vec4(1.0, 2.0, 3.0, 4.0);

  // mat4 mc = mat_mult_vec_f64(m_hi, m_lo, c_hi, c_lo);
  // bool pass = distance(x_hi_lo, res0) < EPSILON;
    // mat_mult_vec_f64(m_hi, m_lo, c_hi, c_lo)) < EPSILON;

  // vec4 temp = vec4(0.11764705882352941, 0.27450980392156865, 0.43137254901960786, 1.0);
  // vec4 temp = vec4(0.5882352941176471, 0.27450980392156865, 0.43137254901960786, 1.0);
  // vColor = vec4(x_hi_lo.x / 255.0, y_hi_lo.x / 255.0, z_hi_lo.x / 255.0, 1.0);
  vColor = pass ? vec4(0.0, 0.5, 1.0, 1.0) : vec4(1.0, 0.0, 0.5, 1.0);
}
