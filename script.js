const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const premioImg = document.querySelector(".premio");
const mensaje = document.getElementById("mensaje");
const inicioAudio = document.getElementById("inicioAudio");

function bloquearScroll() {
  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";
}

function liberarScroll() {
  document.body.style.overflow = "";
  document.body.style.touchAction = "";
}

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

let premiosDisponibles = JSON.parse(localStorage.getItem("premios_10k"));

if (!premiosDisponibles || premiosDisponibles.length === 0) {
  premiosDisponibles = [...premios10kInicial];
  localStorage.setItem("premios_10k", JSON.stringify(premiosDisponibles));
}

// 🎯 Elegir premio UNA VEZ
function elegirPremio() {
  const index = Math.floor(Math.random() * premiosDisponibles.length);
  const premio = premiosDisponibles[index];

  premiosDisponibles.splice(index, 1);
  localStorage.setItem("premios_10k", JSON.stringify(premiosDisponibles));

  return premio;
}

const premioAsignado = elegirPremio();
premioImg.src = premioAsignado.imagen;
premioImg.style.visibility = "hidden";

// ===============================
// 🔓 Desbloqueo de audio (ROBUSTO)
// ===============================
function desbloquearAudio() {
  audioHabilitado = true;
  inicioAudio.style.display = "none";

  sonidoRaspar.play()
    .then(() => {
      sonidoRaspar.pause();
      sonidoRaspar.currentTime = 0;
    })
    .catch(() => {});
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

// Ajustar canvas cuando cargue la imagen
premioImg.onload = () => {
  canvas.width = premioImg.offsetWidth;
  canvas.height = premioImg.offsetHeight;

  if (terminado) return;

  const capa = new Image();
  capa.src = "raspable1.png";
  capa.onload = () => {
    ctx.drawImage(capa, 0, 0, canvas.width, canvas.height);
    premioImg.style.visibility = "visible";
  };
};

// 🎨 Raspar
function raspar(x, y) {
  if (terminado || premioRevelado) return;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.fill();

  puntosRaspado++;

  if (puntosRaspado > 90) {
    revelarPremio();
  }
}

// 🖱️ Mouse
canvas.addEventListener("mousedown", () => {
  if (!audioHabilitado || terminado) return;
  bloquearScroll();
  raspando = true;
  sonidoRaspar.currentTime = 0;
  sonidoRaspar.play();
});

canvas.addEventListener("mouseup", () => {
  raspando = false;
  liberarScroll();
  sonidoRaspar.pause();
  sonidoRaspar.currentTime = 0;
});

canvas.addEventListener("mousemove", e => {
  if (!raspando) return;
  const rect = canvas.getBoundingClientRect();
  raspar(e.clientX - rect.left, e.clientY - rect.top);
});

// 📱 Touch
canvas.addEventListener("touchstart", e => {
  if (!audioHabilitado || terminado) return;
  e.preventDefault();
  bloquearScroll();
  raspando = true;
  sonidoRaspar.currentTime = 0;
  sonidoRaspar.play();
}, { passive: false });

canvas.addEventListener("touchend", () => {
  raspando = false;
  liberarScroll();
  sonidoRaspar.pause();
  sonidoRaspar.currentTime = 0;
});

canvas.addEventListener("touchmove", e => {
  if (!raspando) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  raspar(touch.clientX - rect.left, touch.clientY - rect.top);
});

// 🎉 Revelar premio
function revelarPremio() {
  if (premioRevelado) return;

  premioRevelado = true;
  terminado = true;

  sonidoRaspar.pause();
  sonidoRaspar.currentTime = 0;

  if (audioHabilitado) {
    sonidoGanar.play().catch(() => {});
  }

  localStorage.setItem("raspa_gana_usado", "true");

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 400);
}


