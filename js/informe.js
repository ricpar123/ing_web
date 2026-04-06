

Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
});

function obtenerTecnicosSeleccionados() {
  const select = document.getElementById("tecnicos");

  return Array.from(select.selectedOptions).map(opt => opt.value);
}

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
   
    const res = await fetch(`${API_BASE}/usuarios`, 
        {
            method: "GET",
            
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

        var select = document.getElementById("tecnicos");
            usuarios.forEach((item, index) => {
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

    //cargar firmas antes de guardar
    document.getElementById("firma").value = 
        signaturePad1.isEmpty() ? "" : signaturePad1.toDataURL("image/png");

    document.getElementById("firmaT").value = 
        signaturePad2.isEmpty() ? "" : signaturePad2.toDataURL("image/png");
    
    if(!formulario.checkValidity()){
        console.log("formulario invalido");
        formulario.reportValidity();
        return;
    }
        console.log("formulario válido");

        try {
           console.log("llamando guardarInforme....");
           const data = await guardarInforme();
           console.log("respuesta:", data); 

           if(!data.ok) { alert("No se pudo guaradar el informe"); return;}
            
           const informeId = data.informeId;
           console.log("Informe guardado con Id:", informeId);

           //subir imagenes, si existen
            const dataFotos = await subirImagenesInforme(informeId);
            console.log("Resultado subida de fotos:", dataFotos);
            alert(`Informe ${data.numero} guardado correctamente`);

            //limpiar arrats y previews
            fotosAntes.length = 0;
            fotosDespues.length = 0;
            if(typeof renderPreviews === "function") { renderPreviews();}
        }
        
        
        catch (error) {
            console.error("Error en Submit:", error);
            alert("Error al guardar informe o subir imagenes");
        }

       async function guardarInforme(){
        const payload = {
            cliente: document.getElementById("cliente").value,
            tecnicos: obtenerTecnicosSeleccionados(),
            equipo: document.getElementById("equipo").value,
            marca: document.getElementById("marca").value,
            modelo: document.getElementById("modelo").value,
            serie: document.getElementById("serie").value,
            motivo: document.getElementById("motivo").value,
            tipoTrabajo: document.getElementById("tipoTrabajo").value,
            oferta: document.getElementById("oferta").value,
            presupuesto: document.getElementById("presupuesto").value,
            horaInicio: document.getElementById("horaInicio").value,
            horaFin: document.getElementById("horaFin").value,
            fechaInicio: document.getElementById("inicio").value,
            fechaFin: document.getElementById("fin").value,
            diasT: document.getElementById("diasT").value,
            servicio: document.getElementById("destrabajo").value,
            obs: document.getElementById("obs").value,
            recibido: document.getElementById("recibido").value,
            firma: signaturePad1.isEmpty() ? '' : signaturePad1.toDataURL('image/png'),
            firmaT: signaturePad2.isEmpty() ? '' : signaturePad2.toDataURL('image/png'),
            status: document.getElementById("status").value,
            repuestos: document.getElementById("repuestos").value,
            
        };

        

        const res = await fetch(`${API_BASE}/informes/informe`, {
            method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth": "auth"
                },
            body: JSON.stringify(payload)
        });

        console.log('datos enviados:', JSON.stringify(payload));

        const data = await res.json();
            console.log("Informe guardado:", data);

        return data;
    }

    async function subirUnaImagen(informeId,file, tipo, index) {
        console.log("estoy dentro de subirUnaImagen");
           const formData = new FormData();
                       
            formData.append(tipo, file, `${tipo}_${index + 1}.jpg`);
                      
        console.log("formData:", formData);
            const res = await fetch(`${API_BASE}/informes/informe/${informeId}/imagenes`, {
            method: "POST",
                headers: {
                    "auth": "auth"
                },
            body: formData
        });
        const data = await res.json();
        
        if(!res.ok || !data.ok) {
            throw new Error(data.error || `Error subiendo ${tipo} ${index + 1}`);
        }
        return data;


        } 
        
    async function subirImagenesInforme(informeId) {
        try {
            if(!informeId){ throw new Error("No se recibio informeId");

            }
            if(fotosAntes.length === 0 && fotosDespues.length === 0) {
                console.log("No hay fotos para subir");
                return { ok: true, links: []};
            }
            const resultados = [];

            for (let i = 0 ; i < fotosAntes.length; i++ ) {
                console.log(`Subiendo foto ANTES ${i+1}...` );
                const data = await subirUnaImagen(informeId, fotosAntes[i], "fotoAntes", i);
                console.log("estoy antes de resultados");
                resultados.push(data);
            }

            for (let i = 0 ; i < fotosDespues.length; i++ ) {
                console.log(`Subiendo foto DESPUES ${i+1}...` );
                const data = await subirUnaImagen(informeId, fotosDespues[i], "fotoDespues", i);
                resultados.push(data);
            }

            return {
                ok: true,
                resultados
            };
        }catch (error) {
            console.error("Error en subirImagenesInforme:", error);
            throw error;
        }
    }
    
});
        
    

