let offset = 0;
let contenedor = document.getElementById("contenedor");
let numero = document.createElement("p");
let nombre = document.createElement("p");
let habilidadesContainer = document.createElement("div");
let contPesos = document.createElement("div");
let contAlturas = document.createElement("div");
let expBase = document.createElement("div");
let ataque = document.createElement("p");
let defensa = document.createElement("p");
let vida = document.createElement("p");
let velocidad = document.createElement("p");
let imagen = document.createElement("img");

function cargarPokemon() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/?limit=1&offset=${offset}`, true);

    xhr.onload = function () {
        if (xhr.status == 200) {
            const response = JSON.parse(xhr.response);

            response.results.forEach(pokemon => {

                numero.textContent = `No. ${offset + 1}`;
                numero.className = "numero";


                nombre.textContent = pokemon.name;
                nombre.className = "nombre";

                contenedor.innerHTML = ''; 
                contenedor.append(numero, nombre,habilidadesContainer);


                let pokemonDetallesXHR = new XMLHttpRequest();
                pokemonDetallesXHR.open("GET", pokemon.url, true);
                pokemonDetallesXHR.send();
                pokemonDetallesXHR.onload = function () {
                    if (pokemonDetallesXHR.status == 200) {
                        const pokemonDetalles = JSON.parse(pokemonDetallesXHR.response);
                        habilidadesContainer.innerHTML = ''; 

                        let cont = 1;
                        pokemonDetalles.abilities.forEach((poke) => {
                            if(cont <= 2){
                            let habilidad = document.createElement("p");
                            habilidad.className = "hab" + cont;
                            habilidad.textContent = poke.ability.name;
                            habilidadesContainer.appendChild(habilidad);
                            cont += 1;
                            }
                            
                        });

                        let tipo = document.createElement("p");
                        tipo.id = "tipoValor";
                        tipo.textContent = pokemonDetalles.types[0].type.name;
                        contenedor.appendChild(tipo);


                        imagen.className = "imagen";
                        imagen.src = "";
                        imagen.src = pokemonDetalles.sprites.front_default;
                        console.log(pokemonDetalles.sprites.front_default);
                        imagen.style.imageRendering = "pixelated";
                        contenedor.appendChild(imagen);

                        contAlturas.innerHTML = "";
                        contAlturas.id = "contAlturas";
                        let altura = document.createElement("p");
                        altura.id = "altura";
                        altura.textContent = (pokemonDetalles.height/10) + "m";
                        let alturaDato = document.createElement("p");
                        alturaDato.id = "alturaDato";
                        alturaDato.textContent = "Height";
                        contAlturas.append(alturaDato,altura);
                        
                        document.body.appendChild(contAlturas);

                        contPesos.innerHTML = "";
                        contPesos.id = "contPesos";
                        let peso = document.createElement("p");
                        peso.textContent = (pokemonDetalles.weight/10) + "kg";    
                        let pesoDato = document.createElement("p");
                        pesoDato.id = "pesoDato";    
                        pesoDato.textContent = "Weight";
                        contPesos.append(pesoDato,peso);
                        document.body.appendChild(contPesos);      
                        
                        expBase.innerHTML = "";
                        expBase.id = "expBase";
                        let exp = document.createElement("p");
                        exp.textContent = pokemonDetalles.base_experience;
                        let expDato = document.createElement("p");
                        expDato.textContent = "Base experience";
                        expBase.append(expDato,exp);
                        document.body.appendChild(expBase);

                        let estadisticas = document.getElementById("estadisticas");
                        ataque.innerHTML = "";
                        ataque.id = "ataqueVal";
                        let contAtaque = document.getElementById("ataque");
                        ataque.innerHTML = pokemonDetalles.stats[1].base_stat;
                        contAtaque.appendChild(ataque);

                        defensa.innerHTML = "";
                        defensa.id = "escudoVal";
                        let contDefensa = document.getElementById("defensa");
                        defensa.innerHTML = pokemonDetalles.stats[2].base_stat;
                        contDefensa.appendChild(defensa);

                        vida.innerHTML = "";
                        vida.id = "vidaVal";
                        let contVida = document.getElementById("salud");
                        vida.innerHTML = pokemonDetalles.stats[0].base_stat;
                        contVida.appendChild(vida);

                        velocidad.innerHTML = "";
                        velocidad.id = "velocidadVal";
                        let contVelocidad = document.getElementById("velocidad");
                        velocidad.innerHTML = pokemonDetalles.stats[5].base_stat;
                        contVelocidad.appendChild(velocidad);

                        estadisticas.append(contAtaque,contDefensa,contVida,contVelocidad);
                        document.body.appendChild(estadisticas);
                        
                    }
                };
            });
        } else {
            console.error("Error", xhr.statusText);
        }
    };
    xhr.send();
}

document.addEventListener("DOMContentLoaded", function () {
    cargarPokemon();
});

function siguiente(){
    offset += 1;
    if(offset==1018){
        offset = 0;
    }
    cargarPokemon();
}

function atras(){
    offset -= 1;
    if(offset == -1){
        offset = 1017;
    }
    cargarPokemon();
}

let avanzar = document.getElementById("avanzar");
avanzar.addEventListener("click", siguiente);

let anterior = document.getElementById("retroceder");
anterior.addEventListener("click",atras);

document.addEventListener("keydown",function(event){
    if (event.key === "ArrowLeft") {
        atras();
    }
    else if(event.key === "ArrowRight") {
        siguiente();
    }
});







