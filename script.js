const frasesDiv = document.querySelector("#frases");
const personajesDiv = document.querySelector("#personajes");
const btnComprobar = document.querySelector("#comprobar");
const btnReiniciar = document.querySelector("#reiniciar");

let datos = [];
let seleccionFrase = null;
let seleccionPersonaje = null;
let parejasElegidas = [];

function cargarFrases() {
    const frasesitas = [];
    for (let i=0; i<5; i++) {
        frasesitas.push(fetch("https://thesimpsonsquoteapi.glitch.me/quotes").then(res => res.json()));
    }

Promise.all(frasesitas).then(resultados => {
    datos = resultados.map(r => r[0]);
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
  const mezclados = [...datos].sort(() => Math.random() - 0.5);
  mezclados.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = item.character;
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
    const frase = datos[seleccionFrase].quote;
    const personaje = personajesDiv.querySelectorAll(".item")[seleccionPersonaje].textContent;
    parejasElegidas.push({ frase: frase, personaje: personaje });
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
    mensaje += `\n"${par.frase}" - ${par.personaje} ${esCorrecto ? "✔" : "❌"}`;
    if (esCorrecto) correctos++;
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
