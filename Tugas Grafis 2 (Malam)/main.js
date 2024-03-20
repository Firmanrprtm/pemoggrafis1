const canvas = document.querySelector('canvas');

canvas.width = 800;
canvas.height = 800;

const gl = canvas.getContext('webgl');

if (!gl) {
  throw new Error('WebGL Not supported');
}

gl.clearColor(0.0, 0.0, 1, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const points = [
  -0.5, 0.5,
  0.5, -0.5,
  -0.5, -0.5,  // Coordinates for the second line
  0.5, 0.5,
  0.5, 0.0,  // Coordinates for the second line
  0.0, -0.5,    
];

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0); // Corrected spelling
}
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShaderSource = `
precision mediump float;

void main() {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`;

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // Use createShader
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

gl.drawArrays(gl.LINES, 0, 6);