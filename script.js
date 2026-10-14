//apis para la tarea
const apiPerros = "https://dog.ceo/api/breeds/image/random";
const apiGatos = "https://api.thecatapi.com/v1/images/search?limit=18";
const apiZorros = "https://randomfox.ca/floof/";
const apiconejo = "https://api.bunnies.io/v2/loop/random/?media=gif,png";
const galeria = document.getElementById("galeria");
let imagenes = [];

async function obtenerDatos(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Error al consultar una API");
    }

    return response.json();
}

async function cargarGaleria() {

    const solicitudesPerros = Array.from(
        { length: 18 },
        () => obtenerDatos(apiPerros)
    );

    const solicitudesZorros = Array.from(
        { length: 18 },
        () => obtenerDatos(apiZorros)
    );

    const solicitudconejo = Array.from(
        { length: 10 },
        () => obtenerDatos(apiconejo)
    );


    const [perros, gatos, zorros, conejo] = await Promise.all([
        Promise.all(solicitudesPerros),
        obtenerDatos(apiGatos),
        Promise.all(solicitudesZorros),
        Promise.all(solicitudconejo).catch(error => {
            console.error("salio mal", error);
            return [];


        })

    ]);
    console.log("conejos recibidos:", conejo);

    imagenes = [
        ...perros.map(perro => ({
            url: perro.message,
            tipo: "perros"
        })),

        ...gatos.map(gato => ({
            url: gato.url,
            tipo: "gatos"
        })),

        ...zorros.map(zorro => ({
            url: zorro.image,
            tipo: "zorros"
        })),

        ...conejo.map(conejo => ({
            url: conejo.media?.gif,
            tipo: "conejos"
        })).filter(conejo => conejo.url)
    ];


    for (let i = imagenes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [imagenes[i], imagenes[j]] =
            [imagenes[j], imagenes[i]];
    }


    mostrarImagenes(imagenes);
}

function mostrarImagenes(lista) {
    galeria.replaceChildren();

    lista.forEach(animal => {
        const imagen = document.createElement("img");

        imagen.src = animal.url;
        imagen.alt = animal.tipo;
        imagen.width = 150;

        galeria.appendChild(imagen);
    });
}
cargarGaleria().catch(error => {
    console.error("Error al cargar imágenes:", error);
});
const buscador = document.getElementById("buscador");

buscador.addEventListener("input", () => {
    const busqueda = buscador.value.toLowerCase().trim();

    const resultados = imagenes.filter(animal =>
        animal.tipo.includes(busqueda)
    );

    mostrarImagenes(resultados);
});
