#pragma glslify: sum_f64 = require(./sum-f64)
#pragma glslify: mult_f64 = require(./mult-f64)

// TODO could be further simplified, will do after the UT
vec2 vec_mult_f64(vec4 a_hi, vec4 a_lo, vec4 b_hi, vec4 b_lo) {
  vec2 xx = mult_f64(vec2(a_hi.x, a_lo.x), vec2(b_hi.x, b_lo.x));
  vec2 yy = mult_f64(vec2(a_hi.y, a_lo.y), vec2(b_hi.y, b_lo.y));
  vec2 zz = mult_f64(vec2(a_hi.z, a_lo.z), vec2(b_hi.z, b_lo.z));
  vec2 ww = mult_f64(vec2(a_hi.w, a_lo.w), vec2(b_hi.w, b_lo.w));
  return sum_f64(sum_f64(xx, yy), sum_f64(zz, ww));
}

#pragma glslify: export(vec_mult_f64)
