//variables
let tareas = [];
let tabla = document.getElementById("tabla");
let tbody = document.getElementById("cuerpo");
let fondo = document.getElementById("fondo");
let modal = document.getElementById("modal");

// functions

async function fetchURL(url, data = {}) {
    let response = await fetch(url, data);
    return await response.json();
}

const obtenerDiaActual = () => {

    const fechaActual = new Date();


    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const año = fechaActual.getFullYear();

    return año + "-" + mes + "-" + dia;

};

function reverseCadena(cadena) {
    let caracteres = cadena.split("-");
    let caracteresInvertidos = caracteres.reverse();
    let cadenaInvertida = caracteresInvertidos.join("-");
    return cadenaInvertida;
}

const mostrarTareas = async () => {
    fetchURL('http://www.alpati.net/DWEC/api/get_user_tasks/8', { "method": "GET" })
        .then(function (respuesta) {
            tbody.innerHTML = "";
            respuesta.forEach(tarea => {
                let fila = document.createElement("tr");
                fila.innerHTML = "<td>" + tarea.task_name + "</td>";
                fila.innerHTML += "<td>" + tarea.task_estimated_time + "</td>";
                fila.innerHTML += "<td>" + tarea.task_deadline + "</td>";
                fila.innerHTML += "<td>" + tarea.task_created + "</td>";
                fila.innerHTML += "<td>" + tarea.task_status + "</td>";
                fila.innerHTML += "<td><button class='btn btn-outline-primary' onclick=\"abrirmodal('" + tarea.task_id + "')\">Modify</td>";
                fila.innerHTML += "<td><button onclick=\"borrarTarea('" + tarea.task_id + "')\" class='btn btn-outline-danger'>Delete</td>";

                tbody.appendChild(fila);
                tabla.appendChild(tbody);
            });
        });
};
const guardarTarea = async () => {

    let nombre = document.getElementById("nombre").value;
    let estimado = document.getElementById("estimado").value;
    let finalizacion = document.getElementById("finalizacion").value;
    let alta = obtenerDiaActual();

    const selectElemento = document.getElementById('select');
    let option = selectElemento.options[selectElemento.selectedIndex].text;


    let tarea = {
        "task_owner": "8",
        "task_name": nombre,
        "task_description": "...",
        "task_status": option,
        "task_estimated_time": estimado,
        "task_deadline": finalizacion,
        "task_created": alta
    };


    tareas = fetchURL('http://www.alpati.net/DWEC/api/create_task', {
        "method": "POST",
        "body": JSON.stringify(tarea)
    });

};

const borrarTarea = async (id) => {
    try {
        await fetchURL('http://www.alpati.net/DWEC/api/delete_task/' + id, {
            method: "DELETE"
        });
        await mostrarTareas();
        console.log("click");
    } catch (error) {
        console.error("Error al borrar tarea:", error);
    }

};

const abrirmodal = async (id) => {

    fondo.style.display = "block";
    modal.style.display = "block";
    document.getElementById("container").style.filter = "blur(0.5em)";

    let nombre = document.getElementById("modal_nombre");
    let estimado = document.getElementById("modal_estimado");
    let finalizado = document.getElementById("modal_finalizacion");
    let creado = "";
    let select = document.getElementById("modal_select");
    let option = select.options[select.selectedIndex].text;
    let botonModificar = document.getElementById("boton-modificar");

    await fetchURL('http://www.alpati.net/DWEC/api/get_task/' + id, { "method": "GET" })
    .then(function(respuesta){
            nombre.value = respuesta[0].task_name;
            estimado.value = respuesta[0].task_estimated_time;
            finalizado.value = respuesta[0].task_deadline;
            option = respuesta[0].task_status;
            creado = respuesta[0].task_created;
            botonModificar.onclick = () => modificarTarea(respuesta[0].task_id,creado);
    });

}; 

document.addEventListener("DOMContentLoaded", function () {
    mostrarTareas();
});


document.getElementById("formulario").addEventListener('submit', function (event) {
    event.preventDefault();
    guardarTarea();
    mostrarTareas();
});

fondo.addEventListener("click",function(event){
    fondo.style.display = "none";
    modal.style.display = "none";
    document.getElementById("container").style.filter = "none";
    event.stopPropagation();
});

const modificarTarea = async (id,fecha) => {
        console.log("modificar tarea");

        let nombre = document.getElementById("modal_nombre").value;
        let estimado = document.getElementById("modal_estimado").value;
        let finalizado = document.getElementById("modal_finalizacion").value;
        let select = document.getElementById("modal_select");
        let option = select.options[select.selectedIndex].text;
        console.log(nombre, estimado, finalizado,option, id, fecha)
        
        let tarea = {
            "task_name": document.getElementById("modal_nombre").value,
            "task_description": "...",
            "task_status": option,
            "task_estimated_time": document.getElementById("modal_estimado").value,
            "task_deadline": finalizado = document.getElementById("modal_finalizacion").value,
            "task_created": fecha
        };

        let respuesta = await fetch('http://www.alpati.net/DWEC/api/update_task/' + id, {
            method : "PUT",
            headers: {
                "accept" : "application/json",
                "accept-encoding": "gzip, deflate",
                "accept-language": "en-US,en;q=0.8",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,like Gecko) Chrome/108.0.0.0 Safari/537.36"
            },
            body: JSON.stringify(tarea)
        });
        
        console.log(respuesta);

            fondo.style.display = "none";
            modal.style.display = "none";
            document.getElementById("container").style.filter = "none";
            mostrarTareas();



};



