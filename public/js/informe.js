

document.addEventListener("DOMContentLoaded", () => {
  const btnFotos = document.getElementById("btnFotos");
  btnFotos.addEventListener("click", () => abrirModal());
});

//=====Firmas====

const canvas1 = document.getElementById("signature-pad1");
const signaturePad1 = new SignaturePad(canvas1);
const clearButton1 = document.getElementById("clear-button1");
const signatureDataInput1 = document.getElementById("signature-data1");

clearButton1.addEventListener("click", () => signaturePad1.clear());

const canvas2 = document.getElementById("signature-pad2");
const signaturePad2 = new SignaturePad(canvas2);
const clearButton2 = document.getElementById("clear-button2");
const signatureDataInput2 = document.getElementById("signature-data2");

clearButton2.addEventListener("click", () => signaturePad2.clear());




// Function to copy the canvas data to the hidden input field
function copyCanvasToHidden() {
    if (signaturePad1.isEmpty()) {
        alert("Please provide a signature first.");
        return false; // Prevent form submission
    } 
    if (signaturePad2.isEmpty()) {
        alert("Please provide a signature first.");
        return false;
}
    signatureDataInput1.value = signaturePad1.toDataURL("image/png");
    signatureDataInput2.value = signaturePad2.toDataURL("image/png"); // Saves as Base64-encoded PNG image
        return true; // Allow form submission

}


//Tecnicos

async function getTecnicos() {
    const res = await fetch('http://192.168.100.66:8081/usuarios/', 
        {
            method: "GET",
            headers: {"auth": "auth"}
            });
    

   
    
    if(!res.ok){
        const msg = `error en fetchUsuarios:, ${res.status}`;
        throw new Error(msg);
    }

    
    
    res.json()
    .then(data => {
        console.log('data', data);
        usuarios = data.usuarios;
        console.log('lista:', usuarios);

    

        var select = document.getElementById("tecnico");
    
    

        usuarios.forEach((item) =>{
        var option = document.createElement("option");
        option.text = item.userid;
        select.add(option);
       

        });


    

    });

}


getTecnicos();
    



//Validar y cargar datos del formulario
const form = document.getElementById('formulario');
form.addEventListener('submit', async(e) => {
    e.preventDefault();

    if(!form.checkValidity()) {
        form.reportValidity();
        return;  //faltan llenar campos requeridos
    }

    if(!copyCanvasToHidden()) return;
    function obtenerDatos(form) {
        const fd = new FormData(form);
        const obj = Object.fromEntries(fd.entries());

        obj.tecnico = fd.getAll("tecnico");
        return obj;
    }

    const datos = obtenerDatos(form);
    
    console.log("DATOS A ENVIAR:", datos)
});