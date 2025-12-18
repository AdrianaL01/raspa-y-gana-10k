const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const premioImg = document.querySelector(".premio");
const mensaje = document.getElementById("mensaje");
const inicioAudio = document.getElementById("inicioAudio");

// Evitar scroll en móvil
canvas.addEventListener("touchmove", e => {
  e.preventDefault();
}, { passive: false });

// 🔊 Sonidos
const sonidoRaspar = new Audio("scratch.mp3");
sonidoRaspar.loop = true;
sonidoRaspar.volume = 0.4;

const sonidoGanar = new Audio("win.mp3");
sonidoGanar.volume = 0.7;

// Estados
let audioHabilitado = false;
let raspando = false;
let terminado = false;
let puntosRaspado = 0;
let premioRevelado = false;

// ===============================
// 🎟️ PREMIOS BONO 10K (20 TOTAL)
// ===============================
const premios10kInicial = [
  ...Array(6).fill({ nombre: "50%", imagen: "bono50.jpg" }),
  ...Array(14).fill({ nombre: "nada", imagen: "bono00.jpg" })
];

// Cargar premios restantes o inicializar
let premiosDisponibles = JSON.parse(localStorage.getItem("premios_10k"));

if (!premiosDisponibles || premiosDisponibles.length === 0) {
  premiosDisponibles = [...premios10kInicial];
  localStorage.setItem("premios_10k", JSON.stringify(premiosDisponibles));
}

// Elegir premio aleatorio (y eliminarlo)
function elegirPremio10k() {
  const index = Math.floor(Math.random() * premiosDisponibles.length);
  const premioElegido = premiosDisponibles[index];

  premiosDisponibles.splice(index, 1);
  localStorage.setItem("premios_10k", JSON.stringify(premiosDisponibles));

  return premioElegido;
}

// ===============================
// 🔓 Desbloqueo de audio
// ===============================
function desbloquearAudio() {
  if (audioHabilitado) return;

  sonidoRaspar.play().then(() => {
    sonidoRaspar.pause();
    sonidoRaspar.currentTime = 0;
    audioHabilitado = true;
    inicioAudio.style.display = "none";
  }).catch(() => {});
}

inicioAudio.addEventListener("click", desbloquearAudio);
inicioAudio.addEventListener("touchstart", desbloquearAudio);

// Bloqueo si ya se usó
if (localStorage.getItem("raspa_gana_usado")) {
  canvas.style.display = "none";
  mensaje.style.display = "flex";
  mensaje.innerText = "🎟️ Este bono ya fue revelado";
  terminado = true;
}

// Ajustar canvas
premioImg.style.visibility = "hidden";

premioImg.onload = () => {
  canvas.width = premioImg.offsetWidth;
  canvas.height = premioImg.offsetHeight;

  if (terminado) return;

  const capa = new Image();
  capa.src = "raspable1.png";
  capa.onload = () => {
    ctx.drawImage(capa, 0
