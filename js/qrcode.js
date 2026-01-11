/* global Html5QrcodeScanner */

function parseQR(texto) {
  const partes = texto
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  if (partes.length < 5) {
    throw new Error("QR inválido: deben ser 5 líneas");
  }

  return {
    cliente: partes[0],
    descripcion: partes[1],
    marca: partes[2],
    modelo: partes[3],
    serie: partes[4],
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const onScanSuccess = (decodedText) => {
    console.log("✅ QR LEÍDO:", decodedText);

    let data;
    try {
      data = parseQR(decodedText);
    } catch (e) {
      alert(e.message);
      return;
    }

    sessionStorage.setItem("qr_equipo", JSON.stringify(data));

    scanner.clear().then(() => {
      window.location.href = "/vistas/informe.html";
    });
  };

  const scanner = new Html5QrcodeScanner(
    "reader",
    {
      fps: 10,
      qrbox: { width: 300, height: 300 }, // 🔴 CLAVE
      rememberLastUsedCamera: true,
    },
    false
  );

  scanner.render(onScanSuccess);
});
