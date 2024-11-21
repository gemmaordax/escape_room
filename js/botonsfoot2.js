window.onload = function () {
	//Creació de constants amb els botons, imatge i text que hem declarat al html,
	const about = document.getElementById("boto1");
	const baseslegals = document.getElementById("boto2");
	const privacitat = document.getElementById("boto3");
	const coockies = document.getElementById("boto4");
	const tancar = document.getElementById("tancar");
	const textAbout = document.getElementById("descripcio").innerText;

//Si es dòna clic al boto "about us" entrem a la següent funció
about.addEventListener("click", function () {
	//Cridem la funció obrirPop up i li enviem la info que volem que surti a la finestre pop up. Titol, text i logo
	obrirPopUP('ABOUT US', textAbout);
	//Si es fa clic al botó tancar es crida la funció tancarPopup
	tancar.addEventListener('click', tancarPopup);
});



//Si es fa clic al boto "Avís legal" obrim la funció, d'obrir una nova finestra externa amb el contigut de baseslegals.html
baseslegals.addEventListener("click", function () {
	window.open("../pages/baseslegals.html", "width=700,height=700");
});

//Si es fa clic al boto "Políctica de privacitat" obrim la funció, d'obrir una nova finestra externa amb el contigut de baseslegals.html
privacitat.addEventListener("click", function () {
	window.open("../pages/privacitat.html", "width=700,height=700");
});

//Si es fa clic al boto "Políctica de coockies" obrim la funció, d'obrir una nova finestra externa amb el contigut de baseslegals.html
coockies.addEventListener("click", function () {
	window.open("../pages/coockies.html", "width=700,height=700");
});



// funció d'obir finestra popup amb la info de titol, descripcio i imatge que li passem
function obrirPopUP(titol, descripcio) {
	// Agafem com variables els espais que tenim en el popup

	var finestra = document.getElementById("popup");
	var espaiTitol = document.getElementById("titolPopUP");
	var espaiDescripcio = document.getElementById("descripcio");

	//dins de cada espai declarat introduïm el contigut corresponent
	espaiTitol.innerText = titol;
	if (espaiDescripcio != null) {
		espaiDescripcio.innerText = descripcio;
	}

	// Fem que la finestra sigui visible i ocupi l'espai marcat en el css
	finestra.style.display = "block";
}

// funció de tancar finestra popup
function tancarPopup() {
	// Creem la variable on agafem el contingut de "popup"
	var finestra = document.getElementById("popup");
	// Fem que la finestra no sigui visible
	finestra.style.display = "none";
}


}

function canviColor(boton) {
	boton.classList.add("btn:hover");
}

function resetColor(boton) {
	boton.classList.remove("btn:hover");
}
