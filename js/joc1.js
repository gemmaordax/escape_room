function cambiarImatge() {
  var imagen = document.querySelector(".maquina");
  var so = document.getElementById("so");
  if (
    bgImgContainer.style.backgroundImage ===
    'url("../img/juego1/fondo_presente.jpg")'
  ) {
    //Llum encesa
    if (imagen.getAttribute("src") == "../img/juego1/on/maquina_on.png") {
      imagen.setAttribute("src", "../img/juego1/on/maquina_off.png");
      imagen.setAttribute("id", "maquinaOFF");
    } else {
      imagen.setAttribute("src", "../img/juego1/on/maquina_on.png");
      imagen.setAttribute("id", "maquinaON");
    }
  } else {
    //Llum apagada
    if (imagen.getAttribute("src") == "../img/juego1/off/maquina_on.png") {
      imagen.setAttribute("src", "../img/juego1/off/maquina_off.png");
      imagen.setAttribute("id", "maquinaOFF");
    } else {
      imagen.setAttribute("src", "../img/juego1/off/maquina_on.png");
      imagen.setAttribute("id", "maquinaON");
    }
  }
  so.play();
}

function apagarLlum() {
  var maquina = document.querySelector(".maquina"); // Obtener la imagen con la clase "maquina"
  var tablet = document.querySelector(".tablet"); // Obtener la imagen con la clase "tablet"
  var pc = document.querySelector(".pc");
  var photo = document.querySelector(".photo");
  var interruptor = document.querySelector(".interruptor");
  var bgImgContainer = document.getElementById("bgImgContainer");

  var so2 = document.getElementById("so-interruptor");

  if (
    bgImgContainer.style.backgroundImage ===
    'url("../img/juego1/fondo_presente_off.jpg")'
  ) {
    //S'engega llum
    if (maquina.id == "maquinaON") {
      maquina.setAttribute("src", "../img/juego1/on/maquina_on.png");
    } else {
      maquina.setAttribute("src", "../img/juego1/on/maquina_off.png");
    }

    tablet.setAttribute("src", "../img/juego1/on/tablet.png");
    pc.setAttribute("src", "../img/juego1/on/pc.png");
    photo.setAttribute("src", "../img/juego1/on/polaroid.png");
    interruptor.setAttribute("src", "../img/juego1/on/interruptor.png");
    bgImgContainer.style.backgroundImage =
      'url("../img/juego1/fondo_presente.jpg")';
  } else {
    //S'apaga llum
    if (maquina.id == "maquinaON") {
      maquina.setAttribute("src", "../img/juego1/off/maquina_on.png");
    } else {
      maquina.setAttribute("src", "../img/juego1/off/maquina_off.png");
    }
    tablet.setAttribute("src", "../img/juego1/off/tablet.png");
    pc.setAttribute("src", "../img/juego1/off/pc.png");
    photo.setAttribute("src", "../img/juego1/off/polaroid.png");
    interruptor.setAttribute("src", "../img/juego1/off/interruptor.png");
    bgImgContainer.style.backgroundImage =
      'url("../img/juego1/fondo_presente_off.jpg")';
  }
  so2.play();
}



