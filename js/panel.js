document.addEventListener("DOMContentLoaded", () => {

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    if(!usuario){
        window.location.href = "/index.html";
        return;
    }

    document.getElementById("usuarioNombre").textContent = usuario.nombre;
    document.getElementById("usuarioRol").textContent = usuario.rol;

});
function nuevoInforme() {
    window.location.href = "../vistas/informe.html";
}

function listarInformes() {
    window.location.href = "../vistas/listarInformes.html";
}

function listarUsuarios() {
    window.location.href = "../vistas/listar_usuarios.html";
}

function listarClientes() {
    window.location.href = "../vistas/listar_clientes.html";
}

function nuevoCertificado() {
    window.location.href = "../vistas/elaborarCertificado.html";
}

function listarCertificados() {
    window.location.href = "../vistas/listarCertificados.html";
}

function logout(){

    sessionStorage.removeItem("usuario");

    window.location.href = "/index.html";
}