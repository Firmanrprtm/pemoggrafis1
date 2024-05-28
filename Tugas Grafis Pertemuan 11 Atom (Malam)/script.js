var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl');

// Cek browser
if (!gl) {
    console.log('Browser tidak mendukung WebGL');
} else {
    console.log('Browser mendukung WebGL.');
}

// Warna canvas
gl.clearColor(0.4343, 0.2422, 0.3343, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Vertex shader source
var vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// Fragment shader source
var fragmentShaderSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;

// Buat vertex shader
var vShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vShader, vertexShaderSource);
gl.compileShader(vShader);

// Buat fragment shader
var fShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fShader, fragmentShaderSource);
gl.compileShader(fShader);

// Program shader
var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vShader);
gl.attachShader(shaderProgram, fShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Fungsi untuk menggambar lingkaran
function drawCircle(centerX, centerY, radius, numSegments) {
    var vertices = [];
    for (var i = 0; i <= numSegments; i++) {
        var angle = i * 2 * Math.PI / numSegments;
        var x = centerX + radius * Math.cos(angle);
        var y = centerY + radius * Math.sin(angle);
        vertices.push(x, y);
    }

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');
    gl.enableVertexAttribArray(positionLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 1);
}

// Variabel untuk menyimpan posisi dan kecepatan
var numCircles = 4;
var radius = 0.05; // Ukuran lingkaran

// Variabel untuk menyimpan posisi awal dan target
var startPos = [
    { x: 0.8, y: 0.0 },  // Lingkaran 1 (kanan ke kiri)
    { x: 0.0, y: -0.8 }, // Lingkaran 2 (bawah ke atas)
    { x: 0.8, y: 0.8 },  // Lingkaran 3 (kanan atas ke kiri bawah)
    { x: -0.8, y: 0.8 }  // Lingkaran 4 (kiri atas ke kanan bawah)
];

var endPos = [
    { x: -0.8, y: 0.0 }, // Lingkaran 1 (kanan ke kiri)
    { x: 0.0, y: 0.8 },  // Lingkaran 2 (bawah ke atas)
    { x: -0.8, y: -0.8 }, // Lingkaran 3 (kanan atas ke kiri bawah)
    { x: 0.8, y: -0.8 }  // Lingkaran 4 (kiri atas ke kanan bawah)
];

var positions = JSON.parse(JSON.stringify(startPos)); // Salin posisi awal
var states = Array(numCircles).fill(true); // true berarti menuju target, false berarti kembali ke posisi awal

// Variabel untuk menyimpan kecepatan gerakan
var moveSpeeds = Array(numCircles).fill(0.01);

// Variabel untuk mengatur jeda waktu
var delays = [0, 1000, 2000, 3000]; // Waktu jeda untuk masing-masing lingkaran dalam milidetik
var activeCircles = [false, false, false, false]; // Status aktif setiap lingkaran

// Aktifkan lingkaran dengan jeda waktu
for (let i = 0; i < numCircles; i++) {
    setTimeout(() => {
        activeCircles[i] = true;
    }, delays[i]);
}

// Fungsi untuk memperbarui posisi
function updatePositions() {
    for (var i = 0; i < numCircles; i++) {
        if (!activeCircles[i]) continue; // Lewati lingkaran yang belum aktif

        var pos = positions[i];
        var target = states[i] ? endPos[i] : startPos[i];
        var dx = target.x - pos.x;
        var dy = target.y - pos.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0.01) {
            pos.x += dx / dist * moveSpeeds[i];
            pos.y += dy / dist * moveSpeeds[i];
        } else {
            // Tukar status bolak-balik
            states[i] = !states[i];
        }
    }
}

// Fungsi untuk menggambar animasi
function animateCircles() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    updatePositions();

    for (var i = 0; i < numCircles; i++) {
        drawCircle(positions[i].x, positions[i].y, radius, 30); // Menggambar lingkaran dengan 30 segmen
    }

    requestAnimationFrame(animateCircles);
}

animateCircles();
