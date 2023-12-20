async function fetchURL(url,data = {}){
    return await fetch(url,data).then(response => response.json());
}

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




let opcionInicial = document.createElement("option");
opcionInicial.value = "";
opcionInicial.innerHTML = "Seleccione una ciudad";
select.appendChild(opcionInicial);

fetchURL(url, {"method": "GET"})

.then(resolve =>{
    const ciudadesEspaña = resolve.filter(elemento =>{
        return elemento[5] === "ES";
    });

    ciudadesEspaña.sort(function(a, b){
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
                if(valorSecuencia[0] == "0"){
                    horaSecuencia.innerHTML = valorSecuencia.slice(1);
                }
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

            resolve.daily.time.forEach((temp,index) =>{
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
            if(horaNueva>19){
                document.body.style.backgroundImage = "url(img/nocturno.jpg)";
            } else{
                document.body.style.backgroundImage = "url(img/soleado.jpg)";
            }
            document.body.style.backgroundSize = "cover";
        });

    });
});