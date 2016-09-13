const float TILE_SIZE = 512.0;
const float PI = 3.1415926536;
const float WORLD_SCALE = TILE_SIZE / (PI * 2.0);

uniform float disableMercatorProjector;
uniform vec2 mercatorScale;

#pragma glslify: mul_f64 = require(./f64/mul-f64)
// non-linear projection: lnglats => unit tile [0-1, 0-1]
vec2 mercatorProject(vec2 lnglat) {
  return vec2(
  	radians(lnglat.x) + PI,
  	PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5))
  );
}

// vec2 project(vec2 position) {
//   if (disableMercatorProjector == 1.0) {
//     return (position + vec2(TILE_SIZE / 2.0)) * mercatorScale;
//   } else {
//     return mercatorProject(position) * WORLD_SCALE * mercatorScale;

//   }
// }

vec4 project(vec2 position) {
    vec2 tmp = mercatorProject(position) * WORLD_SCALE;
    vec2 x_hi_prec = mul_f64(vec2(tmp.x, 0.0), mercatorScale);
    vec2 y_hi_prec = mul_f64(vec2(tmp.y, 0.0), mercatorScale);

    return vec4(x_hi_prec, y_hi_prec);
}

#pragma glslify: export(project)
