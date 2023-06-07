/**
 * Funcion de validacion
 * Verificar que los campos no queden vacios antes de ir a la siguiente pagina.
 */
function validacion() {
    let nombretorneo = document.getElementById("nombre del torneo").value;
    let participantes = document.getElementById("participantes").value;
    let juego = document.getElementById("Juego/Deporte").value;

    if (nombretorneo === "") {
        alert("Por favor, escribe el nombre del torneo");                       //Si se deja en blanco el input, salta la alerta
        return false;
    } else {
        localStorage.setItem("nombretorneo", nombretorneo);                     //Si se escribe algo, se setea en LocalStorage para luego ser usado
    }
    if (participantes.trim() === "") {                                         //?? //.trim elimina los espacios en blanco del final de los strings
        alert("Por favor, escribe los participantes");
        return false;
    }
    const renglon = participantes.split("\n");                                //.split() divide un String en un Array y con \n hago que se salte una linea, asi cada linea es un elemento del array
    if (renglon.length % 2 !== 0) {                                         //Verifico que se haya escrito un numero de participantes par
        alert("El número de Participantes debe ser par.");
        return false;
    } else {
        localStorage.setItem("renglon", JSON.stringify(renglon));
    }
    if (juego === "") {
        alert("Por favor, escribe el Juego/Deporte");
        return false;
    } else {
        localStorage.setItem("juego", juego);
    }

    window.open("grafico.html");                                      //Si se cumplieron todas las condiciones, se pasa de pagina
}

/**
 * Funcion para mostrar los datos ingresados por el usuario en el encabezado de la pagina.
 * Se mostrará el nombre del torneo, el juego/deporte y la cantidad de participantes.
 */
function mostrarDatos() {
    let mostrar_nombretorneo = localStorage.getItem("nombretorneo");              //creo variables para guardar los datos ingresados en el formulario de toma_de_datos.html
    let mostrar_juego = localStorage.getItem("juego");
    let mostrar_cantidadparticipantes = JSON.parse(localStorage.getItem("renglon"));

    document.getElementById("mostrarnombre").innerHTML = mostrar_nombretorneo;
    document.getElementById("mostrarjuego").innerHTML = mostrar_juego;
    document.getElementById("mostrar_cant").innerHTML = mostrar_cantidadparticipantes.length;
}

/**
 * Funcion que dibuje los participantes del torneo ordenadamente, en
 * parejas de dos y separados para que se entiendan los enfrentamientos
 */
function dibujarParticipantes() {

    let arreglo_participantes = JSON.parse(localStorage.getItem("renglon"));        //Uso JSON.parse para obtener el arreglo con los participantes

    console.log(arreglo_participantes);
    console.log(arreglo_participantes.length);

    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 900;                                                     // Declare el tamaño del canvas acá porque si no se me cortaba el texto cuando había muchos participantes
    canvas.height = 500;
    ctx.font = "15pt Open Sans";
    ctx.fillStyle = "white";
    const elementHeight = 10;
    const elementSpacing = 15;
    const groupSpacing = 40;
    const x = 50;
    let y = 50;

    for (let j = 0; j < arreglo_participantes.length; j += 2) {                   //For para ordenar de a pares los participantes
        const ordenar = arreglo_participantes[j];
        const ordenar_parejas = arreglo_participantes[j + 1];

        ctx.fillText(ordenar, x, y);

        if (ordenar_parejas !== undefined && ordenar_parejas !== ordenar) {                  //En caso de que el participante este definido y sea distinto al anterior, se escribe en el canvas
            ctx.fillText(ordenar_parejas, x, y + elementHeight + elementSpacing);
        }
        y += (elementHeight + elementSpacing) * 2 + groupSpacing;                    // Actualiza la posicion del siguiente elemento para
                                                                                     // que aparezca cada participante debajo del otro
        if (ordenar_parejas === undefined || ordenar_parejas === ordenar) {
            y += elementHeight + elementSpacing;
        }
    }
}



/* Empece a ver como ordenar los participantes para que en los emparejamientos toque el primero que se ingrese
   (supuestamente seria el mejor) con el ultimo (seria el peor), el segundo con el penultimo, y asi. Esto para
   que sea un formato de torneo como por ejemplo el de la NBA. No pude todavia adaptarlo a lo anterior.
   Si lo pruebo debajo del For los elementos se muestran como yo quiero.


const n = arreglo_participantes.length;  // Obtener la longitud del arreglo
const pares = Math.floor(n / 2);  // Obtener el número de pares

// Empezar desde el primer elemento y emparejar el mejor contra el peor
for (let i = 0; i < pares; i++) {
    // Obtener el índice del elemento "mejor" (primero, segundo, etc.)
    const mejor = i;

    // Obtener el índice del elemento "peor" (último, penúltimo, etc.)
    const peor = n - 1 - i;

    // Imprimir el emparejamiento
    console.log(arreglo_participantes[mejor]);
    console.log(arreglo_participantes[peor]);
}
const emparejamientos = [];

for (let i = 0; i < pares; i++) {
    const mejor = i;
    const peor = n - 1 - i;

    emparejamientos.push(arreglo_participantes[mejor]);
    emparejamientos.push(arreglo_participantes[peor]);
}*/