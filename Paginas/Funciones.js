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

function guardarLocalStorage(){
    var participantes = document.getElementById("participantes").value;
    var guardar_participantes = participantes.split("\n");
    localStorage.setItem("participantes_llaves", guardar_participantes);
}
function cargarLocalStorage(){
    var participantes_guardados;
    participantes_guardados = localStorage.getItem("participantes_llaves");

    document.getElementById("myCanvas").value = participantes_guardados;

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.font = "12pt Arial";
    ctx.fillStyle = "white";

    ctx.fillText(participantes_guardados, 40, 40);
}
/*
 for (let i=0; i<renglon.lenght; i++) {
 }
*/






