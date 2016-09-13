#pragma glslify: sum_f64 = require(./sum-f64)

// TODO could be further simplified, will do after the UT
mat4 vec_sum_f64(vec4 a_hi, vec4 a_lo, vec4 b_hi, vec4 b_lo) {
  mat4 result;
  result[0].xy = sum_f64(vec2(a_hi.x, a_lo.x), vec2(b_hi.x, b_lo.x));
  result[1].xy = sum_f64(vec2(a_hi.y, a_lo.y), vec2(b_hi.y, b_lo.y));
  result[2].xy = sum_f64(vec2(a_hi.z, a_lo.z), vec2(b_hi.z, b_lo.z));
  result[3].xy = sum_f64(vec2(a_hi.w, a_lo.w), vec2(b_hi.w, b_lo.w));

  return result;
}

#pragma glslify: export(vec_sum_f64)
