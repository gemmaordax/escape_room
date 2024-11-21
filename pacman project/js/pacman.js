
$(carregaScript);

function carregaScript() {

    if (localStorage.getItem("pacman") != null) {
        //loads the snake animation on the grid
        console.log("solved");
        document.getElementById("grid").innerHTML = `<img src="../img/juego2/serp_noloop.gif"/>`;
        return;
    }





    const grid = document.getElementsByClassName('grid')[0];
    grid.innerHTML = "";
    const innerChomp = document.querySelector('.innerChomp');
    innerChomp.innerHTML = `<p id="restore" class="year">PLEASE, RESTORE THE TIME FLUX</p>`;




    for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = x + "," + y;
            grid.appendChild(cell);
            //cell.innerHTML = cell.id

        }
    }



    const char = document.createElement('img');

    char.src = 'img/pacman.gif';
    char.id = 'pacman';
    document.getElementById("0,0").appendChild(char);





    const portal = document.createElement("img");
    portal.src = "img/portal.gif";
    portal.id = "portal";
    document.getElementById("8,6").innerHTML = "";
    document.getElementById("8,6").appendChild(portal)

    document.getElementById("portal").style.transform = "rotate(180deg)";

    //I
    document.getElementById("2,2").classList.add('obstacle');
    document.getElementById("2,3").classList.add('obstacle');
    document.getElementById("2,4").classList.add('obstacle');
    document.getElementById("2,3").classList.add('obstacle');
    document.getElementById("3,3").classList.add('obstacle');
    document.getElementById("4,3").classList.add('obstacle');
    document.getElementById("5,2").classList.add('obstacle');
    document.getElementById("5,3").classList.add('obstacle');
    document.getElementById("5,4").classList.add('obstacle');

    //O
    document.getElementById("8,8").classList.add('porta');
    document.getElementById("6,6").classList.add('obstacle');
    document.getElementById("6,7").classList.add('obstacle');
    document.getElementById("7,5").classList.add('obstacle');
    document.getElementById("7,8").classList.add('obstacle');
    document.getElementById("8,5").classList.add('obstacle');
    document.getElementById("9,5").classList.add('obstacle');
    document.getElementById("10,6").classList.add('obstacle');
    document.getElementById("10,7").classList.add('obstacle');
    document.getElementById("9,8").classList.add('obstacle');

    //C
    document.getElementById("11,9").classList.add('obstacle');
    document.getElementById("12,9").classList.add('obstacle');
    document.getElementById("13,9").classList.add('obstacle');
    document.getElementById("10,12").classList.add('obstacle');
    document.getElementById("14,12").classList.add('obstacle');
    document.getElementById("10,10").classList.add('obstacle');
    document.getElementById("14,10").classList.add('obstacle');
    document.getElementById("10,11").classList.add('obstacle');
    document.getElementById("14,11").classList.add('obstacle');


    document.getElementById("7,6").innerHTML = `<div class="inner"></div>`
    document.getElementById("7,7").innerHTML = `<div class="inner"></div>`
    document.getElementById("8,7").innerHTML = `<div class="inner"></div>`
    document.getElementById("9,6").innerHTML = `<div class="inner"></div>`
    document.getElementById("9,7").innerHTML = `<div class="inner"></div>`
    document.getElementById("8,8").innerHTML = `<div class="tancada"></div><div class="tancada2"></div>`

    let years = document.getElementsByClassName("year");
    initObjectives();


    //genera los objetivos a recoger 
    function initObjectives() {

        //genera numeros aleatorios del 1993 al 2043 y los almacena en un array
        let valueYears = generateRandomYears();

        let objectives = [];

        let i = 0;
        while (i < valueYears.length - 1) {
            let div = document.getElementById(randomCoords());

            //si el div está vacio entonces meteremos un objetivo dentro
            if (!div.childNodes.length > 0 && !div.getAttribute("class").includes("obstacle")) {


                div.innerHTML = `<div class="objective" value='${valueYears[i]}'>${valueYears[i]}<div>`;
                objectives.push(parseInt(valueYears[i]));

                i++;

            }
        }


    }




    $(document).keydown(function (e) {

        if (e.keyCode == 37) {
            turnLeft();
        } else if (e.keyCode == 38) {
            turnUp();
        } else if (e.keyCode == 39) {
            turnRight();
        } else if (e.keyCode == 40) {
            turnDown();
        }
    });


    function turnLeft() {
        document.getElementById("pacman").style.transform = "rotate(180deg)";
        let currentPos = document.getElementById('pacman').parentElement.id;

        //si el div amd id currentPos te class obstacle llavors return


        nextPos = currentPos.split(",");
        nextPos[1] = parseInt(nextPos[1]) - 1;




        if (nextPos[1] < 0 || nextPos[1] > 15) {
            let sfx = new Audio("sfx/bump.mp3");
            sfx.play();
            return;
        }




        nextPos = nextPos.join(",");


        //pongo el pacman en el siguiente
        let nextDiv = document.getElementById(nextPos)

        //compruebo si nextPos tiene obstaculo
        if (nextDiv.getAttribute("class").includes("obstacle") || nextDiv.getAttribute("class").includes("porta")) {
            let sfx = new Audio("sfx/bump.mp3");
            sfx.play();
            return;
        }

        if (nextDiv.childNodes.length != 0 && nextDiv.childNodes[0].getAttribute("class") == "objective") {
            let sfx = new Audio("sfx/coin.mp3");
            sfx.play();
            let value = nextDiv.childNodes[0].getAttribute("value");
            document.getElementsByClassName("innerChomp")[0].innerHTML += `<p class="year">${value}</p>`;
        }
        //comentar
        nextDiv.innerHTML = "";



        nextDiv.appendChild(document.getElementById("pacman"));

        //borro el pacman del div anterior
        let currentDiv = document.getElementById(currentPos)
        currentDiv.innerHTML = "";

        let waka = new Audio("sfx/waka.mp3");
        waka.play();


        years = document.getElementsByClassName("year");
        if (years.length == 15) {
            //check if years is ordered from lowest to highest
            let ordered = true;
            for (let i = 0; i < years.length - 1; i++) {
                if (parseInt(years[i].innerHTML) > parseInt(years[i + 1].innerHTML)) {
                    ordered = false;
                    break;
                }
            }

            if (ordered) {
                document.getElementsByClassName("innerChomp")[0].innerHTML = "PORTA OBERTA, TIME FLUX RESTORED";
                let porta = document.getElementById("8,8")
                porta.innerHTML = "";
                //delete class porta from div porta
                porta.classList.remove('porta');
            } else {
                //inner chomp class shows ERROR
                gameOver();
            }







        }

        if (document.getElementById("8,6").innerHTML == "") {
            completeGame();
        }

    }

    function turnRight() {
        document.getElementById("pacman").style.transform = "rotate(0deg)";
        let currentPos = document.getElementById('pacman').parentElement.id;

        nextPos = currentPos.split(",");
        nextPos[1] = parseInt(nextPos[1]) + 1;
        if (nextPos[1] < 0 || nextPos[1] > 15) {
            let sfx = new Audio("sfx/bump.mp3");
            sfx.play();
            return;
        }
        nextPos = nextPos.join(",");



        //pongo el pacman en el siguiente
        let nextDiv = document.getElementById(nextPos)

        //compruebo si nextPos tiene obstaculo
        if (nextDiv.getAttribute("class").includes("obstacle") || nextDiv.getAttribute("class").includes("porta")) {
            let sfx = new Audio("sfx/bump.mp3");
            sfx.play();
            return;
        }

        if (nextDiv.childNodes.length != 0 && nextDiv.childNodes[0].getAttribute("class") == "objective") {
            let sfx = new Audio("sfx/coin.mp3");
            sfx.play();
            let value = nextDiv.childNodes[0].getAttribute("value");
            document.getElementsByClassName("innerChomp")[0].innerHTML += `<p class="year">${value}</p>`;

        }

        //comentar
        nextDiv.innerHTML = "";




        nextDiv.appendChild(document.getElementById("pacman"));
        //borro el pacman del div anterior
        let currentDiv = document.getElementById(currentPos)
        currentDiv.innerHTML = "";

        let waka = new Audio("sfx/waka.mp3");
        waka.play();

        let years = document.getElementsByClassName("year");
        if (years.length == 15) {
            //check if years is ordered from lowest to highest
            let ordered = true;
            for (let i = 0; i < years.length - 1; i++) {
                if (parseInt(years[i].innerHTML) > parseInt(years[i + 1].innerHTML)) {
                    ordered = false;
                    break;
                }
            }

            if (ordered) {
                document.getElementsByClassName("innerChomp")[0].innerHTML = "PORTA OBERTA, TIME FLUX RESTORED";
                let porta = document.getElementById("8,8")
                porta.innerHTML = "";
                //delete class porta from div porta
                porta.classList.remove('porta');
            } else {
                //inner chomp class shows ERROR
                gameOver();

            }







        }

        if (document.getElementById("8,6").innerHTML == "") {
            completeGame();
        }

    }


    function turnUp() {
        document.getElementById("pacman").style.transform = "rotate(-90deg)";
        let currentPos = document.getElementById('pacman').parentElement.id;

        nextPos = currentPos.split(",");
        nextPos[0] = parseInt(nextPos[0]) - 1;
        if (nextPos[0] < 0 || nextPos[0] > 15) {
            let sfx = new Audio("sfx/bump.mp3");
            sfx.play();
            return;
        }
        nextPos = nextPos.join(",");

        //pongo el pacman en el siguiente
        let nextDiv = document.getElementById(nextPos)

        //compruebo si nextPos tiene obstaculo
        if (nextDiv.getAttribute("class").includes("obstacle") || nextDiv.getAttribute("class").includes("porta")) {
            let sfx = new Audio("sfx/bump.mp3");
            sfx.play();
            return;
        }



        if (nextDiv.childNodes.length != 0 && nextDiv.childNodes[0].getAttribute("class") == "objective") {
            let sfx = new Audio("sfx/coin.mp3");
            sfx.play();
            let value = nextDiv.childNodes[0].getAttribute("value");
            document.getElementsByClassName("innerChomp")[0].innerHTML += `<p class="year">${value}</p>`;
        }

        //comentar
        nextDiv.innerHTML = "";



        nextDiv.appendChild(document.getElementById("pacman"));
        //borro el pacman del div anterior
        let currentDiv = document.getElementById(currentPos)
        currentDiv.innerHTML = "";

        let waka = new Audio("sfx/waka.mp3");
        waka.play();


        let years = document.getElementsByClassName("year");
        if (years.length == 15) {
            //check if years is ordered from lowest to highest
            let ordered = true;
            for (let i = 0; i < years.length - 1; i++) {
                if (parseInt(years[i].innerHTML) > parseInt(years[i + 1].innerHTML)) {
                    ordered = false;
                    break;
                }
            }

            if (ordered) {
                document.getElementsByClassName("innerChomp")[0].innerHTML = "PORTA OBERTA, TIME FLUX RESTORED";
                let porta = document.getElementById("8,8")
                porta.innerHTML = "";
                //delete class porta from div porta
                porta.classList.remove('porta');

            } else {
                //inner chomp class shows ERROR
                gameOver();
            }







        }

        if (document.getElementById("8,6").innerHTML == "") {
            completeGame();
        }
    }


    function turnDown() {

        document.getElementById("pacman").style.transform = "rotate(90deg)";
        let currentPos = document.getElementById('pacman').parentElement.id;

        nextPos = currentPos.split(",");
        nextPos[0] = parseInt(nextPos[0]) + 1;
        if (nextPos[0] < 0 || nextPos[0] > 15) {
            let sfx = new Audio("sfx/bump.mp3");
            sfx.play();
            return;
        }

        nextPos = nextPos.join(",");


        //pongo el pacman en el siguiente
        let nextDiv = document.getElementById(nextPos)

        //compruebo si nextPos tiene obstaculo
        if (nextDiv.getAttribute("class").includes("obstacle") || nextDiv.getAttribute("class").includes("porta")) {
            let sfx = new Audio("sfx/bump.mp3");
            sfx.play();
            return;
        }



        if (nextDiv.childNodes.length != 0 && nextDiv.childNodes[0].getAttribute("class") == "objective") {
            let sfx = new Audio("sfx/coin.mp3");
            sfx.play();
            let value = nextDiv.childNodes[0].getAttribute("value");
            document.getElementsByClassName("innerChomp")[0].innerHTML += `<p class="year">${value}</p>`;

        }

        //comentar
        nextDiv.innerHTML = "";



        nextDiv.appendChild(document.getElementById("pacman"));
        //borro el pacman del div anterior
        let currentDiv = document.getElementById(currentPos)
        currentDiv.innerHTML = "";

        let waka = new Audio("sfx/waka.mp3");
        waka.play();


        let years = document.getElementsByClassName("year");

        if (years.length == 15) {
            //check if years is ordered from lowest to highest
            let ordered = true;
            for (let i = 0; i < years.length - 1; i++) {
                if (parseInt(years[i].innerHTML) > parseInt(years[i + 1].innerHTML)) {
                    ordered = false;
                    break;
                }
            }

            if (ordered) {
                document.getElementsByClassName("innerChomp")[0].innerHTML = "PORTA OBERTA, TIME FLUX RESTORED";
                let porta = document.getElementById("8,8")
                porta.innerHTML = "";
                //delete class porta from div porta
                porta.classList.remove('porta');


            } else {
                //inner chomp class shows ERROR
                gameOver();
            }





        }


        if (document.getElementById("8,6").innerHTML == "") {
            completeGame();
        }

    }






}


function completeGame() {
    let vic = new Audio("sfx/victory.mp3");
    vic.play();
    localStorage.setItem("pacman", "completed");
    console.log(localStorage.getItem("pacman"));
    //wait 3 seconds and reload page
    setTimeout(function () {
        location.reload();
    }, 3000);




}


function randomCoords() {
    let str = getRandomNumber() + "," + getRandomNumber();
    return str;
}

function getRandomNumber() {
    return Math.floor(Math.random() * 16);
}


function generateRandomYears() {
    const numbers = [];

    // Loop until we have generated 40 unique numbers
    while (numbers.length < 15) {
        const randomNumber = Math.floor(Math.random() * 51) + 1993;

        // Check if the number is already in the array
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }

    return numbers;
}

function gameOver() {
    let missatge = document.getElementsByClassName("innerChomp")[0];
    //missatge style will be red and bold
    missatge.innerHTML = "ERROR, TIME FLUX NOT RESTORED";
    missatge.style.color = 'red';
    document.getElementById("pacman").style.transform = "rotate(0deg)";
    document.getElementById("pacman").src = "img/gameover.png";

    let deathSound = new Audio("sfx/death.mp3");
    deathSound.play();

    deathSound.onended = function () {
        location.reload();
    };

}


