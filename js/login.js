//var formulario = document.getElementById("loginForm");


function login() {
    let nombreUsuario = document.getElementById("username").value;
    let claveUsuario = document.getElementById("password").value;
    let rolUsuario = '';
    let statusUsuario = '';

    if(nombreUsuario === '' || claveUsuario === '') {
        alert('Error, los campos deben ser completados');
        return;
    }

    let _body = {userid: nombreUsuario, clave: claveUsuario};

    fetch('http://192.168.100.66:8081/usuarios/log', {
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
          

            if(rolUsuario === 'admin'){
                window.open('./menu.html');
            } else {
                window.open('./cambioScreen.html');
            }
        }

    })
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
       


