// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

#define SHADER_NAME scatterplot-layer-vertex-shader

#pragma glslify: project = require(../../../shaderlib/project)
#pragma glslify: check_error = require(../../../shaderlib/f64/utility)
#pragma glslify: vec_dot_f64 = require(../../../shaderlib/f64/vec-dot-f64)
#pragma glslify: sum_f64 = require(../../../shaderlib/f64/sum-f64)
#pragma glslify: mul_f64 = require(../../../shaderlib/f64/mul-f64)

attribute vec3 positions;
attribute vec4 instancePositions;
attribute vec3 instanceColors;
attribute vec3 instancePickingColors;

uniform mat4 worldMatrix;
uniform mat4 projectionMatrix;
uniform mat4 highPrecProjectionMatrix_hi;
uniform mat4 highPrecProjectionMatrix_lo;
uniform float opacity;
uniform vec2 radius;
uniform float renderPickingBuffer;

varying vec4 vColor;

void main(void) {
  // For some reason, need to add one to elevation to show up in untilted mode


  // vec3 center = vec3(project(instancePositions.xy), instancePositions.z + 1.0);
  // vec3 vertex = positions * radius.x * instancePositions.w;
  // vec4 glPosition_low_prec = projectionMatrix * (vec4(vertex, 0.0) + vec4(center, 1.0)); //

  vec4 projected_coord_high_prec = project(instancePositions.xy);


  // mat4 tmp_sum = vec_sum_f64(vec4(center, 1.0), vec4(0.0), vec4(vertex, 0.0), vec4(0.0));
  // vec4 vec_hi = vec4(tmp_sum[0].x + tmp_sum[1].x + tmp_sum[2].x + tmp_sum[3].x);
  // vec4 vec_lo = vec4(tmp_sum[0].y + tmp_sum[1].y + tmp_sum[2].y + tmp_sum[3].y);

  vec3 tmp_pos = positions * instancePositions.w;
  vec2 tmp_vertex0 = mul_f64(vec2(tmp_pos.x, 0.0), radius);
  vec2 tmp_vertex1 = mul_f64(vec2(tmp_pos.y, 0.0), radius);
  vec2 tmp_vertex2 = mul_f64(vec2(tmp_pos.z, 0.0), radius);



  vec4 vec_hi; // = vec4(vertex, 0.0) + vec4(center, 1.0);
  vec4 vec_lo; // = vec4(0.0);


  vec2 tmp_sum0 = sum_f64(tmp_vertex0, vec2(projected_coord_high_prec.x, projected_coord_high_prec.y));
  vec2 tmp_sum1 = sum_f64(tmp_vertex1, vec2(projected_coord_high_prec.z, projected_coord_high_prec.w));
  vec2 tmp_sum2 = sum_f64(tmp_vertex2, vec2(instancePositions.z + 1.0, 0.0));

  vec_hi.x = tmp_sum0.x;
  vec_lo.x = tmp_sum0.y;

  vec_hi.y = tmp_sum1.x;
  vec_lo.y = tmp_sum1.y;

  vec_hi.z = tmp_sum2.x;
  vec_lo.z = tmp_sum2.y;

  vec_hi.w = 1.0;
  vec_lo.w = 0.0;

  vec4 row0_hi = vec4(highPrecProjectionMatrix_hi[0][0], highPrecProjectionMatrix_hi[1][0], highPrecProjectionMatrix_hi[2][0], highPrecProjectionMatrix_hi[3][0]);
  vec4 row1_hi = vec4(highPrecProjectionMatrix_hi[0][1], highPrecProjectionMatrix_hi[1][1], highPrecProjectionMatrix_hi[2][1], highPrecProjectionMatrix_hi[3][1]);
  vec4 row2_hi = vec4(highPrecProjectionMatrix_hi[0][2], highPrecProjectionMatrix_hi[1][2], highPrecProjectionMatrix_hi[2][2], highPrecProjectionMatrix_hi[3][2]);
  vec4 row3_hi = vec4(highPrecProjectionMatrix_hi[0][3], highPrecProjectionMatrix_hi[1][3], highPrecProjectionMatrix_hi[2][3], highPrecProjectionMatrix_hi[3][3]);

  // vec4 row0_lo = vec4(0.0);
  // vec4 row1_lo = vec4(0.0);
  // vec4 row2_lo = vec4(0.0);
  // vec4 row3_lo = vec4(0.0);

   vec4 row0_lo = vec4(highPrecProjectionMatrix_lo[0][0], highPrecProjectionMatrix_lo[1][0], highPrecProjectionMatrix_lo[2][0], highPrecProjectionMatrix_lo[3][0]);
   vec4 row1_lo = vec4(highPrecProjectionMatrix_lo[0][1], highPrecProjectionMatrix_lo[1][1], highPrecProjectionMatrix_lo[2][1], highPrecProjectionMatrix_lo[3][1]);
   vec4 row2_lo = vec4(highPrecProjectionMatrix_lo[0][2], highPrecProjectionMatrix_lo[1][2], highPrecProjectionMatrix_lo[2][2], highPrecProjectionMatrix_lo[3][2]);
   vec4 row3_lo = vec4(highPrecProjectionMatrix_lo[0][3], highPrecProjectionMatrix_lo[1][3], highPrecProjectionMatrix_lo[2][3], highPrecProjectionMatrix_lo[3][3]);


  vec2 row0_hi_lo = vec_dot_f64(row0_hi, row0_lo, vec_hi, vec_lo);
  vec2 row1_hi_lo = vec_dot_f64(row1_hi, row1_lo, vec_hi, vec_lo);
  vec2 row2_hi_lo = vec_dot_f64(row2_hi, row2_lo, vec_hi, vec_lo);
  vec2 row3_hi_lo = vec_dot_f64(row3_hi, row3_lo, vec_hi, vec_lo);


  vec4 glPosition_hi_prec = vec4(row0_hi_lo.x + row0_hi_lo.y, row1_hi_lo.x + row1_hi_lo.y, row2_hi_lo.x + row2_hi_lo.y, row3_hi_lo.x + row3_hi_lo.y);

  gl_Position = glPosition_hi_prec;

  vec4 color = vec4(instanceColors / 255.0, 1.);

  vec4 pickingColor = vec4(instancePickingColors / 255.0, 1.);
  vColor = mix(color, pickingColor, renderPickingBuffer);
}


