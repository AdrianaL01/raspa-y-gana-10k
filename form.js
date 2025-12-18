const form = document.getElementById("formCodigo");
const nombreInput = document.getElementById("nombre");
const codigoInput = document.getElementById("codigo");
const error = document.getElementById("error");

// Lista de códigos válidos (10K)
let codigos10k = [
  "10K-A7F3","10K-B92Q","10K-LM8X","10K-Q3RZ","10K-W4P7",
  "10K-X9V2","10K-T5J8","10K-KL3P","10K-Z7N1","10K-V8M4",
  "10K-R6C9","10K-F2B5","10K-P3D8","10K-N9H1","10K-S4Q6",
  "10K-J8K2","10K-M5L7","10K-H2G9","10K-D7T3","10K-C9R6"
];

// Si quieres, puedes guardar en localStorage para bloquear reingresos
let codigosUsados = JSON.parse(localStorage.getItem("codigosUsados")) || [];

form.addEventListener("submit", e => {
  e.preventDefault();
  const nombre = nombreInput.value.trim();
  const codigo = codigoInput.value.trim().toUpperCase();

  // Validaciones
  if (!nombre || !codigo) {
    error.textContent = "Completa ambos campos";
    return;
  }

  if (!codigos10k.includes(codigo)) {
    error.textContent = "Código inválido";
    return;
  }

  if (codigosUsados.includes(codigo)) {
    error.textContent = "Este código ya fue usado";
    return;
  }

  // ✅ Código válido
  codigosUsados.push(codigo);
  localStorage.setItem("codigosUsados", JSON.stringify(codigosUsados));

  // Guardar nombre también si quieres
  localStorage.setItem("nombreUsuario", nombre);

  // Redirigir a raspa-10k.html
  window.location.href = "raspa-10k.html";
});
