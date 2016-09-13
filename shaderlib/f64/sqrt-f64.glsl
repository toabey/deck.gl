#pragma glslify: sum_f64 = require(./sum-f64)
#pragma glslify: sub_f64 = require(./sub-f64)
#pragma glslify: mul_f64 = require(./mul-f64)

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

vec2 twoSqr(float a) {
  float prod = a * a;
  vec2 a_f64 = split(a);

  float err = ((a_f64.x * a_f64.x - prod) + a_f64.x * a_f64.y + a_f64.x * a_f64.y) + a_f64.y * a_f64.y;
  return vec2(prod, err);
}

vec2 sqrt_f64(vec2 a) {

  float xn = inversesqrt(a.x);
  vec2 yn = a * xn;
  vec2 yn_sqr = twoSqr(yn.x);

  float diff = sub_f64(a, yn_sqr).x;
  vec2 prod = twoProd(xn, diff) / 2.0;
  return sum_f64(yn, prod);

}


#pragma glslify: export(sqrt_f64)
