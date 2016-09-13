#pragma glslify: sum_f64 = require(./sum-f64)
#pragma glslify: mul_f64 = require(./mul-f64)
#pragma glslify: div_f64 = require(./div-f64)

vec2 exp_f64(vec2 a) {

//   //float threshold = 1e-20 * exp(a.x);

  vec2 t;
  vec2 p;
  vec2 f;
  vec2 s;
  vec2 x;
  vec2 m;


  s = sum_f64(vec2(1.0, 0.0), a);
  p = mul_f64(a, a);
  m = vec2(2.0, 0.0);
  f = vec2(2.0, 0.0);
  t = p / 2.0;

// The correct way is to loop until t is smaller than a certain
// threshold but since WebGL currently don't support while loop
// we simply loop for a certain amount of time here

//  while (abs(t.x) > threshold) {
  for (int i = 0; i < 20; i++)
  {
    s = sum_f64(s, t);
    p = mul_f64(p, a);
    m = sum_f64(m, vec2(1.0, 0.0));
    f = mul_f64(f, m);
    t = div_f64(p, f);
  }

  return sum_f64(s, t);

  // vec2 tmp_result = vec2(1.0, 0.0);

  // for (int i = 20; i > 0; --i)
  // {
  //   tmp_result = sum_f64(vec2(1.0, 0.0), div_f64(mul_f64(a, tmp_result), vec2(i, 0.0)));
  // }

  // return tmp_result;

}
#pragma glslify: export(exp_f64)
