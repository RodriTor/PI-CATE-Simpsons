const frasesDiv = document.querySelector("#frases");
const personajesDiv = document.querySelector("#personajes");
const btnComprobar = document.querySelector("#comprobar");
const btnReiniciar = document.querySelector("#reiniciar");

let datos = [];
let seleccionFrase = null;
let seleccionPersonaje = null;
let parejasElegidas = [];

function cargarFrases() {
  fetch("https://thesimpsonsquoteapi.glitch.me/quotes?count=5").then(res => res.json()).then(resultados => {
      datos = resultados;
      mostrarFrases();
      mostrarPersonajes();
    });
}

function mostrarFrases() {
  frasesDiv.innerHTML = "";
  datos.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = item.quote;
    div.onclick = function () {
      deseleccionar(frasesDiv);
      div.classList.add("seleccionado");
      seleccionFrase = index;
      intentarEmparejar();
    };
    frasesDiv.appendChild(div);
  });
}

function mostrarPersonajes() {
  personajesDiv.innerHTML = "";
  const mezclados = [...datos].sort(() => Math.random() - 5);
  mezclados.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = item.character;

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.character;
    img.className = "avatar";
    
    div.appendChild(img)
    
    div.onclick = function () {
      deseleccionar(personajesDiv);
      div.classList.add("seleccionado");
      seleccionPersonaje = index;
      intentarEmparejar();
    };
    personajesDiv.appendChild(div);
  });
}

function intentarEmparejar() {
  if (seleccionFrase !== null && seleccionPersonaje !== null) {
    const fraseItems = frasesDiv.querySelectorAll(".item");
    const personajeItems = personajesDiv.querySelectorAll(".item");

    const fraseDiv = fraseItems[seleccionFrase];
    const personajeDiv = personajeItems[seleccionPersonaje];

    const frase = datos[seleccionFrase].quote;
    const personaje = personajeDiv.textContent;

    parejasElegidas.push({ frase: frase, personaje: personaje });

    fraseDiv.classList.add("emparejado");
    fraseDiv.onclick = null;
    personajeDiv.classList.add("emparejado");
    personajeDiv.onclick = null;

    seleccionFrase = null;
    seleccionPersonaje = null;
  }
}

function deseleccionar(contenedor) {
  contenedor.querySelectorAll(".item").forEach(el => el.classList.remove("seleccionado"));
}

btnComprobar.onclick = function () {
let mensaje = "";
  let correctos = 0;

  parejasElegidas.forEach(par => {
    const esCorrecto = datos.some(d => d.quote === par.frase && d.character === par.personaje);
        if (esCorrecto) correctos++;
    mensaje += `\n"${par.frase}" - ${par.personaje} ${esCorrecto ? "✔" : "❌"}`;
  });

  alert(`Acertaste ${correctos} de ${parejasElegidas.length}:\n${mensaje}`);
};


btnReiniciar.onclick = function () {
  datos = [];
  parejasElegidas = [];
  seleccionFrase = null;
  seleccionPersonaje = null;
  frasesDiv.innerHTML = "";
  personajesDiv.innerHTML = "";
  cargarFrases();
};

cargarFrases();
