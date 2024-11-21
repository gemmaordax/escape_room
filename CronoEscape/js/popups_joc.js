//Comprova que s'hagi visualitzat el video i la foto abans de permetre apagar la llum
function comprovaLlum() {
  if (tabletOK == true && photoOK == true) {
    let interruptor = document.querySelector(".interruptor");
    interruptor.setAttribute("id", "llumActivada");
    //Comprova si la llum està apagada o ensesa
    if (
      bgImgContainer.style.backgroundImage ===
      'url("../img/juego1/fondo_presente.jpg")'
    ) {
      //Està apagada
      apagarLlum(false);
      //Està encesa
    } else {
      apagarLlum(true);
    }
  }
}

function cerrarPopUp() {
  document.getElementById("PopUp").style.display = "none";
}
//Tanca el popup de video
function cerrarPopUpVideo() {
  document.getElementById("PopUp").style.display = "none";
  //Serveix per parar el video al tancar el popup
  document.getElementById("video").src = ""; // Para la reproducció del video al tancar el popup
}

//PopUp Tablet
var tabletOK = false;
function PopUpTablet() {
  var div = document.querySelector(".PopUps");
  var text = `<div id="PopUp" style="display:block; position:fixed; top:0; left:0; width:100%; height:100%; background-color: rgba(0,0,0,0.5);">
  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background-color:#fff; padding:60px;">
  <button class="btn " onclick="cerrarPopUpVideo()" id="tancar">X</button>
    <iframe id="video" width="560" height="315" src="https://www.youtube.com/embed/wfzecNXhGk8" frameborder="0" allow="accelerometer; autoplay;" allowfullscreen></iframe>
  </div>
</div>`;
  tabletOK = true;
  console.log("Tablet activada");
  div.innerHTML = text;
}

//PopUp Photo
var photoOK = false;
function PopUpPhoto() {
  var div = document.querySelector(".PopUps");
  var text = `<div id="PopUp" style="display:block; position:fixed; top:0; left:0; width:100%; height:100%; background-color: transparent;">
  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background-color:transparent; padding:10px;">
  <button class="btn btn-primary" onclick="cerrarPopUp()" id="tancar">X</button>
    <img src="../img/juego1/on/polaroid-popup.png">
  </div>
</div>`;
  photoOK = true;
  console.log("Foto activada");
  div.innerHTML = text;
}

//PopUp Ordinador
function PopUpPC() {
  var div = document.querySelector(".PopUps");

  var text = `<div id="PopUp" style="display:block; position:fixed; top:0; left:0; width:100%; height:100%; background-color: rgba(0,0,0,0.5);">
  <div style="display:block; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background-color:#fff; padding:50px;">
  <button class="btn " onclick="cerrarPopUp()" id="tancar">X</button>
    <img src="../img/juego1/on/pc_popup.png">
    <input id="input_resposta" type="text" style="position:absolute; top: 65%; left: 65% ;background-color:transparent; border:none; font-size: 40px; color: white;
    transform: translate(-50%, -50%);" type="text" placeholder="Introdueix la resposta">
    <button class="btn btn-primary" style="position:absolute; top: 80%; left: 50% ; font-size: 25px;
    transform: translate(-50%, -50%);" onclick="comprovaResposta1()">Comprova</button>
  </div>
  </div>`;
  div.innerHTML = text;
}

//Comprova resposta ordinador
function comprovaResposta1() {

  let input = document.getElementById("input_resposta").value.toLowerCase();
  //input tiene que ser mayor a 3 caracteres y no admite espacios ni caracteres especiales using regex
  if (input.length > 3 && input.match(/^[a-zA-Z0-9]+$/)) {
    //Comprova si la resposta és correcta
    let url = `https://cronoescape-ioc-default-rtdb.europe-west1.firebasedatabase.app/respostes/resposta1/${input}/.json`;


    let data = httpRequest(url);
    
    if (data != "null") {
      // L'entrada dona true

      localStorage.setItem("checkPoint", input.toLowerCase());

      window.location.href = "game_updater.html";

    } else {
      // L'entrada no correspon amb la contrasnya
      alert("Resposta errònia");

    }




  }




}



