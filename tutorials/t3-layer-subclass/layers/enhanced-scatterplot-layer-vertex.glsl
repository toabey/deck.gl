#define SHADER_NAME enhanced-scatterplot-layer-vs

#pragma glslify: mercatorProject = require(../../../shaderlib/mercator-project)
uniform float mercatorScale;

attribute vec3 positions;
attribute vec3 instancePositions;
attribute vec3 instanceColors;
attribute vec3 instancePickingColors;

uniform float radius;
uniform float opacity;

uniform mat4 worldMatrix;
uniform mat4 projectionMatrix;

varying vec4 vColor;
uniform float renderPickingBuffer;

void main(void) {
  vec2 pos = mercatorProject(instancePositions.xy, mercatorScale);
  // Need to add one to elevation to show up in untilted mode
  vec3 p = vec3(pos, instancePositions.z + 1.) + positions * radius;
  gl_Position = projectionMatrix * vec4(p, 1.0);

  vec4 color = vec4(instanceColors / 255.0, 1.);
  vec4 pickingColor = vec4(instancePickingColors / 255.0, 1.);
  vColor = mix(color, pickingColor, renderPickingBuffer);
}
