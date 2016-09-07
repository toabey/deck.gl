#pragma glslify: sum_f64 = require(./sum-f64)
#pragma glslify: sub_f64 = require(./sub-f64)
#pragma glslify: mult_f64 = require(./mult-f64)

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

vec2 div_f64(vec2 a, vec2 b) {
  float xn = 1.0 / b.x;
  // there is an error in Thall's paper, check the original one by Karp
  vec2 yn = a * xn;
  float diff = (sub_f64(a, mult_f64(b, yn))).x;
  vec2 prod = twoProd(xn, diff);
  return sum_f64(yn, prod);
}

#pragma glslify: export(div_f64)