/*
void main(void) {
  // For some reason, need to add one to elevation to show up in untilted mode
  vec3 center = vec3(project(instancePositions.xy), instancePositions.z + 1.0);
  vec3 vertex = positions * radius * instancePositions.w;
  //gl_Position = //highPrecProjectionMatrix_hi * (vec4(center, 1.0) + vec4(vertex, 0.0));
  //              projectionMatrix * (vec4(vertex, 0.0) + vec4(center, 1.0));

  vec4 center_hi = vec4(center, 1.0); // + vec4(vertex, 0.0);
  vec4 center_lo = vec4(0.0);

  vec4 vertex_hi = vec4(vertex, 0.0); // + vec4(vertex, 0.0);
  vec4 vertex_lo = vec4(0.0);


  vec4 row0_hi = vec4(highPrecProjectionMatrix_hi[0][0], highPrecProjectionMatrix_hi[1][0], highPrecProjectionMatrix_hi[2][0], highPrecProjectionMatrix_hi[3][0]);
  vec4 row1_hi = vec4(highPrecProjectionMatrix_hi[0][1], highPrecProjectionMatrix_hi[1][1], highPrecProjectionMatrix_hi[2][1], highPrecProjectionMatrix_hi[3][1]);
  vec4 row2_hi = vec4(highPrecProjectionMatrix_hi[0][2], highPrecProjectionMatrix_hi[1][2], highPrecProjectionMatrix_hi[2][2], highPrecProjectionMatrix_hi[3][2]);
  vec4 row3_hi = vec4(highPrecProjectionMatrix_hi[0][3], highPrecProjectionMatrix_hi[1][3], highPrecProjectionMatrix_hi[2][3], highPrecProjectionMatrix_hi[3][3]);

  vec4 row0_lo = vec4(highPrecProjectionMatrix_lo[0][0], highPrecProjectionMatrix_lo[1][0], highPrecProjectionMatrix_lo[2][0], highPrecProjectionMatrix_lo[3][0]);
  vec4 row1_lo = vec4(highPrecProjectionMatrix_lo[0][1], highPrecProjectionMatrix_lo[1][1], highPrecProjectionMatrix_lo[2][1], highPrecProjectionMatrix_lo[3][1]);
  vec4 row2_lo = vec4(highPrecProjectionMatrix_lo[0][2], highPrecProjectionMatrix_lo[1][2], highPrecProjectionMatrix_lo[2][2], highPrecProjectionMatrix_lo[3][2]);
  vec4 row3_lo = vec4(highPrecProjectionMatrix_lo[0][3], highPrecProjectionMatrix_lo[1][3], highPrecProjectionMatrix_lo[2][3], highPrecProjectionMatrix_lo[3][3]);


  vec2 row0_hi_lo = sum_f64(vec_dot_f64(row0_hi, row0_lo, center_hi, center_lo), vec_dot_f64(row0_hi, row0_lo, vertex_hi, vertex_lo));
  vec2 row1_hi_lo = sum_f64(vec_dot_f64(row1_hi, row1_lo, center_hi, center_lo), vec_dot_f64(row1_hi, row1_lo, vertex_hi, vertex_lo));
  vec2 row2_hi_lo = sum_f64(vec_dot_f64(row2_hi, row2_lo, center_hi, center_lo), vec_dot_f64(row2_hi, row2_lo, vertex_hi, vertex_lo));
  vec2 row3_hi_lo = sum_f64(vec_dot_f64(row3_hi, row3_lo, center_hi, center_lo), vec_dot_f64(row3_hi, row3_lo, vertex_hi, vertex_lo));


  gl_Position = vec4(row0_hi_lo.x, row1_hi_lo.x, row2_hi_lo.x, row3_hi_lo.x);

  vec4 color = vec4(instanceColors / 255.0, 1.);
  if (highPrecProjectionMatrix_hi[0][0] - projectionMatrix[0][0] < 1e-4)
  {
    color = vec4(0.0, 1.0, 0.0, 1.0);
  }
  else
  {
    color = vec4(1.0, 0.0, 0.0, 1.0);

  }
  vec4 pickingColor = vec4(instancePickingColors / 255.0, 1.);
  vColor = mix(color, pickingColor, renderPickingBuffer);
}

*/
