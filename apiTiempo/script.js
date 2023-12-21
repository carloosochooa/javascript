async function fetchURL(url,data = {}){
    return await fetch(url,data).then(response => response.json());
}

function mostrarAutocompletar(options){
    lista.innerHTML = "";
    options.forEach(option =>{
        const listItem = document.createElement("li");
        listItem.textContent = option;
        listItem.addEventListener("click",function(){
            input.value = option;
            lista.innerHTML = "";
        });
        lista.appendChild(listItem)
    });
}

document.addEventListener("click", function(event){
    if(event.target !== input && event.target !== lista){
        lista.innerHTML = "";
    }
});

let obtenerHoraISO = (horaISO) => horaISO.slice(11,13);
let latitud = "";
let longitud = "";
const horario = new Date();
const hora = horario.getHours();
const minutos = horario.getMinutes();
const url = "http://www.alpati.net/DWEC/cities/";
const resultado = document.createElement("div");
resultado.className = "resultado"; 
const select = document.getElementById("ciudad");




let input = document.getElementById("autocomplete-input");
let lista = document.getElementById("autocomplete-list");



opcionInicial.value = "";
opcionInicial.innerHTML = "Seleccione una ciudad";
select.appendChild(opcionInicial);

fetchURL(url, {"method": "GET"})

.then(resolve => {
    const ciudadesEspaña = resolve.filter(elemento =>{
        return elemento[5] === "ES";
    });

    ciudadesEspaña.sort((a,b) => {
        const ciudadA = a[1].toLowerCase();
        const ciudadB = b[1].toLowerCase();
    
        if(ciudadA < ciudadB){
            return -1;
        }
        if(ciudadA > ciudadB){
            return 1;
        }
        return 0;
    });

    
    ciudadesEspaña.forEach(ciudad => {
        latitud = ciudad[3];
        longitud = ciudad[4];
        let option = document.createElement("option");
        option.value = ciudad[1];
        option.innerHTML = ciudad[1];
        option.id = "opcion";
        select.appendChild(option);

    });

    input.addEventListener("input",function(){
        const inputValor = input.value.toLowerCase();
        const opcionesFiltrados = ciudadesEspaña.filter(opcion => opcion.toLowerCase().includes(inputValor));
        mostrarAutocompletar(opcionesFiltrados);
    });

    select.addEventListener("change",function(){
        resultado.innerHTML = "";

    
        const opcionSeleccionada = select.options[select.selectedIndex].value;
        const ciudadSeleccionada = ciudadesEspaña.find(ciudad => ciudad[1] === opcionSeleccionada);

        latitud = ciudadSeleccionada[3];
        longitud = ciudadSeleccionada[4];

        let horarioNuevo = new Date();
        let horaNueva = horarioNuevo.getHours();
        let minutosNuevos = horarioNuevo.getMinutes();
        let fecha = `${horaNueva} : ${minutosNuevos}`;

        const mensaje = document.createElement("p");
        mensaje.className = "ciudad"
        mensaje.innerHTML = opcionSeleccionada;

        //peticion a la url de open-meteo

        fetchURL(`https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=temperature_2m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min`,{"method":"GET"})
        .then(function(resolve){

            const temperaturaActual = document.createElement("p");
            temperaturaActual.className = "grados";
            temperaturaActual.innerHTML = Math.round(resolve.current.temperature_2m) + "°C";

            let encabezado = document.createElement("div");
            encabezado.className = "encabezado";

            let maxima = document.createElement("p");
            maxima.className = "maxima";
            let minima = document.createElement("p");
            minima.className = "minima";
            maxima.innerHTML = "<b>Máxima:</b> " + resolve.daily.temperature_2m_max[0] + "°C |";
            minima.innerHTML = "<b>Mínima:</b> " + resolve.daily.temperature_2m_min[0] + "°C";

            //TODO resumen semanal com maxiam minimas y precipitaciones, resumen de horas con lo mismo y graficas, a parte de poner 
            const temperaturaPorHoras = document.createElement("div");
            temperaturaPorHoras.className = "tempPorHoras";
            const horasMostrar = 10;

            let valorSecuencia = "";
            resolve.hourly.time.slice(0, horasMostrar).forEach((horaa, index) => {
                let temperaturaHora = document.createElement("p");
                temperaturaHora.className = "temperaturaHora";
                let horaSecuencia = document.createElement("p");
                horaSecuencia.className = "horaSecuencia";
                //Quiero mostrar la cantidad de 10 temperaturas
                temperaturaHora.innerHTML = Math.round(resolve.hourly.temperature_2m[index]) + "°C";
                
                valorSecuencia = obtenerHoraISO(horaa);
                horaSecuencia.innerHTML = (valorSecuencia[0] == "0") ? valorSecuencia.slice(1) : valorSecuencia;

                const contHoraTemp = document.createElement("div");
                contHoraTemp.className = "contHoratemp";
                contHoraTemp.append(horaSecuencia,temperaturaHora);
                temperaturaPorHoras.append(contHoraTemp);
            });
            


            const contTemperaturas = document.createElement("div");
            contTemperaturas.className = "contTemperaturas";
            contTemperaturas.append(maxima,minima); 

            encabezado.append(mensaje,fecha);

            const maximas_minimas_semanal = document.createElement("div");
            maximas_minimas_semanal.className = "maximas_minimas_semanal";
            const prevision = document.createElement("p");
            prevision.innerHTML = "Prevision (7 días)";
            maximas_minimas_semanal.appendChild(prevision);

            resolve.daily.time.forEach((temp,index) => {
                const maxDiaria = document.createElement("p"); 
                maxDiaria.className = "maxDiaria";
                maxDiaria.innerHTML = "Máxima: " + resolve.daily.temperature_2m_max[index] + "°C";
                const minDiaria = document.createElement("p");
                minDiaria.className = "minDiaria";
                minDiaria.innerHTML = "Mínima: " + resolve.daily.temperature_2m_min[index] + "°C";
                const diaSemanal = document.createElement("p");
                diaSemanal.innerHTML = temp.slice(8,10);
                diaSemanal.style.textShadow = "2px 2px 2px black";

                const contMaximaMinima = document.createElement("div");
                contMaximaMinima.className = "contMaximaMinima";

                contMaximaMinima.append(diaSemanal, minDiaria,maxDiaria);
                
                maximas_minimas_semanal.append(contMaximaMinima);

            });

            resultado.append(encabezado, temperaturaActual,contTemperaturas, temperaturaPorHoras,maximas_minimas_semanal);
            document.body.append(resultado);

            document.body.style.backgroundImage = (horaNueva>19)? "url(img/nocturno.jpg)": "url(img/soleado.jpg)";
            
            document.body.style.backgroundSize = "cover";
        });

    });
});