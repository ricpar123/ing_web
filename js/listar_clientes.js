

const tbody = document.querySelector("#tablaClientes tbody");
const msg = document.getElementById("msgClientes");
const btnAgregarUsuario = document.getElementById("btnAgregarCliente");

async function cargarClientes() {
  try {
    msg.textContent = "Cargando...";
    tbody.innerHTML = "";

    const res = await fetch(`${API_BASE}/clientes`, {
      method: "GET",
      headers: { auth: "auth" }
    });

    const data = await res.json();
    console.log("Clientes:", data);

    const items = Array.isArray(data) ? data : (data.listaClientes || []);
    console.log("items:", items);

   const activos = items.filter(u => u.status !== "inactivo");
   console.log("activos:", activos);

    if (!activos.length) {
     msg.textContent = "No hay clientes.";
     return;
   }

    msg.textContent = "";

    activos.forEach(cliente => agregarFilaCliente(cliente));
  } catch (error) {
    console.error(error);
    msg.textContent = "Error cargando clientes";
  }
}

function agregarFilaCliente(cliente = {}) {
  const tr = document.createElement("tr");
  tr.dataset.id = cliente._id || "";

  tr.innerHTML = `
    <td><input type="text" class="nombre" value="${cliente.nombre ?? ""}"></td>
    <td><input type="text" class="email1" value="${cliente.email1 ?? ""}"></td>
    <td><input type="text" class="email2" value="${cliente.email2 ?? ""}"></td>
    <td><input type="text" class="email3" value="${cliente.email3 ?? ""}"></td>
    <td><input type="text" class="email4" value="${cliente.email4 ?? ""}"></td>
    
    <td>
      <div class="acciones">
        <button type="button" class="btn-actualizar">Actualizar</button>
        <button type="button" class="btn-borrar">Borrar</button>
      </div>
    </td>
  `;
  const inputs = tr.querySelectorAll("input");
  const visorTexto = document.getElementById("textoCompletoMovil");
  
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      if(!visorTexto) return;
      visorTexto.textContent = input.value || "";
      visorTexto.classList.remove("hidden");
    });
    input.addEventListener("input", () => {
      if(!visorTexto) return;
      visorTexto.textContent = input.value || "";
    });
    input.addEventListener("blur", () => {
      if(!visorTexto) return;
      visorTexto.classList.add("hidden");
    });


  });

  tbody.appendChild(tr);
}

btnAgregarCliente.addEventListener("click", () => {
  agregarFilaCliente();
});

tbody.addEventListener("click", async (e) => {
  const tr = e.target.closest("tr");
  if (!tr) return;

  const id = tr.dataset.id;
  const nombre = tr.querySelector(".nombre").value.trim();
  const email1 = tr.querySelector(".email1").value.trim();
  const email2 = tr.querySelector(".email2").value.trim();
  const email3 = tr.querySelector(".email3").value.trim();
  const email4 = tr.querySelector(".email4").value.trim();
  

  if (e.target.classList.contains("btn-actualizar")) {
    try {
      const payload = {
        nombre,
        email1,
        email2, 
        email3,
        email4,
        status: "activo"
      };

      let res;

      if (id) {
        res = await fetch(`${API_BASE}/clientes/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            auth: "auth"
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE}/clientes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            auth: "auth"
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      console.log("Guardar cliente:", data);

      alert("Cliente guardado correctamente");
      await cargarClientes();

    } catch (error) {
      console.error(error);
      alert("Error guardando cliente");
    }
  }

  if (e.target.classList.contains("btn-borrar")) {
    if (!id) {
      tr.remove();
      return;
    }

    try {
      console.log("id del cliente", id);
      
      const res = await fetch(`${API_BASE}/clientes/${id}/inactivar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          auth: "auth"
        },
        body: JSON.stringify({ id, status: "inactivo" })
      });

      const data = await res.json();
      console.log("Inactivar cliente:", data);

   //   tr.remove();

    } catch (error) {
      console.error(error);
      alert("Error inactivando cliente");
    }
  }
});

document.addEventListener("DOMContentLoaded", cargarClientes);