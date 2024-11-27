/**
 * Funcion de validacion
 * Verificar que los campos no queden vacios antes de ir a la siguiente pagina.
 */
function validacion() {
    let nombretorneo = document.getElementById("nombre del torneo").value;
    let participantes = document.getElementById("participantes").value;
    let juego = document.getElementById("Juego/Deporte").value;
    let generacionAleatoria = document.getElementById("generacion aleatoria").checked;

    if (nombretorneo === "") {
        alert("Por favor, escribe el nombre del torneo");
        return false;
    }

    if (participantes.trim() === "") {
        alert("Por favor, escribe los participantes");
        return false;
    }

    const renglon = participantes.split("\n");
    if (renglon.length % 2 !== 0) {
        alert("El número de Participantes debe ser par.");
        return false;
    }

    if (juego === "") {
        alert("Por favor, escribe el Juego/Deporte");
        return false;
    }

    // Guardar datos si todas las validaciones pasan
    guardarDatosTorneo(nombretorneo, renglon, juego, generacionAleatoria);

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

f// Función para limpiar localStorage y guardar nuevos datos
function guardarDatosTorneo(nombretorneo, participantes, juego, generacionAleatoria) {
    localStorage.clear();

    let pairedParticipants = generacionAleatoria ? generarCrucesAleatorios(participantes) : generarCruces(participantes);

    let datos = {
        nombretorneo: nombretorneo,
        renglon: pairedParticipants,
        juego: juego,
        timestamp: new Date().getTime()
    };

    localStorage.setItem("datosTorneo", JSON.stringify(datos));
}

/*
 * Funcion para mostrar los datos ingresados por el usuario en el encabezado de la pagina.
 * Se mostrará el nombre del torneo, el juego/deporte y la cantidad de participantes.
 */
function mostrarDatos() {
    let datosString = localStorage.getItem("datosTorneo");
    if (datosString) {
        let datos = JSON.parse(datosString);
        let ahora = new Date().getTime();

        // Verificar si los datos tienen menos de 5 minutos de antigüedad
        if (ahora - datos.timestamp < 5 * 1000) {
            document.getElementById("mostrarnombre").innerHTML = datos.nombretorneo;
            document.getElementById("mostrarjuego").innerHTML = datos.juego;
            document.getElementById("mostrar_cant").innerHTML = datos.renglon.length;
        } else {
            alert("Los datos del torneo han expirado. Por favor, vuelve a ingresar la información.");
            window.location.href = "toma_de_datos.html"; // Redirigir a la página del formulario
        }
    } else {
        alert("No se encontraron datos del torneo. Por favor, ingresa la información del torneo.");
        window.location.href = "toma_de_datos.html"; // Redirigir a la página del formulario
    }

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
    const datosString = localStorage.getItem("datosTorneo");
    const datos = datosString ? JSON.parse(datosString) : {};
    const nombreTorneo = datos.nombretorneo || "Nombre del torneo";
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

    function dibujarConexion(startX, startY, endX, endY) {
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
    const participants = datos.renglon || [];

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
        dibujarConexion(
            startX + bracketWidth,
            y1 + bracketHeight/2,
            nextX,
            nextY + bracketHeight/2
        );
        dibujarConexion(
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
    const semiY2 = startY + (participants.length/2 - 0.2) * (bracketHeight + verticalGap);

    dibujarConexion(
        startX + bracketWidth + horizontalGap + bracketWidth,
        semiY1 + bracketHeight/1.5,
        finalX,finalY + bracketHeight/2
    );
    dibujarConexion(
        startX + bracketWidth + horizontalGap + bracketWidth,
        semiY2 + bracketHeight * 1.5,
        finalX,
        finalY + bracketHeight/2
    );
}

//Se llaman cuando se cargue la página de gráfico
window.onload = function() {
    mostrarDatos();
    dibujarBracket();
    AnimacionTrofeo();
};

//Animacion del trofeo
function AnimacionTrofeo() {
    // Obtener la imagen del trofeo
    const trophyImage = document.querySelector('.trofeo');

    // Agregar la animación al evento "mouseover"
    trophyImage.addEventListener('mouseover', () => {
        trophyImage.classList.add('animate');
    });

    // Remover la animación al evento "mouseout"
    trophyImage.addEventListener('mouseout', () => {
        trophyImage.classList.remove('animate');
    });
}
