function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {
    let result = [];

    // If found you qr code
    function onScanSuccess(decodeText, decodeResult) {
        result = + decodeText, decodeResult;
        alert('resultado:', result);
        alert("You Qr is : " + decodeText, decodeResult);
    }

    let htmlscanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbos: 250 }
    );
    htmlscanner.render(onScanSuccess);
});