//PopUp Ordinador JOC2

function comprovaResposta2() {

  let input = document.getElementById("input_resposta").value.toLowerCase();
  //input tiene que ser mayor a 3 caracteres y no admite espacios ni caracteres especiales using regex
  if (input.length > 3 && input.match(/^[a-zA-Z0-9]+$/)) {
    //Comprova si la resposta és correcta
    let url = `https://cronoescape-ioc-default-rtdb.europe-west1.firebasedatabase.app/respostes/resposta2/${input}/.json`;


    let data = httpRequest(url);
    
    if (data != "null") {
      // L'entrada dona true

      localStorage.setItem("checkPoint", input.toLowerCase());

      window.location.href = "game_updater.html";

    } else {
      // L'entrada no correspon amb la contrasnya
      alert("Resposta errònia");

    }




  }

}


//PopUp Movil
var QrOK = false;
function PopUpMovil() {
  var div = document.querySelector(".PopUps");
  var text = `<div id="PopUp" style="display:block; position:fixed; top:0; left:0; width:100%; height:100%; background-color: transparent;">
  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); padding:10px;">
  <button class="btn btn-primary" onclick="cerrarPopUp()" id="tancar">X</button>
    <img src="../img/juego3/qr-popup.png" width="50%" style="float: right;">
  </div>
</div>`;
  QrOK = true;
  div.innerHTML = text;
}


var movilOK = false;
function OnPhone() {
  var div = document.getElementById("qr");
  var movil = document.querySelector(".movil");
  var qrOpacidad = 0.7;
 
  if (movilOK) {
    movil.src = '../img/juego3/HoloPhone_apagado.png';
    qrOpacidad = 0;
    movilOK = false;
  } else {
    movil.src = '../img/juego3/HoloPhone_encendido.png';
    movilOK = true;
  }

  div.style.opacity = qrOpacidad;
}



//PopUp Ordinador JOC3 Futur
function PopUpPC3() {
  var div = document.querySelector(".PopUps");

  var text = `<div id="PopUp" style="display:block; position:fixed; top:0; left:0; width:100%; height:100%; background-color: rgba(0,0,0,0.5);">
  <div style="display:block; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background-color:#fff; padding:50px;">
  <button class="btn " onclick="cerrarPopUp()" id="tancar">X</button>
    <img src="../img/juego3/pc_popup.png">
    <input id="input_resposta" type="text" style="position:absolute; top: 65%; left: 65% ;background-color:transparent; border:none; font-size: 40px; color: white;
    transform: translate(-50%, -50%);" type="text" placeholder="Introdueix la resposta">
    <button class="btn btn-primary" style="position:absolute; top: 80%; left: 50% ; font-size: 25px;
    transform: translate(-50%, -50%);" onclick="comprovaResposta3()">Comprova</button>
  </div>
  </div>`;
  div.innerHTML = text;
}

//PopUp Ruleta JOC3 Futur
function PopUpRuleta() {
  var div = document.querySelector(".PopUps");

  var text = `<div id="PopUp" style="display:block; position:fixed; top:0; left:0; width:100%; height:100%; background-color: transparent;">
  <div style="position:absolute; top:50%; left:50%; transform:translate(-20%, -20%); padding:10px;">
  <button class="btn btn-primary" onclick="cerrarPopUp()" id="tancar2">X</button>
    <img src="../img/juego3/ruleta_popup.png" width="50%" style="float: right top: -10%;">
  </div>
</div>`;
  ruletaOK = true;
  console.log("Ruleta actiu");
  div.innerHTML = text;
}


