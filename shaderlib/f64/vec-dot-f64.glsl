#pragma glslify: sum_f64 = require(./sum-f64)
#pragma glslify: mul_f64 = require(./mul-f64)

// TODO could be further simplified, will do after the UT
vec2 vec_dot_f64(vec4 a_hi, vec4 a_lo, vec4 b_hi, vec4 b_lo) {
  vec2 v0 = mul_f64(vec2(a_hi.x, a_lo.x), vec2(b_hi.x, b_lo.x));
  vec2 v1 = mul_f64(vec2(a_hi.y, a_lo.y), vec2(b_hi.y, b_lo.y));
  vec2 v2 = mul_f64(vec2(a_hi.z, a_lo.z), vec2(b_hi.z, b_lo.z));
  vec2 v3 = mul_f64(vec2(a_hi.w, a_lo.w), vec2(b_hi.w, b_lo.w));


  vec2 tmp = sum_f64(sum_f64(v0, v1), sum_f64(v2, v3));

  return tmp;
}

#pragma glslify: export(vec_dot_f64)
