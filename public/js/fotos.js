console.log(('JS se ha cargado correctamente.'));
  
  document.addEventListener("DOMContentLoaded", () => {
  const fotoModal   = document.getElementById("fotoModal");
  const btnAntes    = document.getElementById("btnAntes");
  const btnDespues  = document.getElementById("btnDespues");
  const btnCancelar = document.getElementById("btnCancelar");

 

  console.log({ fotoModal, btnAntes, btnDespues, btnCancelar });

  if (!fotoModal || !btnAntes || !btnDespues || !btnCancelar) {
    console.error("Faltan elementos del modal en el DOM. Revisá IDs o duplicados.");
    return;
  }

  window.abrirModal = () => fotoModal.classList.remove("hidden");
  window.cerrarModal = () => fotoModal.classList.add("hidden");

  btnCancelar.addEventListener("click", cerrarModal);
  btnAntes.addEventListener("click", () => alert("Antes"));
  btnDespues.addEventListener("click", () => alert("Después"));
});


// Arrays pedidos (File objects)
  const fotosAntes = [];    // 0..2
  const fotosDespues = [];  // 0..2

  let modoActual = null; // "ANTES" | "DESPUES"

  // UI refs
  const btnFotos = document.getElementById("btnFotos");
  /*
  const fotoModal = document.getElementById("fotoModal");
  
  const btnAntes = document.getElementById("btnAntes");
  const btnDespues = document.getElementById("btnDespues");
  const btnCancelar = document.getElementById("btnCancelar");
  */
  const cameraInput = document.getElementById("cameraInput");

  const previewAntes = document.getElementById("previewAntes");
  const previewDespues = document.getElementById("previewDespues");

  // --- Modal helpers ---
  function abrirModal() { fotoModal.classList.remove("hidden") }
  function cerrarModal() { fotoModal.classList.add("hidden") }

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
    img.alt = `${tipo} ${idx}`;
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

  // --- Lógica principal ---
  //btnFotos.addEventListener("click", () => abrirModal());

  
  btnAntes.addEventListener("click", () => iniciarCaptura("ANTES"));
  btnDespues.addEventListener("click", () => iniciarCaptura("DESPUES"));
  btnCancelar.addEventListener("click", () => { cerrarModal() });

  function iniciarCaptura(modo) {
    modoActual = modo;

    // Chequeo de límite ANTES de abrir cámara
    if (modoActual === "ANTES" && fotosAntes.length >= 3) {
      alert("Has alcanzado el número máximo de fotos ANTES (3).");
      return;
    }
    if (modoActual === "DESPUES" && fotosDespues.length >= 3) {
      alert("Has alcanzado el número máximo de fotos DESPUÉS (3).");
      return;
    }

    cerrarModal();

    // Reset para que si sacan la misma foto/archivo vuelva a disparar change
    cameraInput.value = "";
    cameraInput.click();
  }

  cameraInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación básica
    if (!file.type.startsWith("image/")) {
      alert("El archivo seleccionado no es una imagen.");
      return;
    }

    if (modoActual === "ANTES") {
      if (fotosAntes.length >= 3) {
        alert("Has alcanzado el número máximo de fotos ANTES (3).");
        return;
      }
      // Renombrado lógico (no cambia el nombre real del File en todos los navegadores)
      // Guardamos el File y el índice determina fotosAntes[i]
      fotosAntes.push(file);

    } else if (modoActual === "DESPUES") {
      if (fotosDespues.length >= 3) {
        alert("Has alcanzado el número máximo de fotos DESPUÉS (3).");
        return;
      }
      fotosDespues.push(file);

    } else {
      // Si por algún motivo no hay modo
      alert("Primero elige si la foto es ANTES o DESPUÉS.");
      return;
    }

    // Actualiza UI
    renderPreviews();
  });

  // Inicial
  renderPreviews();

  // --- TIP para tu botón ENVIAR ---
  // Cuando vayas a enviar a Express, usa FormData y adjunta así:
  // fotosAntes.forEach((f, i) => formData.append(`fotosAntes[${i}]`, f, `fotosAntes[${i}].jpg`));
  // fotosDespues.forEach((f, i) => formData.append(`fotosDespues[${i}]`, f, `fotosDespues[${i}].jpg`));

