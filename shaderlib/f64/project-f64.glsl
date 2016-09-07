const float TILE_SIZE = 512.0;
const float PI = 3.1415926536;
const float WORLD_SCALE = TILE_SIZE / (PI * 2.0);

const vec2 PI_f64 = vec2(3.1415927410125732, -8.742278012618954e-8);
const vec2 WORLD_SCALE_F64 = vec2(81.4873275756836, 0.0000032873668232014097);

#pragma glslify: sum_f64 = require(./sum-f64)
#pragma glslify: mult_f64 = require(./mult-f64)
#pragma glslify: radians_f64 = require(./radians-f64)

uniform bool disableMercatorProjector;
uniform float mercatorScale;
uniform vec2 mercatorScaleF64;

// non-linear projection: lnglats => unit tile [0-1, 0-1]
vec4 mercatorProject_f64(vec4 lnglat_f64) {
  return vec4(
  	sum_f64(radians_f64(lnglat_f64.xy), PI_f64),
  	PI - log(tan(PI * 0.25 + radians(lnglat_f64.z) * 0.5)), 0.0
  );
}

vec2 project_f64(vec4 position_f64) {
  if (disableMercatorProjector) {
    // return (position + vec2(TILE_SIZE / 2.0)) * mercatorScale;
  } else {
    vec4 pos_f64 = mercatorProject_f64(position_f64);
    return vec2(
      mult_f64(mult_f64(pos_f64.xy, WORLD_SCALE_F64), mercatorScaleF64).x,
      mult_f64(mult_f64(pos_f64.zw, WORLD_SCALE_F64), mercatorScaleF64).x
    );

    // return mult_f64(position, WORLD_SCALE_F64) * mercatorScale;
    // return position * WORLD_SCALE_F64.x * mercatorScale;
  }
}

#pragma glslify: export(project_f64)
