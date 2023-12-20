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

.then(function(resolve){
    const ciudadesEspaña = resolve.filter(function(array){
        return array[5] === "ES";
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

            const  temperaturaActual = document.createElement("p");
            temperaturaActual.className = "grados";
            temperaturaActual.innerHTML = Math.round(resolve.current.temperature_2m) + "°C";

            let encabezado = document.createElement("div");
            encabezado.className = "encabezado";

            let maxima = document.createElement("p");
            maxima.className = "maxima";
            let minima = document.createElement("p");
            minima.className = "minima";

            resolve.daily.temperature_2m_max.forEach(temperatura => {
                let max = 0;
                if (temperatura > max){
                    max = temperatura;
                }
                maxima.innerHTML = "<b>Máxima:</b> " + max + "°C |";
            });

            resolve.daily.temperature_2m_min.forEach(temperatura => {
                let min = 100;
                if(temperatura < min){
                    min = temperatura;
                }
                minima.innerHTML = "<b>Mínima:</b> " + min + "°C";
            })



            //TODO resumen semanal com maxiam minimas y precipitaciones, resumen de horas con lo mismo y graficas, a parte de poner 
            // que se pueda seguir eligiendo la ciudad
            const temperaturaPorHoras = document.createElement("div");
            temperaturaPorHoras.className = "tempPorHoras";
            const horasMostrar = 10;
            let temperaturaHora = "";
            temperaturaHora.className = "tempHora";
            let horaSecuencia = "horaSecuencia";
            resolve.hourly.time.slice(0, horasMostrar).forEach((horaa, index) => {
                //Quiero mostrar la cantidad de 10 temperaturas
                temperaturaHora = Math.round(resolve.hourly.temperature_2m[index]);
                horaSecuencia = obtenerHoraISO(horaa);

                horaSecuencia = (horaSecuencia[0] === "0") ? horaSecuencia.slice(1) : horaSecuencia;

                const tempHora = document.createElement("div");
                tempHora.className = "tempHora";
                tempHora.append(horaSecuencia,temperaturaHora);
                temperaturaPorHoras.append(tempHora);
            });


            const contTemperaturas = document.createElement("div");
            contTemperaturas.className = "contTemperaturas";
            contTemperaturas.append(maxima,minima); 

            encabezado.append(mensaje,fecha);
            resultado.append(encabezado, temperaturaActual,contTemperaturas, temperaturaPorHoras);
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