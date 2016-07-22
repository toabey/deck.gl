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

import {Layer} from '../../../src';
import {Model, Program, Geometry} from 'luma.gl';
const glslify = require('glslify');

const ATTRIBUTES = {
  instancePositions: {size: 3, 0: 'x', 1: 'y', 2: 'z'},
  instanceColors: {size: 3, 0: 'r', 1: 'g', 2: 'b'}
};

const MERCATOR_PROJECT = `
const float TILE_SIZE = 512.0;
const float PI = 3.1415926536;
const float WORLD_SCALE = TILE_SIZE / (PI * 2.0);

// non-linear projection: lnglats => zoom 0 tile [0-512, 0-512] * scale
vec2 mercatorProject(vec2 lnglat, float zoomScale) {
  float scale = WORLD_SCALE * zoomScale;
  return vec2(
    scale * (radians(lnglat.x) + PI),
    scale * (PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5)))
  );
}
`;

const VERTEX_SHADER = `
#define SHADER_NAME enhanced-scatterplot-layer-vs

${MERCATOR_PROJECT}

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
`;

const FRAGMENT_SHADER = `
#define SHADER_NAME enhanced-scatterplot-layer-fs

#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;

void main(void) {
  gl_FragColor = vColor;
}
`;


export default class EnhancedScatterplotLayer extends Layer {

  static get attributes() {
    return ATTRIBUTES;
  }

  /*
   * @classdesc
   * EnhancedScatterplotLayer
   *
   * @class
   * @param {object} props
   * @param {number} props.radius - point radius
   */
  constructor(props) {
    super(props);
  }

  initializeState() {
    const {gl} = this.state;
    const {attributeManager} = this.state;

    this.setState({
      model: this.getModel(gl)
    });

    attributeManager.addInstanced(ATTRIBUTES, {
      instancePositions: {update: this.calculateInstancePositions},
      instanceColors: {update: this.calculateInstanceColors}
    });
  }

  didMount() {
    this.updateUniforms();
  }

  willReceiveProps(oldProps, newProps) {
    super.willReceiveProps(oldProps, newProps);
    this.updateUniforms();
  }

  getModel(gl) {
    const NUM_SEGMENTS = 16;
    const PI2 = Math.PI * 2;

    let positions = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      positions = [
        ...positions,
        Math.cos(PI2 * i / NUM_SEGMENTS),
        Math.sin(PI2 * i / NUM_SEGMENTS),
        0
      ];
    }

    return new Model({
      id: 'enhanced-scatterplot',
      program: new Program(gl, {
        vs: VERTEX_SHADER,
        fs: FRAGMENT_SHADER
        // vs: glslify('./enhanced-scatterplot-layer-vertex.glsl'),
        // fs: glslify('./enhanced-scatterplot-layer-fragment.glsl'),
      }),
      geometry: new Geometry({
        drawMode: 'TRIANGLE_FAN',
        positions: new Float32Array(positions)
      }),
      isInstanced: true
    });
  }

  updateUniforms() {
    this.calculateRadius();
    const {radius} = this.state;
    this.setUniforms({
      radius
    });
  }

  calculateInstancePositions(attribute) {
    const {data} = this.props;
    const {value, size} = attribute;
    let i = 0;
    for (const point of data) {
      value[i + 0] = point.position.x;
      value[i + 1] = point.position.y;
      value[i + 2] = point.position.z;
      value[i + 3] = point.radius || 1;
      i += size;
    }
  }

  calculateInstanceColors(attribute) {
    const {data} = this.props;
    const {value, size} = attribute;
    let i = 0;
    for (const point of data) {
      value[i + 0] = point.color[0];
      value[i + 1] = point.color[1];
      value[i + 2] = point.color[2];
      i += size;
    }
  }

  calculateRadius() {
    // use radius if specified
    if (this.props.radius) {
      this.state.radius = this.props.radius;
      return;
    }

    const pixel0 = this.project({lon: -122, lat: 37.5});
    const pixel1 = this.project({lon: -122, lat: 37.5002});

    const dx = pixel0.x - pixel1.x;
    const dy = pixel0.y - pixel1.y;

    this.state.radius = Math.max(Math.sqrt(dx * dx + dy * dy), 2.0);
  }

}
