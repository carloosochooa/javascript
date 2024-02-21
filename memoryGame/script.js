const juego = document.createElement("div");
juego.className = "juego";
let card = document.getElementById("card");
const play = document.getElementById("button");
let arrayImagen = [];
const numCartas = 6;
let arrayObjetos = [];
let imagenesIguales = [];
let puntuacion = 0;
let arrayCartasElegidas = [];
let permitirClic = true;
let cartasAcertadas = [];
let continuar = document.getElementById("continuar");
let arrayID = [];

class Pokemon {
    constructor(valor,imagenPokemon) {
        this.valor = valor;
        this.imagenPokemon = imagenPokemon;
        this.imagen = "img/pokeball.png";
    }

}

card.addEventListener("dragstart", (event) => {
    event.preventDefault();
})

async function fetchURL(url, data = {}) {
    let response = await fetch(url, data);
    return await response.json();
}

const numerosAleatorios = () => {
    const num1 = Math.floor(Math.random() * 300) + 1;
    return num1;
}

const desordenarArray = array => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

const guardarRutasPokemons = async () => {
    let offset = numerosAleatorios();
    const respuesta = await fetchURL(`https://pokeapi.co/api/v2/pokemon/?limit=6&offset=${offset}`, { "method": "GET" })
    for (let i = 0; i < numCartas; i++) {
        await guardarImagenesPokemons(respuesta.results[i].url);
    }
}

const guardarImagenesPokemons = async (pokemon) => {
    const respuesta = await fetchURL(pokemon, { "method": "GET" })
    arrayImagen.push(respuesta.sprites.other.dream_world.front_default);
}

const crearPokemons = () => {
    for (let i = 0; i < numCartas; i++) {
        let pokemon = new Pokemon(i + 1,arrayImagen[i]);
        arrayObjetos.push({ pokemon }, { pokemon });
    }
}

const mostrarCartas = () => {
    for (let i = 0; i < arrayObjetos.length; i++) {

        const carta = document.createElement("div");
        carta.className = "carta";

        const front = document.createElement("div");
        front.classList.add("front");

        let imagen = document.createElement("img");
        imagen.src = arrayObjetos[i].pokemon.imagenPokemon;
        imagen.classList.add("imagen" + arrayObjetos[i].pokemon.valor);

        const back = document.createElement("div");
        back.classList.add("back");

        let imagenPokeball = document.createElement("img");
        imagenPokeball.className = "imagen" + arrayObjetos[i].pokemon.valor;
        imagenPokeball.src = arrayObjetos[i].pokemon.imagen;
        imagenPokeball.alt = "Pokeball";

        carta.classList.add("carta" + arrayObjetos[i].pokemon.valor);
        carta.id = i;
        back.append(imagenPokeball);
        front.append(imagen);

        carta.append(front, back);
        juego.append(carta);
        // carta.classList.add("repartir");

        carta.addEventListener("click", () => manejarCarta(i));

    }
}
const manejarCarta = valor => {

    let cartaSeleccion = document.getElementById(valor);

    if (!cartasAcertadas.includes(cartaSeleccion) && permitirClic) {
        let front = cartaSeleccion.firstChild;
        let img = front.firstChild;
        img.src = arrayObjetos[valor].pokemon.imagenPokemon;

        void cartaSeleccion.offsetWidth;
        cartaSeleccion.classList.add("active");
        girarCartas(img.src, valor);
    }
}

const comprobarPuntuacion = () => {

    puntuacion += 1;
    localStorage.setItem("puntuacion",puntuacion);
    if (puntuacion === numCartas) {
        localStorage.removeItem("arrayID");
        arrayID = [];
        arrayImagen = [];

        setTimeout(()=>{
            ganar();
            juego.innerHTML = ""; 
            puntuacion = 0;
        },500);
    }
}


const girarCartas = (img, id) => {
    let carta = document.getElementById(id);

    imagenesIguales.push(img);
    arrayCartasElegidas.push(carta);
    arrayID.push(id);

    if (imagenesIguales.length == 2) {
        permitirClic = false;
        if (imagenesIguales[0] === imagenesIguales[1] ) {

            if(arrayCartasElegidas[0].classList.contains("girada") || arrayCartasElegidas[1].classList.contains("girada") ){
                return;
            }

            comprobarPuntuacion(arrayCartasElegidas);
            arrayCartasElegidas.forEach(elem =>{
                elem.classList.add("girada");
            })
            

            imagenesIguales = [];
            arrayID.pop();
            arrayID.pop();

            arrayID.push(arrayCartasElegidas[0].id, arrayCartasElegidas[1].id);
            localStorage.setItem("arrayID", JSON.stringify(arrayID));
            arrayCartasElegidas = [];

            permitirClic = true;

        } else {

            arrayID.splice(-2);

            setTimeout(() => {

                arrayCartasElegidas[0].classList.remove("active");
                arrayCartasElegidas[1].classList.remove("active");

                arrayCartasElegidas = [];
                imagenesIguales = [];
                permitirClic = true;
            }, 800);

        }

    } else {
        permitirClic = true;
    }
}

const iniciaJuego = async () => {
    localStorage.removeItem("arrayID");
    localStorage.removeItem("arrayObjetos");
    localStorage.removeItem("puntuacion");


    continuar.style.display = "none";
    continuar.style.filter = "none";
    const loader = document.getElementById("loader");
    loader.style.display = "block";
    card.style.filter = "blur(10px)";

    await guardarRutasPokemons();
    let audio = document.getElementById("musica");
    audio.volume = 1;
    audio.play();

    loader.style.display = "none";
    card.style.filter = "none";
    card.innerHTML = "";
    crearPokemons();
    arrayObjetos = desordenarArray(arrayObjetos);
    localStorage.setItem("arrayObjetos", JSON.stringify(arrayObjetos));

    mostrarCartas();
    card.append(juego);
}

const continuarJuego = () => {
    continuar.style.display = "none";
    card.style.filter = "blur(0px)";
    card.innerHTML = "";
    arrayID = JSON.parse(localStorage.getItem("arrayID"));
    arrayObjetos = JSON.parse(localStorage.getItem("arrayObjetos"));
    puntuacion = parseInt(localStorage.getItem("puntuacion"));
    

    mostrarCartas();

    setTimeout(() => {
        arrayID.forEach(id => {
            let carta = document.getElementById(id);
            carta.classList.add("active");
        });
    }, 500);
    card.append(juego);

}
const ganar = () => {
    localStorage.removeItem("arrayID");
    const ganar = document.getElementById("ganar");
    let imagen = document.getElementById("imagenGanar");
    imagen.src = arrayObjetos[0].pokemon.imagenPokemon;
    ganar.style.display = "flex";
    card.style.filter = "blur(8px)";
    document.getElementById("titulo").style.filter = "blur(8px)";
    setTimeout(()=>{
        ganar.style.display = "none";
        card.style.filter = "none";
        arrayObjetos = [];
        document.getElementById("titulo").style.filter = "none";
        window.location.reload();
    },3000);
}


if (localStorage.getItem("arrayID") != null) {
    continuar.classList.add("continuar");
    continuar.style.display = "flex";
    card.style.filter = "blur(8px)";

    let botonYes = document.getElementById("yes");
    botonYes.addEventListener("click", continuarJuego);

    let botonNo = document.getElementById("no");
    botonNo.addEventListener("click", iniciaJuego);

} 



