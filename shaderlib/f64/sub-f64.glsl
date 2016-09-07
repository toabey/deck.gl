#pragma glslify: sum_f64 = require(./sum-f64)

vec2 sub_f64(vec2 a, vec2 b) {
  return sum_f64(a, -b);
}

#pragma glslify: export(sub_f64)
