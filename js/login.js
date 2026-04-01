//var formulario = document.getElementById("loginForm");


function login() {
    let nombreUsuario = document.getElementById("userid").value;
    let claveUsuario = document.getElementById("clave").value;
    let rolUsuario = '';
    let statusUsuario = '';

    if(nombreUsuario === '' || claveUsuario === '') {
        alert('Error, los campos deben ser completados');
        return;
    }

    let _body = {userid: nombreUsuario, clave: claveUsuario};
    console.log("nombre clave", nombreUsuario, claveUsuario);


    fetch(`${API_BASE}/usuarios/log`, 
 {
        method: "POST",
        body: JSON.stringify(_body),
        headers: {"Content-Type": "application/json"}
    })
    .then(response => response.json())
    .then ((data) => {
        if(data.ok === false){
            alert('Clave o nombre incorrectos o usuario inactivo - consulte al administrador');
            return;
        } else {
            rolUsuario = data.usuario.rol;
            nombreUsuario = data.usuario.userid[0];
            console.log("rol nombre", rolUsuario, nombreUsuario);

            sessionStorage.setItem("usuario", JSON.stringify({
                nombre: nombreUsuario,
                rol: rolUsuario
            }));
          

            if(rolUsuario === 'admin'){
                window.open('/vistas/menu.html');
            } else {
                window.open('/vistas/cambioScreen.html');
            }
            
        }

    })
    .catch(err => {
        console.log('Error en Login', err);
        alert("Error de conexion o respuesta invalida del servidor");
    });
}









/*
let nombreUsuario = '';
let claveUsuario = '';
let rolUsuario = '';

function validar(e) {
        var nombre = document.getElementById("username"),
            clave = document.getElementById("password");
            
        
    if(nombre.value == 0 || clave.value == 0){
            e.preventDefault();
            alert("Error, los campos deben ser completados");
        } else {
            e.preventDefault();
           console.log('nombre, clave: del formulario', nombre.value, clave.value);
           nombreUsuario = nombre.value;
           claveUsuario = (clave.value).toString();

          
            let _body = {userid: nombreUsuario, clave: claveUsuario};
           console.log('body ', _body);

           fetch('http://localhost:8081/usuarios/log', {
                method: "POST",
                body: JSON.stringify(_body),
                headers: {"Content-Type": "application/json"}
            })
            .then(response => response.json())
            .then ((data) => {
                if(data.ok === false){
                    alert('Clave o nombre incorrectos - consulte al administrador');
                    return;
            
                }else {
                    console.log('fetch exitoso');
                    //rolUsuario = data.usuario.rol;
                    console.log('usuario: ', data.usuario);
                    rolUsuario = data.usuario.rol;
                    console.log('Rol: ', rolUsuario);

                    

                    if(rolUsuario == 'admin'){
                        window.open('./menu.html');
                    }else{
                        window.open('./cambioScreen.html');
                    }
                        
                }
                
                   

                
            })
            .catch(function(error) {
                console.log('Failed', error);
            });



        }

}
*/
       


