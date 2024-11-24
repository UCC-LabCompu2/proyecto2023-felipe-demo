function mostrarDatos() {
    let mostrar_nombretorneo = localStorage.getItem("nombretorneo");
    let mostrar_juego = localStorage.getItem("juego");
    let mostrar_cantidadparticipantes = JSON.parse(localStorage.getItem("renglon"));

    document.getElementById("mostrarnombre").innerHTML = mostrar_nombretorneo;
    document.getElementById("mostrarjuego").innerHTML = mostrar_juego;
    document.getElementById("mostrar_cant").innerHTML = mostrar_cantidadparticipantes.length;
}

function validacion() {
    let nombretorneo = document.getElementById("nombre del torneo").value;
    let participantes = document.getElementById("participantes").value;
    let juego = document.getElementById("Juego/Deporte").value;
    let generacionAleatoria = document.getElementById("generacion aleatoria").checked;

    if (nombretorneo === "") {
        alert("Por favor, escribe el nombre del torneo");
        return false;
    } else {
        localStorage.setItem("nombretorneo", nombretorneo);
    }
    if (participantes.trim() === "") {
        alert("Por favor, escribe los participantes");
        return false;
    }
    const renglon = participantes.split("\n").filter(p => p.trim() !== "");
    if (renglon.length % 2 !== 0) {
        alert("El número de Participantes debe ser par.");
        return false;
    } else {
        let pairedParticipants = generacionAleatoria ? generarCrucesAleatorios(renglon) : generarCruces(renglon);
        localStorage.setItem("renglon", JSON.stringify(pairedParticipants));
    }
    if (juego === "") {
        alert("Por favor, escribe el Juego/Deporte");
        return false;
    } else {
        localStorage.setItem("juego", juego);
    }

    // Redirigir a grafico.html
    window.location.href = "grafico.html";
    return false; // Prevenir el envío del formulario
}

function generarCruces(participantes) {
    let cruces = [];
    const n = participantes.length;
    for (let i = 0; i < n / 2; i++) {
        cruces.push(participantes[i]);
        cruces.push(participantes[n - 1 - i]);
    }
    return cruces;
}

function generarCrucesAleatorios(participantes) {
    let shuffled = [...participantes];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function dibujarBracket() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    // Establecer dimensiones del canvas
    canvas.width = 1450;
    canvas.height = 800;

    // Limpiar el canvas
    ctx.fillStyle = "#06232f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar título del torneo
    ctx.fillStyle = "white";
    ctx.font = "bold 24px 'Open Sans'";
    ctx.textAlign = "center";
    const nombreTorneo = localStorage.getItem("nombretorneo") || "Nombre del torneo";
    ctx.fillText(nombreTorneo, canvas.width / 2, 50);

    function drawBracket(x, y, width, height, text, isFinal = false) {
        // Dibujar el rectángulo con borde
        ctx.fillStyle = "#2A3B47";
        ctx.strokeStyle = isFinal ? "#FF5C00" : "#4A5A67";
        ctx.lineWidth = 2;

        // Rectángulo con bordes redondeados
        const radius = 6;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Dibujar el texto
        if (text) {
            ctx.fillStyle = "white";
            ctx.font = "16px 'Open Sans'";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            const textX = x + 20;
            const textY = y + height/2;
            ctx.fillText(text, textX, textY);
        }
    }

    function drawConnection(startX, startY, endX, endY) {
        ctx.strokeStyle = "#4A5A67";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Calcular punto medio para la línea vertical
        const midX = startX + (endX - startX) / 2;

        // Dibujar líneas con ángulos rectos
        ctx.lineTo(midX, startY); // Línea horizontal desde inicio
        ctx.lineTo(midX, endY);   // Línea vertical
        ctx.lineTo(endX, endY);   // Línea horizontal hasta el final

        ctx.stroke();
    }

    // Configuración de dimensiones
    const bracketWidth = 270;
    const bracketHeight = 45;
    const horizontalGap = 220;
    const verticalGap = 30;

    // Obtener participantes
    const participants = JSON.parse(localStorage.getItem("renglon")) || [];

    // Calcular posición inicial
    const startX = 50;
    const startY = 100;

    // Primera ronda
    for (let i = 0; i < participants.length; i += 2) {
        const y1 = startY + i * (bracketHeight + verticalGap);
        const y2 = y1 + bracketHeight + 20;

        // Dibujar brackets de primera ronda
        drawBracket(startX, y1, bracketWidth, bracketHeight, participants[i]);
        if (participants[i + 1]) {
            drawBracket(startX, y2, bracketWidth, bracketHeight, participants[i + 1]);
        }

        // Dibujar bracket de siguiente ronda
        const nextX = startX + bracketWidth + horizontalGap;
        const nextY = y1 + ((y2 - y1) / 2);
        drawBracket(nextX, nextY, bracketWidth, bracketHeight);

        // Dibujar conexiones
        drawConnection(
            startX + bracketWidth,
            y1 + bracketHeight/2,
            nextX,
            nextY + bracketHeight/2
        );
        drawConnection(
            startX + bracketWidth,
            y2 + bracketHeight/2,
            nextX,
            nextY + bracketHeight/2
        );
    }

    // Dibujar bracket final
    const finalX = startX + (bracketWidth + horizontalGap) * 2;
    const finalY = startY + ((participants.length/2) * (bracketHeight + verticalGap))/2;
    drawBracket(finalX, finalY, bracketWidth, bracketHeight, null, true);

    // Conectar semifinales con la final
    const semiY1 = startY + bracketHeight/2;
    const semiY2 = startY + (participants.length/2 - 0.2) * (bracketHeight + verticalGap) + bracketHeight/2;

    drawConnection(
        startX + bracketWidth + horizontalGap + bracketWidth,
        semiY1 + bracketHeight,
        finalX, finalY + bracketHeight/2
    );
    drawConnection(
        startX + bracketWidth + horizontalGap + bracketWidth,
        semiY2 + bracketHeight,
        finalX,
        finalY + bracketHeight/2
    );
}

// Asegúrate de que dibujarBracket() se llame cuando se cargue la página de gráfico
window.onload = function() {
    mostrarDatos();
    dibujarBracket();
};




/*
/**
 * Funcion de validacion
 * Verificar que los campos no queden vacios antes de ir a la siguiente pagina.
 */
/*
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
 /*
 * Funcion para mostrar los datos ingresados por el usuario en el encabezado de la pagina.
 * Se mostrará el nombre del torneo, el juego/deporte y la cantidad de participantes.
 */
/*
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
/*
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
 */