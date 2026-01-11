


Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
});

document.addEventListener("DOMContentLoaded", () => {
  const raw = sessionStorage.getItem("qr_equipo");
  if (!raw) return;

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    sessionStorage.removeItem("qr_equipo");
    return;
  }

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el && value != null) el.value = value;
  };

  set("cliente", data.cliente);
  set("descripcion", data.descripcion);
  set("marca", data.marca);
  set("modelo", data.modelo);
  set("serie", data.serie);

  // usar una sola vez
  sessionStorage.removeItem("qr_equipo");
});

let usuarios = [];

async function fetchUsuarios(){
   
    const res = await fetch('https://servering-production.up.railway.app/usuarios/tabla', 
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
    
    

        usuarios.forEach((item, index)=>{
        var option = document.createElement("option");
        option.text = item.userid;
        select.add(option);
       

        });


    

    });

}


fetchUsuarios();
    
const wrapper1 = document.getElementById("signature1");
const canvas1 = wrapper1.querySelector("canvas");
    

const wrapper2 = document.getElementById("signature2");
const canvas2 = wrapper2.querySelector("canvas");

//Crear Signatures

const SignaturePad = window.SignaturePad;

const signaturePad1 = new SignaturePad(canvas1);
const signaturePad2 = new SignaturePad(canvas2);

    function resizeCanvas(wrapper, canvas, SignaturePad) {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const rect = wrapper.getBoundingClientRect();
        canvas.width = Math.round(rect.width * ratio);
        canvas.height = Math.round(rect.height * ratio);
        const ctx = canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);

        SignaturePad.clear();
    }

    window.addEventListener("load", () => {
    resizeCanvas(wrapper1, canvas1, signaturePad1);
    resizeCanvas(wrapper2, canvas2, signaturePad2);
});

// 5) (Opcional) si el usuario rota el móvil o cambia tamaño
    window.addEventListener("resize", () => {
    resizeCanvas(wrapper1, canvas1, signaturePad1);
    resizeCanvas(wrapper2, canvas2, signaturePad2);
});

// 6) Botones borrar (si usás onclick en HTML)
    window.signatureClear1 = () => {
    signaturePad1.clear();
    };

    window.signatureClear2 = () => {
    signaturePad2.clear();
    };

    

var formulario = document.getElementById("formulario");

formulario.addEventListener('submit', async (e) => {
    console.log('submit formulario');
    e.preventDefault();

    if(!formulario.checkValidity()){
        formulario.reportValidity();
        return;
    }

    const datos = obtenerDatos(formulario);
    console.log('datos formulario:', datos);

    function obtenerDatos(form) {
        document.getElementById('firma').value = 
        signaturePad1.isEmpty() ? '' : signaturePad1.toDataURL('image/png');
        
        document.getElementById('firmaT').value = 
        signaturePad2.isEmpty() ? '' : signaturePad2.toDataURL('image/png');
        const fd = new FormData(form);
        const obj = Object.fromEntries(fd.entries());
        const tecnico = fd.getAll('tecnico');
        obj.tecnico = tecnico;

        return obj;
    }
    
    
   const res = await fetch(`${API_BASE}/usuarios/informes`, {
        method: "POST",
        body : JSON.stringify(_body),
        headers: {"Content-Type": "application/json"}
    });

    const data = await res.json();
    console.log('respuesta del servidor:', data);

    
    });
       
    

    

    
// Detectar cambios de conexión
/*

function isOnline() {

    if ( navigator.onLine ) {
        // tenemos conexión
        console.log('online');
        alert('Online')


    } else{
        // No tenemos conexión
       alert('Offline')
    }

}

window.addEventListener('online', isOnline );
window.addEventListener('offline', isOnline );

isOnline();

*/

