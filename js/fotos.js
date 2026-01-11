console.log(('JS se ha cargado correctamente.'));
console.log("INIT fotos.js", Date.now());

if (window.__fotosInicializado) {
  console.warn("fotos.js ya estaba inicializado, evitando doble init");
} else {
  window.__fotosInicializado = true;
  
  document.addEventListener("DOMContentLoaded", () => {
    // Arrays (File objects)
    const fotosAntes = [];
    const fotosDespues = [];
    let modoActual = null; // "ANTES" | "DESPUES"

    const btnFotos = document.getElementById("btnFotos");
    const fotoModal   = document.getElementById("fotoModal");
    const btnAntes    = document.getElementById("btnAntes");
    const btnDespues  = document.getElementById("btnDespues");
    const btnCancelar = document.getElementById("btnCancelar");
    const cameraInput = document.getElementById("cameraInput");
    const previewAntes = document.getElementById("previewAntes");
    const previewDespues = document.getElementById("previewDespues");

    if (!btnFotos || !fotoModal || !btnAntes || !btnDespues || !btnCancelar || !cameraInput || !previewAntes || !previewDespues) {
      console.error("Faltan elementos del DOM para fotos. Revisá ids en informe.html");
      return;
    }

  


  function abrirModal() {
    fotoModal.classList.remove("hidden");
  }
  function cerrarModal() {
    fotoModal.classList.add("hidden");
  }

  // --- Preview helpers ---
    function renderPreviews() {
      previewAntes.innerHTML = "";
      fotosAntes.forEach((file, idx) => {
        previewAntes.appendChild(crearThumb(file, "ANTES", idx));
      });

      previewDespues.innerHTML = "";
      fotosDespues.forEach((file, idx) => {
        previewDespues.appendChild(crearThumb(file, "DESPUES", idx));
      });
    }
    function crearThumb(file, tipo, idx) {
      const div = document.createElement("div");
      div.className = "thumb";

      const img = document.createElement("img");
      img.alt = `${tipo} ${idx + 1}`;
      img.src = URL.createObjectURL(file);

      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "X";
      del.addEventListener("click", () => {
        if (tipo === "ANTES") fotosAntes.splice(idx, 1);
        else fotosDespues.splice(idx, 1);
        renderPreviews();
      });

      div.appendChild(img);
      div.appendChild(del);
      return div;
    }


// --- Captura (UNA sola función) ---
    function iniciarCaptura(modo) {
      modoActual = modo;

      // chequeo límite antes de abrir cámara
      if (modoActual === "ANTES" && fotosAntes.length >= 3) {
        alert("Has alcanzado el número máximo de fotos ANTES (3).");
        return;
      }
      if (modoActual === "DESPUES" && fotosDespues.length >= 3) {
        alert("Has alcanzado el número máximo de fotos DESPUÉS (3).");
        return;
      }

      cerrarModal();
      cameraInput.value = ""; // reset
      cameraInput.click();
    }
// --- Eventos botones ---
    btnFotos.addEventListener("click", abrirModal);

    btnCancelar.addEventListener("click", () => {
      modoActual = null;
      cerrarModal();
    });

    btnAntes.addEventListener("click", () => iniciarCaptura("ANTES"));
    btnDespues.addEventListener("click", () => iniciarCaptura("DESPUES"));

    // --- Change (UN solo listener) ---
    cameraInput.addEventListener("change", (e) => {
      console.log("camera change fired");

      const files = e.target.files;
      if (!files || files.length === 0) return;

      // clave para móvil: tomar el ÚLTIMO
      const file = files[files.length - 1];
      if (!file) return;

      if (!file.type || !file.type.startsWith("image/")) {
        alert("El archivo seleccionado no es una imagen.");
        cameraInput.value = "";
        return;
      }

      if (modoActual === "ANTES") {
        fotosAntes.push(file);
      } else if (modoActual === "DESPUES") {
        fotosDespues.push(file);
      } else {
        alert("Primero elige si la foto es ANTES o DESPUÉS.");
        cameraInput.value = "";
        return;
      }

      renderPreviews();
      cameraInput.value = ""; // limpiar
    });

    // Inicial
    renderPreviews();
  });
}

