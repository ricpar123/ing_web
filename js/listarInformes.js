console.log("listar_infome ya cargado");



    async function cargarListaInformes() {
        const tbody = document.querySelector("#tablaInformes tbody");
        const msg = document.getElementById("msgLista");

        tbody.innerHTML = "";
        msg.textContent = "Cargando...";

        function formatearFechaISO(fechaISO) {
            if (!fechaISO) return "";
                const [anio, mes, dia] = fechaISO.split("-");
                    return `${dia}/${mes}/${anio}`;
        }

        try {
            const resp = await fetch(`${API_BASE}/informes`, {
                method: "GET",
                headers: { "auth": "auth"}
            });
            const data = await resp.json();
            console.log("Listado de informes:", data);

            if( !data.ok && !Array.isArray(data)){
                throw new Error(data.error || "Error listando informes");
            }
            // Si el backend devuelve array directo
            const items = data.informes
            console.log('items', items);
            if(!items.length){
                msg.textContent = "No hay informes guardados.";
                return;
            }
            msg.textContent = "";

            items.forEach((inf) => {
                const tr = document.createElement("tr");

                const fecha = inf.fechaFin
                    ? formatearFechaISO(inf.fechaFin)
                    : "";
                    console.log("fechaInforme:", fecha);
                    
                tr.innerHTML = `
                    <td>${inf.cliente ?? ""}</td>
                    <td>${inf.numero ?? ""}</td>
                    <td>${fecha ?? ""}</td>
                    <td>
                        <button type="button" class="btnVerPdf" data-id="${inf._id}">
                            Ver PDF
                        </button>
                    </td>
                `;

                tbody.appendChild(tr);
            });

            tbody.addEventListener("click", async (e) => {
            const btn = e.target.closest(".btnVerPdf");
                if (!btn) return;

                const id = btn.dataset.id;
                console.log("ID informe:", id);

            try {
                const resp = await fetch(`${API_BASE}/informes/${id}`, {
                    method: "GET",
                    headers: {"auth" : "auth"}
                });
                const data = await resp.json();
                console.log("Informe por const informe = data.informe ? data.informe : data; ID:", data);

                if (!data.ok && !data._id && !data.informe) {
                    alert(data.error || "No se pudo cargar el informe");
                    return;
                }

                const informe = data.informe ? data.informe : data;

                sessionStorage.setItem("informe_pdf", JSON.stringify(data.informe));
                window.open("./pdf_informe.html", "_blank");

            } catch (error) {
                    console.error(error);
                    alert("Error al obtener el informe");
                }
            });

        } catch (error) {
                console.error(error);
                msg.textContent = "Error: " + error.message;
            }
    }

        document.addEventListener("DOMContentLoaded", cargarListaInformes);

        



































/*
var informes = [];
var clientes = [];
var columnas = ["cliente", "numero", "fecha", "Opciones"];
var cliente = '';
var is = [];

async function fetchClientes() {

    const res = await fetch('https://servering-production.up.railway.app/clientes', 
        {
            method: "GET",
            headers: { "auth": "auth" }
            
        });
           
    
    if (!res.ok) {
        const msg = `error en fetchClientes:, ${res.status}`;
        throw new Error(msg);
    } else {
            res.json()
            .then(data => {
                console.log('data', data);
                clientes = data.listaClientes;
                console.log('lista:', clientes);
                var select = document.getElementById("clientes");

                var opt = document.createElement("option");
                opt.text = "Seleccione un cliente";
                select.add(opt);

                console.log('lista de clientes:', clientes);

                clientes.forEach((item, index) => {
                    var option = document.createElement("option");
                    option.text = item.nombre;
                    select.add(option);
                });

                select.addEventListener("change", (e) => {

                    cliente = e.target.value;

                    if (!(cliente.localeCompare('Seleccione un cliente'))) {
                        cliente = '';
                    }

                    console.log('seleccionado: ', cliente);
                });

            });
        }
}
fetchClientes()
    .catch(e => {
        console.log('hubo un problema' + e.message);
    });


    var formulario = document.getElementById("form");


/*
function validar(e) {
    e.preventDefault();

    var inicio = document.getElementById("inicio").value;
    var fin = document.getElementById("fin").value;

    if (inicio == 0 && fin == 0 && cliente == 0) {
        alert('los campos deben tener valores')
        return;


    } else if (inicio == 0 && fin == 0 && cliente != 0) {
        inicio = 'undefined';
        fin = 'undefined';

    } else if (cliente == 0 && fin != 0 && inicio != 0) {
        cliente = 'undefined';
    }

    fetch(`'https://servering-production.up.railway.app/informes/inicio/${inicio}/fin/${fin}/cliente/${cliente}`)
        
        .then(response => response.json())
        .then(data => {
            informes = data.informes;
            console.log('Success:', data.informes)
            is = data.informes;
            document.getElementById("data-list").innerHTML = "";
            tabla(is);

        })
        .catch((error) => {
            console.error('Error:', error);
        })
}

formulario.addEventListener('submit', validar);

async function fetchInformes() {

    const res = fetch('https://servering-production.up.railway.app/informes', {
        method: "GET",
        headers: { "auth": "auth" }
    })
        .then(response => response.json())
        .then(data => {
            is = data.informes;
            console.log('is: ', is);
            tabla(is);
        });

}

fetchInformes()
    .catch(e => {
        console.log('hubo un problema' + e.message);

    });


function tabla(is) {
    var columnCount = columnas.length;
    console.log('cantidad columnas', columnCount);
    var rowCount = is.length;
    console.log('cantidad filas', rowCount);

    var table = document.createElement('table');

    document.getElementById("data-list").appendChild(table);

    var header = table.createTHead();

    var row = header.insertRow(-1);

    for (var i = 0; i < columnCount; i++) {

        var headerCell = document.createElement('th');

        headerCell.innerText = columnas[i].toUpperCase();

        row.appendChild(headerCell);
    }
    var tBody = document.createElement('tbody');

    table.appendChild(tBody);


    is.forEach((item, index) => {


        let row = table.insertRow();
        let id = item._id;
        let name = row.insertCell(0);

        name.innerHTML = `<input type = "text" id = "name[${index}]" size = '30' readonly value = ${item.cliente}></input>`;
        let numero = row.insertCell(1);
        numero.innerHTML = `<input type = "text" id = "numero[${index}]" size = '5' readonly value = ${item.numero}></input>`;
        let fecha = row.insertCell(2);
        fecha.innerHTML = `<input type = "text" id = "fecha[${index}]" size = '30' readonly value = ${item.fecha.substr(0, 10)}></input>`;
        let op = row.insertCell(3);
        op.innerHTML = `<a  onClick= "detalles(${index})"><i class= "fa fa-id-badge"></i><span>detalles</span></a><a onClick="Borrar(${index})"><i class="fas fa-trash-alt"></i><span>Borrar</span></a>`


    });

    is.forEach((item, index) => {

        document.getElementById(`name[${index}]`).value =
            document.getElementById(`name[${index}]`).defaultValue = item.cliente;

        let date = document.getElementById(`fecha[${index}]`).value;
        const fd = date.slice(0, 4);
        const md = date.slice(5, 7);
        const ld = date.slice(8, 10);
        date = `${ld}` + '-' + `${md}` + '-' + `${fd}`;

        document.getElementById(`fecha[${index}]`).value =
            document.getElementById(`fecha[${index}]`).defaultValue = date;

    });
}

*/