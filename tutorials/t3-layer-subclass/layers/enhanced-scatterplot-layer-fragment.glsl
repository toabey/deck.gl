#define SHADER_NAME enhanced-scatterplot-layer-fs

#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;

void main(void) {
  // gl_FragColor = vColor;
  gl_FragColor = vec4(1., 0., 0., 1.);
}
