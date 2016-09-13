#pragma glslify: sum_f64 = require(./sum-f64)
#pragma glslify: mul_f64 = require(./mul-f64)
#pragma glslify: exp_f64 = require(./exp-f64)

bool eq_f64(vec2 a, vec2 b)
{
  return all(equal(a, b));
}

vec2 log_f64(vec2 a)
{
  vec2 xi = vec2(0.0, 0.0);
  if (!eq_f64(a, vec2(1.0, 0.0))) {
    if (a.x <= 0.0) {
      xi = vec2(log(a.x));
    } else {
      xi.x = log(a.x);
      xi = sum_f64(sum_f64(xi, mul_f64(exp_f64(-xi), a)), vec2(-1.0, 0.0));
    }
  }

  return xi;
}


#pragma glslify: export(log_f64)
