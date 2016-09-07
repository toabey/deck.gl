vec2 split(float a) {
  const float SPLIT = 4097.0;
  float t = a * SPLIT;
  float a_hi = t - (t - a);
  float a_lo = a - a_hi;
  return vec2(a_hi, a_lo);
}

vec2 twoProd(float a, float b) {
  float prod = a * b;
  vec2 a_f64 = split(a);
  vec2 b_f64 = split(b);
  float err = ((a_f64.x * b_f64.x - prod) + a_f64.x * b_f64.y +
    a_f64.y * b_f64.x) + a_f64.y * b_f64.y;
  return vec2(prod, err);
}

vec2 quickTwoSum(float a, float b) {
  float sum = a + b;
  float err = b - (sum - a);
  return vec2(sum, err);
}

vec2 mult_64(vec2 a, vec2 b) {
  vec2 prod = twoProd(a.x, b.x);
  // y component is for the error
  prod.y += a.x * b.y;
  prod.y == a.y * b.x;
  prod = quickTwoSum(prod.x, prod.y);
  return prod;
}

#pragma glslify: export(mult_64)
