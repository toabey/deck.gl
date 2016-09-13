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
import {Buffer, createGLContext, Program} from 'luma.gl';


// Utilities functions that to be moved to a common place for future tests

function glEnumToString(gl, value) {
  // Optimization for the most common enum:
  if (value === gl.NO_ERROR) {
    return "NO_ERROR";
  }
  for (var p in gl) {
    if (gl[p] == value) {
      return p;
    }
  }
  return "0x" + value.toString(16);
};

function addSpan(contents, div) {
    if (div == undefined) {
      var divs = document.body.getElementsByClassName("testInfo");
      var lastDiv = divs[divs.length - 1];
      div = lastDiv;
    }

    var span = document.createElement("span");
    div.appendChild(span);
    span.innerHTML = contents + '<br />';
}

function addDiv(contents) {
    var testInfoDiv = document.createElement("div");
    document.body.appendChild(testInfoDiv);
    testInfoDiv.setAttribute("class", "testInfo");

    return testInfoDiv;
}

function logToConsole(msg) {
    if (window.console)
      window.console.log(msg);
}

function escapeHTML(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function testPassed(msg) {
    addSpan('<span><span class="pass" style="color:green">PASS</span> ' + escapeHTML(msg) + '</span>');
    logToConsole('PASS ' + msg);
}

function testFailed(msg) {
    addSpan('<span><span class="fail" style="color:red">FAIL</span> ' + escapeHTML(msg) + '</span>');
    logToConsole('FAIL ' + msg);
}

function glErrorShouldBe(gl, glErrors, opt_msg) {
  if (!glErrors.length) {
    glErrors = [glErrors];
  }
  opt_msg = opt_msg || "";
  var err = gl.getError();
  var ndx = glErrors.indexOf(err);
  var errStrs = [];
  for (var ii = 0; ii < glErrors.length; ++ii) {
    errStrs.push(glEnumToString(gl, glErrors[ii]));
  }
  var expected = errStrs.join(" or ");
  if (ndx < 0) {
    var msg = "getError expected" + ((glErrors.length > 1) ? " one of: " : ": ");
    testFailed(msg + expected +  ". Was " + glEnumToString(gl, err) + " : " + opt_msg);
  } else {
    //var msg = "getError was " + ((glErrors.length > 1) ? "one of: " : "expected value: ");
    //testPassed(msg + expected + " : " + opt_msg);
  }
};

function isWebGLContext(ctx) {
  if (ctx instanceof WebGLRenderingContext)
    return true;

  if ('WebGL2RenderingContext' in window && ctx instanceof WebGL2RenderingContext)
    return true;

  return false;
};

/**
 * Clips a range to min, max
 * (Eg. clipToRange(-5,7,0,20) would return {value:0,extent:2}
 * @param {number} value start of range
 * @param {number} extent extent of range
 * @param {number} min min.
 * @param {number} max max.
 * @return {!{value:number,extent:number} The clipped value.
 */
function clipToRange(value, extent, min, max) {
  if (value < min) {
    extent -= min - value;
    value = min;
  }
  var end = value + extent;
  if (end > max) {
    extent -= end - max;
  }
  if (extent < 0) {
    value = max;
    extent = 0;
  }
  return {value:value, extent: extent};
};

/**
 * Checks that a portion of a canvas or the currently attached framebuffer is 1 color.
 * @param {!WebGLRenderingContext|CanvasRenderingContext2D} gl The
 *         WebGLRenderingContext or 2D context to use.
 * @param {number} x left corner of region to check.
 * @param {number} y bottom corner of region to check in case of checking from
 *        a GL context or top corner in case of checking from a 2D context.
 * @param {number} width width of region to check.
 * @param {number} height width of region to check.
 * @param {!Array.<number>} color The color expected. A 4 element array where
 *        each element is in the range 0 to 255.
 * @param {number} opt_errorRange Optional. Acceptable error in
 *        color checking. 0 by default.
 * @param {!function()} sameFn Function to call if all pixels
 *        are the same as color.
 * @param {!function()} differentFn Function to call if a pixel
 *        is different than color
 * @param {!function()} logFn Function to call for logging.
 * @param {Uint8Array} opt_readBackBuf typically passed to reuse existing
 *        buffer while reading back pixels.
 */
function checkCanvasRectColor(gl, x, y, width, height, color, opt_errorRange, sameFn, differentFn, logFn, opt_readBackBuf) {
  if (isWebGLContext(gl) && !gl.getParameter(gl.FRAMEBUFFER_BINDING)) {
    // We're reading the backbuffer so clip.
    var xr = clipToRange(x, width, 0, gl.canvas.width);
    var yr = clipToRange(y, height, 0, gl.canvas.height);
    if (!xr.extent || !yr.extent) {
      logFn("checking rect: effective width or height is zero");
      sameFn();
      return;
    }
    x = xr.value;
    y = yr.value;
    width = xr.extent;
    height = yr.extent;
  }
  var errorRange = opt_errorRange || 0;
  if (!errorRange.length) {
    errorRange = [errorRange, errorRange, errorRange, errorRange]
  }
  var buf;
  if (isWebGLContext(gl)) {
    buf = opt_readBackBuf ? opt_readBackBuf : new Uint8Array(width * height * 4);
    gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  } else {
    buf = gl.getImageData(x, y, width, height).data;
  }
  for (var i = 0; i < width * height; ++i) {
    var offset = i * 4;
    for (var j = 0; j < color.length; ++j) {
      if (Math.abs(buf[offset + j] - color[j]) > errorRange[j]) {
        var was = buf[offset + 0].toString();
        for (j = 1; j < color.length; ++j) {
          was += "," + buf[offset + j];
        }
        differentFn('at (' + (x + (i % width)) + ', ' + (y + Math.floor(i / width)) +
                    ') expected: ' + color + ' was ' + was);
        return;
      }
    }
  }
  sameFn();
};

/**
 * Checks that a portion of a canvas or the currently attached framebuffer is 1 color.
 * @param {!WebGLRenderingContext|CanvasRenderingContext2D} gl The
 *         WebGLRenderingContext or 2D context to use.
 * @param {number} x left corner of region to check.
 * @param {number} y bottom corner of region to check in case of checking from
 *        a GL context or top corner in case of checking from a 2D context.
 * @param {number} width width of region to check.
 * @param {number} height width of region to check.
 * @param {!Array.<number>} color The color expected. A 4 element array where
 *        each element is in the range 0 to 255.
 * @param {string} opt_msg Message to associate with success. Eg
 *        ("should be red").
 * @param {number} opt_errorRange Optional. Acceptable error in
 *        color checking. 0 by default.
 */
function checkCanvasRect(gl, x, y, width, height, color, opt_msg, opt_errorRange) {
  var debug;
  checkCanvasRectColor(
      gl, x, y, width, height, color, opt_errorRange,
      function() {
        var msg = opt_msg;
        if (msg === undefined)
          msg = "should be " + color.toString();
        testPassed(msg);
      },
      testFailed,
      debug);
};

/**
 * Checks that an entire canvas or the currently attached framebuffer is 1 color.
 * @param {!WebGLRenderingContext|CanvasRenderingContext2D} gl The
 *         WebGLRenderingContext or 2D context to use.
 * @param {!Array.<number>} color The color expected. A 4 element array where
 *        each element is in the range 0 to 255.
 * @param {string} msg Message to associate with success. Eg ("should be red").
 * @param {number} errorRange Optional. Acceptable error in
 *        color checking. 0 by default.
 */
function checkCanvas(gl, color, msg, errorRange) {
  checkCanvasRect(gl, 0, 0, gl.canvas.width, gl.canvas.height, color, msg, errorRange);
};

/**
 * Checks a rectangular area both inside the area and outside
 * the area.
 * @param {!WebGLRenderingContext|CanvasRenderingContext2D} gl The
 *         WebGLRenderingContext or 2D context to use.
 * @param {number} x left corner of region to check.
 * @param {number} y bottom corner of region to check in case of checking from
 *        a GL context or top corner in case of checking from a 2D context.
 * @param {number} width width of region to check.
 * @param {number} height width of region to check.
 * @param {!Array.<number>} innerColor The color expected inside
 *     the area. A 4 element array where each element is in the
 *     range 0 to 255.
 * @param {!Array.<number>} outerColor The color expected
 *     outside. A 4 element array where each element is in the
 *     range 0 to 255.
 * @param {!number} opt_edgeSize: The number of pixels to skip
 *     around the edges of the area. Defaut 0.
 * @param {!{width:number, height:number}} opt_outerDimensions
 *     The outer dimensions. Default the size of gl.canvas.
 */
function checkAreaInAndOut(gl, x, y, width, height, innerColor, outerColor, opt_edgeSize, opt_outerDimensions) {
  var outerDimensions = opt_outerDimensions || { width: gl.canvas.width, height: gl.canvas.height };
  var edgeSize = opt_edgeSize || 0;
  checkCanvasRect(gl, x + edgeSize, y + edgeSize, width - edgeSize * 2, height - edgeSize * 2, innerColor);
  checkCanvasRect(gl, 0, 0, x - edgeSize, outerDimensions.height, outerColor);
  checkCanvasRect(gl, x + width + edgeSize, 0, outerDimensions.width - x - width - edgeSize, outerDimensions.height, outerColor);
  checkCanvasRect(gl, 0, 0, outerDimensions.width, y - edgeSize, outerColor);
  checkCanvasRect(gl, 0, y + height + edgeSize, outerDimensions.width, outerDimensions.height - y - height - edgeSize, outerColor);
};


// Special utility functions for df64 tests

function df64ify(a) {
  const a_hi = new Float32Array([a])[0];
  const a_lo = a - a_hi;
  return [a_hi, a_lo];
}

function array_df64ify(in_array) {
  return [in_array.map(f => df64ify(f)[0]), in_array.map(f => df64ify(f)[1])]
}

function getFloat64() {
  return Math.random();
}

function getVec4Float64() {
  return [getFloat64(), getFloat64(), getFloat64(), getFloat64()]
}

function getMat4Float64() {
  var result = [];
  for (var i = 0; i < 16; i++)
  {
    result.push(getFloat64());
  }
  return result;
}


// Actual tests for different arithmetic functions

function test_float_add(gl, testName) {
  var currentDiv = addDiv();
  addSpan("#######################", currentDiv);
  addSpan(testName, currentDiv);

 // float +-
  const float0 = getFloat64();
  const float1 = getFloat64();
  const float_ref = float0 + float1;

  const float0_vec2 = df64ify(float0);
  const float1_vec2 = df64ify(float1);
  const float_ref_vec2 = df64ify(float_ref);

  console.log(float0);
  console.log(float1);
  console.log(float_ref_vec2);

  const program = new Program(gl, {
    vs: glslify('./f64/vs_float_add.glsl'),
    fs: glslify('./f64/fs.glsl')
  });

  program.use();
  program.setBuffers({
    positions: new Buffer(gl).setData({
      data: new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]),
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    b: float1_vec2,
    EPSILON: 1.2e-7, // 2 ulp (1 ulp ~ 2^-24 ~ 6e-8)
    ref: float_ref_vec2
  });

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  glErrorShouldBe(gl, gl.NO_ERROR, "no error from draw");
  var green = [0, 255, 0, 255];
  checkCanvas(gl, green);

  addSpan("#######################", currentDiv);
}

function test_float_mul(gl, testName) {
  var currentDiv = addDiv();
  addSpan("#######################", currentDiv);
  addSpan(testName, currentDiv);

 // float *
  var  float0 = getFloat64();
  var float1 = getFloat64();

  float0 = 1.23456789123456789e8;
  float1 = 9.87654321987654321e-4;

  const float_ref = float0 * float1;

  const float0_vec2 = df64ify(float0);
  const float1_vec2 = df64ify(float1);
  const float_ref_vec2 = df64ify(float_ref);

  console.log(float0);
  console.log(float1);
  console.log(float_ref_vec2);

  const program = new Program(gl, {
    vs: glslify('./f64/vs_float_mul.glsl'),
    fs: glslify('./f64/fs.glsl')
  });

  program.use();
  program.setBuffers({
    positions: new Buffer(gl).setData({
      data: new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]),
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    b: float1_vec2,
    EPSILON: 2.4e-7, // 4 ulp (1 ulp ~ 2^-24 ~ 6e-8)
    ref: float_ref_vec2
  });

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  glErrorShouldBe(gl, gl.NO_ERROR, "no error from draw");
  var green = [0, 255, 0, 255];
  checkCanvas(gl, green);

  addSpan("#######################", currentDiv);
}

function test_float_div(gl, testName) {
  var currentDiv = addDiv();
  addSpan("#######################", currentDiv);
  addSpan(testName, currentDiv);

 // float /
  const float0 = getFloat64();
  const float1 = getFloat64();
  const float_ref = float0 / float1;

  const float0_vec2 = df64ify(float0);
  const float1_vec2 = df64ify(float1);
  const float_ref_vec2 = df64ify(float_ref);

  console.log(float0);
  console.log(float1);
  console.log(float_ref_vec2);

  const program = new Program(gl, {
    vs: glslify('./f64/vs_float_div.glsl'),
    fs: glslify('./f64/fs.glsl')
  });

  program.use();
  program.setBuffers({
    positions: new Buffer(gl).setData({
      data: new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]),
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    b: float1_vec2,
    EPSILON: 4.8e-7,
    ref: float_ref_vec2
  });

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  glErrorShouldBe(gl, gl.NO_ERROR, "no error from draw");
  var green = [0, 255, 0, 255];
  checkCanvas(gl, green);

  addSpan("#######################", currentDiv);
}

function test_float_sqrt(gl, testName) {
  var currentDiv = addDiv();
  addSpan("#######################", currentDiv);
  addSpan(testName, currentDiv);

 // float /
  const float0 = getFloat64();
  const float_ref = Math.sqrt(float0);

  const float0_vec2 = df64ify(float0);
  const float_ref_vec2 = df64ify(float_ref);

  console.log(float0);
  console.log(float_ref_vec2);

  const program = new Program(gl, {
    vs: glslify('./f64/vs_float_sqrt.glsl'),
    fs: glslify('./f64/fs.glsl')
  });

  program.use();
  program.setBuffers({
    positions: new Buffer(gl).setData({
      data: new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]),
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    EPSILON: 4.8e-7, // 8 ulp (1 ulp ~ 2^-24 ~ 6e-8)
    ref: float_ref_vec2
  });

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  glErrorShouldBe(gl, gl.NO_ERROR, "no error from draw");
  var green = [0, 255, 0, 255];
  checkCanvas(gl, green);

  addSpan("#######################", currentDiv);
}

function test_float_exp(gl, testName) {
  var currentDiv = addDiv();
  addSpan("#######################", currentDiv);
  addSpan(testName, currentDiv);

 // float /
  const float0 = getFloat64();
  const float_ref = Math.exp(float0);

  const float0_vec2 = df64ify(float0);
  const float_ref_vec2 = df64ify(float_ref);

  console.log(float0);
  console.log(float_ref_vec2);

  const program = new Program(gl, {
    vs: glslify('./f64/vs_float_exp.glsl'),
    fs: glslify('./f64/fs.glsl')
  });

  program.use();
  program.setBuffers({
    positions: new Buffer(gl).setData({
      data: new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]),
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    EPSILON: 1e-6,
    ref: float_ref_vec2
  });

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  glErrorShouldBe(gl, gl.NO_ERROR, "no error from draw");
  var green = [0, 255, 0, 255];
  checkCanvas(gl, green);

  addSpan("#######################", currentDiv);
}

function test_float_log(gl, testName) {
  var currentDiv = addDiv();
  addSpan("#######################", currentDiv);
  addSpan(testName, currentDiv);

 // float /
  const float0 = getFloat64();
  const float_ref = Math.log(float0);

  const float0_vec2 = df64ify(float0);
  const float_ref_vec2 = df64ify(float_ref);

  console.log(float0);
  console.log(float_ref_vec2);

  const program = new Program(gl, {
    vs: glslify('./f64/vs_float_log.glsl'),
    fs: glslify('./f64/fs.glsl')
  });

  program.use();
  program.setBuffers({
    positions: new Buffer(gl).setData({
      data: new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]),
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    EPSILON: 1e-5,
    ref: float_ref_vec2
  });

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  glErrorShouldBe(gl, gl.NO_ERROR, "no error from draw");
  var green = [0, 255, 0, 255];
  checkCanvas(gl, green);

  addSpan("#######################", currentDiv);
}


function test_vector_dot(gl, passMsg) {
  var currentDiv = addDiv();
  addSpan(passMsg, currentDiv);

  const vec4float0 = getVec4Float64();
  const vec4float1 = getVec4Float64();

  const vec4xvec4float_ref = vec4float0[0] * vec4float1[0] + vec4float0[1] * vec4float1[1] + vec4float0[2] * vec4float1[2] + vec4float0[3] * vec4float1[3];

  var vec4float0_hi, vec4float0_lo;
  [vec4float0_hi, vec4float0_lo] = array_df64ify(vec4float0);

  var vec4float1_hi, vec4float1_lo;
  [vec4float1_hi, vec4float1_lo] = array_df64ify(vec4float1);

  var vec4xvec4float_ref_vec2;
  vec4xvec4float_ref_vec2 = df64ify(vec4xvec4float_ref);

  console.log(vec4float0);
  console.log(vec4float1);

  console.log("\n");

  console.log(vec4float0_hi);
  console.log(vec4float0_lo);
  console.log(vec4float1_hi);
  console.log(vec4float1_lo);

  console.log("\n");

  console.log(vec4xvec4float_ref_vec2);

  const program = new Program(gl, {
    vs: glslify('./f64/vs_vector_dot.glsl'),
    fs: glslify('./f64/fs.glsl')
  });

  program.use();
  program.setBuffers({
    positions: new Buffer(gl).setData({
      data: new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]),
      size: 2
    })
  }).setUniforms({
    a_hi: vec4float0_hi,
    a_lo: vec4float0_lo,
    b_hi: vec4float1_hi,
    b_lo: vec4float1_lo,
    EPSILON: 1.32e-6, // 4 mul + 3 add ~ 22 ulp (1 ulp ~ 2^-24 ~ 6e-8)
    ref: vec4xvec4float_ref_vec2
  });

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  glErrorShouldBe(gl, gl.NO_ERROR, "no error from draw");
  var green = [0, 255, 0, 255];
  checkCanvas(gl, green);
}