//Comprova resposta ordinador JOC 3 FUTUR
function comprovaResposta3() {

  let input = document.getElementById("input_resposta").value.toLowerCase();
  //input tiene que ser mayor a 3 caracteres y no admite espacios ni caracteres especiales using regex
  if (input.length > 3 && input.match(/^[a-zA-Z0-9]+$/)) {
    //Comprova si la resposta és correcta
    let url = `https://cronoescape-ioc-default-rtdb.europe-west1.firebasedatabase.app/respostes/resposta3/${input}/.json`;


    let data = httpRequest(url);
    
    if (data != "null") {
      // L'entrada dona true

      localStorage.setItem("checkPoint", input.toLowerCase());

      //window.location.href = "joc2.html";
      window.location.href = "game_updater.html";

    } else {
      // L'entrada no correspon amb la contrasnya
      alert("Resposta errònia");

    }




  }

}


/////////////////////////////////////////
//HTTP REQUEST METHODS


//function to make an http request to the URL and return the response
function httpRequest(url) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.open('GET', url, false);
  httpRequest.send();
  if (httpRequest.status === 200) {
    return httpRequest.responseText;
  } else {
    return null;
  }
}


/////////////////////////////////////////
//JOC 2 (PASSAT)


//PopUp Moneda
var coinOK = false;
function PopUpCoin() {
  if(radioOK==true){
  var div = document.querySelector(".PopUps");
  var text = `<div id="PopUp" style="display:block; position:fixed; top:0; left:0; width:100%; height:100%; background-color: transparent;">
  <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background-color:transparent; padding:10px;">
    <img src="../img/juego2/coin-flip.gif">
  </div>
<audio id="soCoin" src="../audio/coin.mp3" autoplay></audio>
</div>`;
  div.innerHTML = text;
  setTimeout(function () {
    div.innerHTML = "";
  }, 2000);
  document.querySelector(".moneda").style.visibility = "hidden";
  coinOK = true;
  console.log("Moneda activada");
}
}

//PopUp Ordinador
function PopUpPC2() {
  var div = document.querySelector(".PopUps");

  var text = `<div id="PopUp" style="display:block; position:fixed; top:0; left:0; width:100%; height:100%; background-color: rgba(0,0,0,0.5);">
  <div style="display:block; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background-color:#fff; padding:50px;">
  <button class="btn " onclick="cerrarPopUp()" id="tancar">X</button>
    <img src="../img/juego2/pc_popup.png">
    <input id="input_resposta" type="text" style="position:absolute; top: 62%; left: 50% ;background-color:transparent; border:none; font-size: 40px; color: lightgreen;
    font-family: Monaco, monospace; transform: translate(-50%, -50%);" type="text" placeholder="Introdueix resposta">
    <button class="btn btn-primary" style="position:absolute; top: 80%; left: 50% ; font-size: 25px;
    transform: translate(-50%, -50%);" onclick="comprovaResposta2()">Comprova</button>
  </div>
  </div>`;
  div.innerHTML = text;
}
//PopUP RADIO
var radioOK = false;
function PopUpRadio() {
  var audio = document.getElementById('musica');
    if (audio.paused) {
      // Si el audio está pausado, comienza a reproducirlo
      audio.play();
    } else {
      // Si el audio se está reproduciendo, detenlo
      audio.pause();
    }
  radioOK = true;
  console.log("Radio activada");
}

//TANCAR POPUP RADIO
function cerrarPopUpRadio() {
  document.getElementById("PopUp").style.display = "none";
  //Serveix per parar el video al tancar el popup
  document.getElementById("miAudio").pause();
}
//FINESTRE PACMAN
function PopUpPacman() {
  if (radioOK == true && coinOK == true) {
      var width = 700;
      var height = 700;
      var left = (window.innerWidth / 2) - (width / 2);
      var top = (window.innerHeight / 2) - (height / 2);
      var url = "../pacman project/pacman.html";
      var options = "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top;
      window.open(url, "Mi Popup", options);

  }
}


