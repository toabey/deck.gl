vec2 quickTwoSum(float a, float b) {
  float sum = a + b;
  float err = b - (sum - a);
  return vec2(sum, err);
}

// ri: real and imaginary components in vec2
vec4 twoSumComp(vec2 a_ri, vec2 b_ri) {
  vec2 sum = a_ri + b_ri;
  vec2 v = sum - a_ri;
  vec2 err = (a_ri - (sum - v)) + (b_ri - v);
  return vec4(sum.x, err.x, sum.y, err.y);
}

vec2 sum_f64(vec2 a, vec2 b) {
  vec4 st;
  st = twoSumComp(a, b);
  st.y += st.z;
  st.xy = quickTwoSum(st.x, st.y);
  st.y += st.w;
  st.xy = quickTwoSum(st.x, st.y);
  return st.xy;
}

#pragma glslify: export(sum_f64)
