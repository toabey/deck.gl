// Copyright (c) 2016 Uber Technologies, Inc.
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

/* eslint-disable no-var, max-statements */
import 'babel-polyfill';
import {document, window} from 'global';
import glslify from 'glslify';
import {Buffer, createGLContext, PerspectiveCamera, Program} from 'luma.gl';

function df64ify(a) {
  const a_hi = new Float32Array([a])[0];
  const a_lo = a - a_hi;
  return [a_hi, a_lo];
}

window.onload = () => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = createGLContext({canvas});
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const camera = new PerspectiveCamera({
    aspect: canvas.width / canvas.height,
    position: [0, 0, -5]
  });

  // float +-*/
  const a = Math.random();
  const b = Math.random();

  // vec4 * vec4
  const c = [Math.random(), Math.random(), Math.random(), Math.random()];
  const d = [Math.random(), Math.random(), Math.random(), Math.random()];
  const vec_mult_cd = c[0] * d[0] + c[1] * d[1] + c[2] * d[2] + c[3] * d[3];

  // mat4 * vec4
  const m = [
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16
  ];
  const e = [1, 2, 3, 4];
  const mat_mult_vec_mc = [
    m[0] * e[0] + m[1] * e[1] + m[2] * e[2] + m[3] * e[3],
    m[4] * e[0] + m[5] * e[1] + m[6] * e[2] + m[7] * e[3],
    m[8] * e[0] + m[9] * e[1] + m[10] * e[2] + m[11] * e[3],
    m[12] * e[0] + m[13] * e[1] + m[14] * e[2] + m[15] * e[3]
  ];

  const mat_mult_vec_mc_f64 = mat_mult_vec_mc.map(x => df64ify(x));
  console.log('mat_mult_vec_mc_f64', mat_mult_vec_mc_f64);
  // const mat_mult_vec_mc_hi = mat_mult_vec_mc_f64.map(x => x[0]);
  // const mat_mult_vec_mc_lo = mat_mult_vec_mc_f64.map(x => x[1]);

  // console.log(c, d, vec_mult_cd);
  // console.log(m, e, mat_mult_vec_mc);

  const cF64 = c.map(cc => df64ify(cc));
  const dF64 = d.map(dd => df64ify(dd));
  const eF64 = e.map(ee => df64ify(ee));
  const mF64 = m.map(mm => df64ify(mm));

  const program = new Program(gl, {
    vs: glslify('./f64/vs.glsl'),
    fs: glslify('./f64/fs.glsl')
  });

  program.use();
  program.setBuffers({
    positions: new Buffer(gl).setData({
      data: new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]),
      size: 2
    })
  }).setUniforms({
    a: df64ify(a),
    b: df64ify(b),
    c_hi: cF64.map(cc => cc[0]),
    c_lo: cF64.map(cc => cc[1]),
    d_hi: dF64.map(dd => dd[0]),
    d_lo: dF64.map(dd => dd[1]),
    e_hi: dF64.map(ee => ee[0]),
    e_lo: dF64.map(ee => ee[1]),
    m_hi: mF64.map(mm => mm[0]),
    m_lo: mF64.map(mm => mm[1]),
    sum_ab: df64ify(a + b),
    sub_ab: df64ify(a - b),
    mul_ab: df64ify(a * b),
    div_ab: df64ify(a / b),
    rad_a: df64ify(a * Math.PI / 180),
    vec_mult_cd: df64ify(vec_mult_cd),
    mat_mult_vec_mc_f64,

    res0: mat_mult_vec_mc_f64[0],
    res1: mat_mult_vec_mc_f64[1],
    res2: mat_mult_vec_mc_f64[2],
    res3: mat_mult_vec_mc_f64[3],

    uMVMatrix: camera.view,
    uPMatrix: camera.projection
  });

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
