var tareas =  [];

function reverseCadena(cadena){
    let caracteres = cadena.split("-");
    let caracteresInvertidos = caracteres.reverse();
    let cadenaInvertida = caracteresInvertidos.join("-");
    return cadenaInvertida;
}

function horasMinutos(valor){
    //horas
    let horas = Math.floor(valor/60);

    //minutos retantes
    let minutosRestantes = valor%60;
    let array = [horas,minutosRestantes];
    return array;

}

function cadenaEstimado(array){
    return array[0] + "h " + array[1] + "min";
}






document.getElementById("formulario").addEventListener('submit',function(event){
    event.preventDefault();
    let nombre = document.getElementById("nombre").value;
    let estimado = document.getElementById("estimado").value;
    let finalizacion = document.getElementById("finalizacion").value;
    let finalizacionInvert = reverseCadena(finalizacion);
    let alta = document.getElementById("alta").value;
    let altaInvert = reverseCadena(alta);
    let selectElemento = document.getElementById("select");
    let option = selectElemento.options[selectElemento.selectedIndex].text;

    const nuevaTarea = {
        nombre: nombre,
        estimado: estimado,
        finalizacion: finalizacionInvert,
        alta: altaInvert,
        option: option
    };
    tareas.push(nuevaTarea);

    mostrarTarea(nuevaTarea);
    
});

function mostrarTarea(tarea){
    const copiaTarea = {...tarea};
    copiaTarea.option.id = "opcion";

    const contTabla = document.createElement("div");
    contTabla.className = "contTabla";
    const tabla = document.querySelector("table");

    const fila = tabla.insertRow();
    fila.classList.add("nueva-fila");

    let array = horasMinutos(copiaTarea.estimado);
    let mostrarEstimado = cadenaEstimado(array);
    copiaTarea.estimado = mostrarEstimado;
    for(let valor in tarea){
        const celda = fila.insertCell();
        celda.textContent = copiaTarea[valor];
    }
    const celdaMod = fila.insertCell()
    const modificar = document.createElement("button");
    modificar.textContent = "Modificar";
    modificar.classList.add("boton-modificar");
    celdaMod.appendChild(modificar);

    const celdaBorrar = fila.insertCell();
    const borrar = document.createElement("button");
    borrar.textContent = "Borrar";
    borrar.classList.add("boton-borrar");
    celdaBorrar.appendChild(borrar);

    borrar.addEventListener("click", function() {
        const rowIndex = fila.rowIndex;
        tabla.deleteRow(rowIndex);
        tareas.splice(rowIndex - 1, 1);
    });
}

function mostrarOrdenado(){
    const tabla = document.querySelector("table");
    tabla.innerHTML = '<thead class="cabecera"><tr><th>Nombre</th><th>Tiempo estimado</th><th>Fecha máx. finalización</th><th>Fecha de alta</th><th>Estado</th><th>Modificar</th><th>Borrar</th></tr></thead>';
    for(let i=0;i<tareas.length;i++){
        mostrarTarea(tareas[i]);
    }
}


function ordenarFecha(cadena){
    tareas.sort(function(a,b){
        if(cadena == "desc"){
            var tiempoA = a.finalizacion.split("-");
            var tiempoB = b.finalizacion.split("-");
            if(tiempoA[2] !== tiempoB[2]){
                return tiempoB[2]-tiempoA[2];
            }
            if(tiempoA[1] !== tiempoB[1]){
                return tiempoB[1]-tiempoA[1];
            }

            return tiempoB[0]-tiempoA[0];
        }
        if(cadena== "asc"){
            var tiempoA = a.finalizacion.split("-");
            var tiempoB = b.finalizacion.split("-");
            if(tiempoA[2] !== tiempoB[2]){
                return tiempoA[2]-tiempoB[2];
            }
            if(tiempoA[1] !== tiempoB[1]){
                return tiempoA[1]-tiempoB[1];
            }

            return tiempoA[0]-tiempoB[0];
        }
    });

}

document.getElementById("estimadoASC").onclick = function(){
    tareas.sort(((a, b) => parseFloat(a.estimado) - parseFloat(b.estimado)));
    mostrarOrdenado();
    
};

document.getElementById("estimadoDESC").onclick = function(){
    tareas.sort(((a, b) => parseFloat(b.estimado) - parseFloat(a.estimado)));
    mostrarOrdenado();
    
};

document.getElementById("finalizacionDESC").onclick = function (){
    let tipo = "desc"; 
    ordenarFecha(tipo);
    mostrarOrdenado();
}

document.getElementById("finalizacionASC").onclick = function (){
    let tipo = "asc";
    ordenarFecha(tipo);
    mostrarOrdenado();
}

  





