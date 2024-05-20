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
    uniform vec4 u_color; // tambahkan variabel untuk warna
    void main() { 
        gl_FragColor = u_color; // gunakan warna yang diberikan
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

// Variabel untuk menyimpan sudut rotasi 
var rotationAngleClockwise = 0;
var rotationAngleCounterClockwise = 0;

function drawTriangle(positionX, positionY, rotationAngle, color) {
    var center = [positionX, positionY]; // Posisi pusat segitiga
    var radius = 0.2; // Jari-jari segitiga
    var numSides = 3; // Jumlah sisi segitiga
    var angleIncrement = (2 * Math.PI) / numSides;

    var vertices = [center[0], center[1]]; // Pusat segitiga

    for (var i = 0; i <= numSides; i++) {
        var angle = i * angleIncrement + rotationAngle; // Menambahkan rotasi

        var x = center[0] + Math.cos(angle) * radius;
        var y = center[1] + Math.sin(angle) * radius;

        vertices.push(x, y);
    }

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');
    gl.enableVertexAttribArray(positionLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Memeriksa apakah segitiga adalah segitiga tengah atau segitiga bawah
    if (positionY === -0.02 || positionY === -0.6) {
        // Jika segitiga tengah atau segitiga bawah, atur warna menjadi putih
        var whiteColor = [1.0, 1.0, 1.0, 1.0];
        var colorLocation = gl.getUniformLocation(shaderProgram, 'u_color');
        gl.uniform4fv(colorLocation, whiteColor);
    } else {
        // Jika bukan segitiga tengah atau segitiga bawah, atur warna menjadi acak
        var randomColor = [Math.random(), Math.random(), Math.random(), 1.0];
        var colorLocation = gl.getUniformLocation(shaderProgram, 'u_color');
        gl.uniform4fv(colorLocation, randomColor);
    }

    gl.drawArrays(gl.TRIANGLE_FAN, 0, numSides + 2);
}

function updateRotations() { 
    rotationAngleClockwise -= 0.01; // Atur kecepatan rotasi searah jarum jam
    rotationAngleCounterClockwise -= 0.01; // Atur kecepatan rotasi berlawanan jarum jam
}

function animateTriangles() { 
    gl.clear(gl.COLOR_BUFFER_BIT);
    updateRotations();

    // segitiga kiri atas
    drawTriangle(-0.4, 0.5, rotationAngleCounterClockwise); 

    // segitiga kanan atas
    drawTriangle(0.4, 0.5, rotationAngleClockwise); 

    // segitiga tengah
    drawTriangle(0, -0.02, rotationAngleClockwise * 2); 

    // segitiga bawah
    drawTriangle(0, -0.6, rotationAngleClockwise * 2); 

    requestAnimationFrame(animateTriangles);
}

animateTriangles();