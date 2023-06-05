/**
 * Funcion de validacion
 * Verificar que los campos no queden vacios antes de ir a la otra pagina.
 */

function validacion() {
    var nombretorneo = document.getElementById("nombre del torneo").value;
    var participantes = document.getElementById("participantes").value;
    var juego = document.getElementById("Juego/Deporte").value;

    if (nombretorneo === "") {
        alert("Por favor, escribe el nombre del torneo");
        return false;
    }
    if (participantes.trim() === "") {
        alert("Por favor, escribe los participantes");
        return false;
    }
    var renglon = participantes.split("\n");
    if (renglon.length % 2 !== 0) {
        alert("El número de Participantes debe ser par.");
        return false;
    }else{
        localStorage.setItem("participantes", renglon);
        localStorage.setItem("renglon", JSON.stringify(renglon));
    }
    if (juego === "") {
        alert("Por favor, escribe el Juego/Deporte");
        return false;
    }
    window.open("grafico.html");
}

/**
 * Funcion que dibuje los participantes del torneo ordenadamente, en
 * parejas de dos y separados para que se entiendan los enfrentamientos
 */
function dibujarNombres(){
    let participantes = localStorage.getItem("participantes");
    var arreglo_participantes = JSON.parse(localStorage.getItem("renglon"));

    console.log(arreglo_participantes);
    console.log(arreglo_participantes.length);

    const canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 1000;                                                     // Declare el tamaño del canvas aca porque sino se me cortaba el texto cuando habia muchos participantes
    canvas.height = 600;
    ctx.font = "15pt Open Sans";
    ctx.fillStyle = "white";

    const elementHeight = 10;
    const elementSpacing = 15;
    const groupSpacing = 50;
    const x = 60;
    let y = 60;

    for (let j = 0; j < arreglo_participantes.length; j+= 2){
        const ordenar = arreglo_participantes[j];
        const ordenar_parejas = arreglo_participantes[j + 1];

        ctx.fillText(ordenar, x , y);

        if (ordenar_parejas !== undefined && ordenar_parejas !== ordenar){
            ctx.fillText(ordenar_parejas, x , y + elementHeight + elementSpacing);
        }
            y += (elementHeight + elementSpacing) * 2 + groupSpacing;            // Actualiza la posicion para el siguiente elemento para
                                                                                 // que aparezca cada participante debajo del otro
        if (ordenar_parejas === undefined || ordenar_parejas === ordenar){
            y+= elementHeight + elementSpacing;
        }
    }
}

