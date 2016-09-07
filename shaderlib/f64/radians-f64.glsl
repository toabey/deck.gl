#pragma glslify: mult_f64 = require(./mult-f64)
const vec2 PI_f64 = vec2(3.1415927410125732, -8.742278012618954e-8);

vec2 radians_f64(vec2 degree) {
  return mult_f64(degree, PI_f64) / 180.0;
}

#pragma glslify: export(radians_f64)
