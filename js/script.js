let estadoLicuadora = "apagado";
let licuadora = document.getElementById("blender");
let sonidoLicuadora = document.getElementById("blender-sound");
let botonLicuadora = document.getElementById("blender-button-sound");
let textoLicuadora = document.querySelector("#blender h1"); // Selecciona el elemento h1 dentro de blender

function encenderLicuadora() {
    if (estadoLicuadora === "apagado") {
        estadoLicuadora = "encendido";
        hacerRuido();
        licuadora.classList.add("active");
        textoLicuadora.textContent = "apagame"; // Cambia el texto a "apagame"
    } else {
        estadoLicuadora = "apagado";
        hacerRuido();
        licuadora.classList.remove("active");
        textoLicuadora.textContent = "prendeme"; // Cambia el texto a "prendeme"
    }
}

function hacerRuido() {
    if (sonidoLicuadora.paused) {
        botonLicuadora.play();
        sonidoLicuadora.play();
    } else {
        botonLicuadora.play();
        sonidoLicuadora.pause();
        sonidoLicuadora.currentTime = 0;
    }
}
