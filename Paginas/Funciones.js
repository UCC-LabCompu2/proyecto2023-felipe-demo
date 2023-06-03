/**
 * Funcion de validacion
 * Verificar que los campos no queden vacios antes de ir a la otra pagina.
 */

function validacion(){
    var nombretorneo = document.getElementById("nombre del torneo").value;
    var participantes = document.getElementById("participantes").value;
    var juego = document.getElementById("Juego/Deporte").value;

    if (nombretorneo === ""){
        alert("Por favor, escribe el nombre del torneo");
        return false;
    }
    if(participantes.trim() === ""){
        alert("Por favor, escribe los participantes");
        return false;
    }
    var renglon = participantes.split("\n");
    if (renglon.length % 2 !== 0) {
        alert("El número de Participantes debe ser par.");
        return false;
    }
    if (juego === ""){
        alert("Por favor, escribe el Juego/Deporte");
        return false;
    }
    window.open("grafico.html");
}

// primero usar localstorage para guardar los elementos de una pagina y llevarlos a la otra
// despues usar for para ir poniendo los arreglos en orden y separados por una cierta cantidad de pixeles
// ver uso de texto en canvas

// for (let i=0; i<renglon.lenght; i++){

 //}