function test_mat_vector_mul(gl, testName) {
  var currentDiv = addDiv();
  addSpan("#######################", currentDiv);
  addSpan(testName, currentDiv);

  // mat4 * vec4
  const mat4float = getMat4Float64();
  const vec4float = getVec4Float64();

  const mat4xvec4float_ref = [
    mat4float[0] * vec4float[0] + mat4float[1] * vec4float[1] + mat4float[2] * vec4float[2] + mat4float[3] * vec4float[3],
    mat4float[4] * vec4float[0] + mat4float[5] * vec4float[1] + mat4float[6] * vec4float[2] + mat4float[7] * vec4float[3],
    mat4float[8] * vec4float[0] + mat4float[9] * vec4float[1] + mat4float[10] * vec4float[2] + mat4float[11] * vec4float[3],
    mat4float[12] * vec4float[0] + mat4float[13] * vec4float[1] + mat4float[14] * vec4float[2] + mat4float[15] * vec4float[3]
  ];

  var mat4float_lo, mat4float_hi;
  [mat4float_hi, mat4float_lo] = array_df64ify(mat4float);

  var vec4float_lo, vec4float_hi;
  [vec4float_hi, vec4float_lo] = array_df64ify(vec4float);

  var mat4xvec4float_ref_lo, mat4xvec4float_ref_hi;
  [mat4xvec4float_ref_hi, mat4xvec4float_ref_lo] = array_df64ify(mat4xvec4float_ref);

  console.log('mat4float', mat4float);
  console.log('vec4float', vec4float);
  console.log('mat4xvec4float_ref', mat4xvec4float_ref);

  console.log('mat4xvec4float_ref_lo', mat4xvec4float_ref_lo);
  console.log('mat4xvec4float_ref_hi', mat4xvec4float_ref_hi);

  const program = new Program(gl, {
    vs: glslify('./f64/vs_mat_vec_mul.glsl'),
    fs: glslify('./f64/fs.glsl')
  });

  program.use();
  program.setBuffers({
    positions: new Buffer(gl).setData({
      data: new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]),
      size: 2
    })
  }).setUniforms({
    mat_hi: mat4float_hi,
    mat_lo: mat4float_lo,
    vec_hi: vec4float_hi,
    vec_lo: vec4float_lo,
    EPSILON: 1.32e-6, // 4 mul + 3 add ~ 22 ulp (1 ulp ~ 2^-24 ~ 6e-8)
    ref_hi: mat4xvec4float_ref_hi,
    ref_lo: mat4xvec4float_ref_lo
  });

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  glErrorShouldBe(gl, gl.NO_ERROR, "no error from draw");
  var green = [0, 255, 0, 255];
  checkCanvas(gl, green);

  addSpan("#######################", currentDiv);
}

// Main entrance

window.onload = () => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  canvas.width = 400;
  canvas.height = 400;

  // Initialize GL

  const gl = createGLContext({canvas});
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var idx0;
  //for (idx0 = 0; idx0 < 100; idx0++) {
  // test_float_add(gl, "Test float + float");

    test_float_mul(gl, "Test float x float");

   // test_float_div(gl, "Test float / float");

   // test_float_sqrt(gl, "Test sqrt(float)");

   //test_float_exp(gl, "Test exp(float)")

   //test_float_log(gl, "Test log(float)")

   // test_vector_dot(gl, "Test vec4 dot vec4");

   // test_mat_vector_mul(gl, "Test mat4 mul vec4");
  //}

}
