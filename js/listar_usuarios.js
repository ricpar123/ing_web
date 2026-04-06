

const tbody = document.querySelector("#tablaUsuarios tbody");
const msg = document.getElementById("msgUsuarios");
const btnAgregarUsuario = document.getElementById("btnAgregarUsuario");

async function cargarUsuarios() {
  try {
    msg.textContent = "Cargando...";
    tbody.innerHTML = "";

    const res = await fetch(`${API_BASE}/usuarios/tabla`, {
      method: "GET",
      headers: { auth: "auth" }
    });

    const data = await res.json();
    console.log("Usuarios:", data);

    const items = Array.isArray(data) ? data : (data.usuarios || []);

   const activos = items.filter(u => u.status !== "inactivo");

    if (!activos.length) {
     msg.textContent = "No hay usuarios.";
     return;
   }

    msg.textContent = "";

    activos.forEach(usuario => agregarFilaUsuario(usuario));
  } catch (error) {
    console.error(error);
    msg.textContent = "Error cargando usuarios";
  }
}

function agregarFilaUsuario(usuario = {}) {
  const tr = document.createElement("tr");
  tr.dataset.id = usuario._id || "";

  tr.innerHTML = `
    <td><input type="text" class="nombre" value="${usuario.userid?.[0] ?? ""}"></td>
    <td><input type="text" class="clave" value="${usuario.clave ?? ""}"></td>
    <td>
      <select class="rol">
        <option value="user" ${usuario.rol === "usuario" ? "selected" : ""}>user</option>
        <option value="admin" ${usuario.rol === "admin" ? "selected" : ""}>admin</option>
      </select>
    </td>
    <td>
      <div class="acciones">
        <button type="button" class="btn-actualizar">Actualizar</button>
        <button type="button" class="btn-borrar">Borrar</button>
      </div>
    </td>
  `;

  tbody.appendChild(tr);
}

btnAgregarUsuario.addEventListener("click", () => {
  agregarFilaUsuario();
});

tbody.addEventListener("click", async (e) => {
  const tr = e.target.closest("tr");
  if (!tr) return;

  const id = tr.dataset.id;
  const userid = tr.querySelector(".nombre").value.trim();
  const clave = tr.querySelector(".clave").value.trim();
  const rol = tr.querySelector(".rol").value;

  if (e.target.classList.contains("btn-actualizar")) {
    try {
      const payload = {
        userid,
        clave,
        rol,
        status: "activo"
      };

      let res;

      if (id) {
        res = await fetch(`${API_BASE}/usuarios/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            auth: "auth"
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE}/usuarios/reg`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            auth: "auth"
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      console.log("Guardar usuario:", data);

      alert("Usuario guardado correctamente");
      await cargarUsuarios();

    } catch (error) {
      console.error(error);
      alert("Error guardando usuario");
    }
  }

  if (e.target.classList.contains("btn-borrar")) {
    if (!id) {
      tr.remove();
      return;
    }

    try {
      console.log("id del usuario", id);
      
      const res = await fetch(`${API_BASE}/usuarios/${id}/inactivar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          auth: "auth"
        },
        body: JSON.stringify({ id, status: "inactivo" })
      });

      const data = await res.json();
      console.log("Inactivar usuario:", data);

   //   tr.remove();

    } catch (error) {
      console.error(error);
      alert("Error borrando usuario");
    }
  }
});

document.addEventListener("DOMContentLoaded", cargarUsuarios);