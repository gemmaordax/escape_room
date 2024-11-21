import { } from "https://www.gstatic.com/firebasejs/6.0.2/firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

if (window.localStorage.getItem('id') == null) {
    //redirect to the login.html page if the user is not logged in
    window.location.href = "login.html";
}


const firebaseConfig = {
    apiKey: "AIzaSyDp_QjlZP6cah2JBQLIXKSbfKtOIUfZ4Tw",
    authDomain: "cronoescape-ioc.firebaseapp.com",
    databaseURL: "https://cronoescape-ioc-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cronoescape-ioc",
    storageBucket: "cronoescape-ioc.appspot.com",
    messagingSenderId: "240259839325",
    appId: "1:240259839325:web:20ef18366fd73d2aa2a4b4",
    measurementId: "G-QQD81WK4CE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

///////////////////////////////////
//LOGOUT METHODS
let logoutButton = document.getElementById("logout-button");
//logout user
if (logoutButton != null) {
    logoutButton.addEventListener('click', (e) => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("logged Out");
            localStorage.clear();
            window.location.href = "login.html";
        }).catch((error) => {
            console.log("error al desloguejar");
        });
    });

}

//////////////////////////////////////////
//USER PROFILE METHODS

let user_uid = window.localStorage.getItem('id');
//retrieve user data from database to display in the user profile

getCurrentUserData(auth);


//function to get the user email from the firebase database
function getCurrentUserData(auth) {
    let currentUser = new Object();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            //retrieve data from database
            const dbRef = ref(database, 'users/' + user.uid);
            get(dbRef).then((snapshot) => {
                if (snapshot.exists()) {

                    currentUser = {
                        user_uid: uid,
                        dateOfCreation: snapshot.val().dateOfCreation.toString(),
                        email: snapshot.val().email.toString(),
                        last_login: snapshot.val().last_login.toString(),
                        oldUserUID: snapshot.val().oldUserUID.toString(),
                        phone: snapshot.val().phone.toString(),
                        userName: snapshot.val().userName.toString(),
                        user_IP: snapshot.val().user_IP.toString()
                    }
                    //si la url es user_profile carrega les dades de l'usuari i els jocs, si conté joc.html carrega el joc
                    if (!window.location.href.includes("/joc.html") && !window.location.href.includes("/game_loader.html")) {

                        let newCheckpoint = 999;
                        let gameID = localStorage.getItem("gameID");

                        const url = `https://cronoescape-ioc-default-rtdb.europe-west1.firebasedatabase.app/games/${gameID}/.json`;

                        let game = JSON.parse(httpRequest(url));

                        game.checkpoint = newCheckpoint;
                        game.fechaFin = getCurrentDate();

                        let calculo = game.fechaFin - game.fechaInicio;

                        game.duracion = dateToString(calculo);
                        //convert the time in milliseconds to a string with the format hh:mm:ss


                        updateGame(game);


                        async function updateGame(game) {
                            const dbRef = ref(database, 'games/' + gameID);
                            await new Promise(r => setTimeout(r, 1000));

                            update(dbRef, game);
                            await new Promise(r => setTimeout(r, 1000));

                            renderUserData(currentUser, calculo);
                            await new Promise(r => setTimeout(r, 1000));
                            renderUserGames(currentUser);

                        }
                        return;
                    }

                    searchGame(currentUser);


                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

        }

    });

}




let calculo;

//ESTA FUNCION PINTA LOS DATOS DEL USUARIO EN EL PERFIL
function renderUserData(currentUser, calculo) {
  //convertima  hores i minuts els milisegons
    let tempsFinal = convertirMinuts(calculo);

    document.getElementById("tempsTotal").innerHTML = tempsFinal;

    //Convertim nom usuari en majúscula
    document.getElementById("userName-container").innerHTML += ` ${currentUser.userName.toUpperCase()}`

    // Si no hi ha cap joc en marxa surt de la funció
    if (document.getElementById("games-played") == null) {
        return;
    }


    // Mostra el correu de l'usuari
    document.getElementById("userEmailText").innerHTML += ` ${currentUser.email}`;
    // Mostra la data de creació de l'usuari
    document.getElementById("userCreationDate").innerHTML += ` ${currentUser.dateOfCreation}`;
    // Mostra el total de partides que ha realitzat l'usuari
    const numGamesPlayed = getOwnGames(currentUser).length;
    document.getElementById("games-played").innerHTML += ` ${numGamesPlayed}`;

}

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

//function to check if the data exists in the database
function dataExists(url) {
    let data = httpRequest(url);
    if (data != "null") {
        return true;
    } else {
        return false;
    }
}

/////////////////////////////////////////
//GAME METHODS


/**funció searchGame(currentUser)
**busca si existeixen jocs per l'usuari actual, si no existeixen crea un nou joc i el carrega, 
**si existeixen carrega el joc amb checkpoint que no sigui 999(finalitzat), si tots els jocs estan finalitzats crea un nou joc i el carrega**/
function searchGame(currentUser) {
    console.log("Buscant joc");
    let ownGames = getOwnGames(currentUser);
    //si no existeixen jocs crea un nou joc i el pushea a la bd després carrega directament el checkpoint -1(sense inicialitzar)
    if (ownGames.length == 0) {
        console.log("creating first game");
        createGame(currentUser, 0);
        loadGame(currentUser.user_uid + "1", -1);
        return;
    }


    //per cada joc a ownGames mira si te checkpoint diferent de 999(finalitzat) llavors carrega el joc
    for (let game in ownGames) {
        if (ownGames[game].checkpoint != 999) {

            console.log("game found")


            let currentCheckpoint = ownGames[game].checkpoint;

            loadGame(currentUser.user_uid + ownGames[game].gameid, currentCheckpoint);
            return;
        }
    }
    //nomes arriva aqui si existeixen jocs pero no hi ha cap joc amb checkpoint diferent de 999(finalitzat)
    console.log("creating next game");
    let gameID = currentUser.user_uid + "" + (ownGames.length + 1);
    createGame(currentUser, ownGames.length);
    loadGame(gameID, -1);
}


//crea un nou game amb id = currentUser.user_uid+(ownGames.length+1) i checkpoint = -1 (sense inicialitzar)
function createGame(currentUser, ownGameslength) {
    let gameID = parseInt(ownGameslength) + 1;
    let uid = currentUser.user_uid + gameID.toString();

    let game = {
        game_uid: uid,
        checkpoint: `${-1}`,
        duracion: "null",
        fechaFin: "null",
        fechaInicio: getCurrentDate(),
        gameid: gameID,
        userName: currentUser.userName,
        user_ip: currentUser.user_IP,
        useruid: currentUser.user_uid
    }

    console.log("enregistrant joc a la base de dades");
    //enregistra el new game a la base de dades de games
    set(ref(database, 'games/' + game.game_uid), {
        checkpoint: game.checkpoint,
        duracion: game.duracion,
        fechaFin: game.fechaFin,
        fechaInicio: game.fechaInicio,
        gameid: game.gameid,
        userName: game.userName,
        user_ip: game.user_ip,
        useruid: game.useruid
    })

    console.log("joc enregistrat a la base de dades");
};

//carrega el joc amb el checkpoint especificat, carrega les variables a utilizar en els jocs i re
function loadGame(gameID, checkPoint) {

    localStorage.setItem("checkPoint", checkPoint);
    localStorage.setItem("gameID", gameID);
}

function renderUserGames(user) {
    let ranking = getOwnGames(user);
    //function to get ownRanking(user) entries inside ranking variable were ownRanking[i].duracion == null(no finalitzat) are removed and rendered
    for (let i = 0; i < ranking.length; i++) {

        if (ranking[i].checkpoint != 999) {
            ranking.splice(i, 1);
            i--;
        }
    }

    //sort ranking by time   
    ranking.sort(function (a, b) {
        let aTime;
        let bTime;
        // Ordanem les partides 
        if (a.duracion == undefined) {
            aTime = new Array(3);
            aTime[0] = 60;
            aTime[1] = 60;
            aTime[2] = 60;
        } else {
            aTime = a.duracion.split(":");
        }

        if (b.duracion == undefined) {
            bTime = new Array(3);
            bTime[0] = 60;
            bTime[1] = 60;
            bTime[2] = 60;
        } else {
            bTime = b.duracion.split(":");
        }

        let aSeconds = (+aTime[0]) * 60 * 60 + (+aTime[1]) * 60 + (+aTime[2]);
        let bSeconds = (+bTime[0]) * 60 * 60 + (+bTime[1]) * 60 + (+bTime[2]);
        return aSeconds - bSeconds;
    });

    let gamesContainer = document.getElementById("rankingPersonal");

    let userName;
    let duracion;

    let htmlRanking = "";

    //games container innerHTML has a table with userName, duracion 
    htmlRanking +=
        `<table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Posició</th>
          <th scope="col">Usuari</th>
          <th scope="col">Temps</th>
        </tr>
      </thead>
      <tbody>`;


    //renders all ranking entries in the gamesContainer div
    for (let game in ranking) {

        userName = ranking[game].userName;
        duracion = ranking[game].duracion;
        //Li diem que si la partida no ha estat acabada no imprimeixi cap temps i ens avisi
        if (duracion == undefined) {
            duracion = "Partida sense acabar";
        }

        //create an entry on the table with id "rankingTable" adding a th with the userName, duracion 
        htmlRanking += `
      <tr>
        <th scope="row">${parseInt(game) + 1}</th>
        <td>${userName}</td>
        <td>${duracion}</td>
      </tr>`;

    }
    htmlRanking +=
        ` </tbody>
  </table>`

    gamesContainer.innerHTML += htmlRanking;

}


//gets all the games from the database and returns them in an array of objects
function getOwnGames(user) {
    let url = `${firebaseConfig.databaseURL}/games/.json`;
    let response = httpRequest(url);
    let jsonGames = JSON.parse(response);
    let ownGames = [];
    //console log all of the attribute gameid of the games in the database
    for (let game in jsonGames) {
        let gameUrl = `${firebaseConfig.databaseURL}/games/${game}/.json`;

        let gameObj = JSON.parse(httpRequest(gameUrl));

        if (gameObj.useruid == user.user_uid || gameObj.useruid == user.oldUserUID) {
            ownGames.push(gameObj);
        }


    }
    return (ownGames);
};
//FIN GAME METHODS

// CALCUL TEMPS JOC

// Funció per obtenir la data actual.
function getCurrentDate() {
    const currentDate = new Date().getTime();
    return currentDate;
}



//function to given a date in miliseconds returns a string in format "HH:MM:SS" always with 2 digits
function dateToString(date) {
    let hores = date / 1000 / 60 / 60;
    let minuts = (hores - Math.floor(hores)) * 60;
    let segons = (minuts - Math.floor(minuts)) * 60;
    hores = Math.floor(hores);
    minuts = Math.floor(minuts);
    segons = Math.floor(segons);
    if (hores < 10) {
        hores = "0" + hores;
    }
    if (minuts < 10) {
        minuts = "0" + minuts;
    }
    if (segons < 10) {
        segons = "0" + segons;
    }
    return `${hores}:${minuts}:${segons}`;
}

//Funcio que converteix milisegons a hores i minuts
function convertirMinuts(milisegons) {
    const hores = Math.floor(milisegons / (1000 * 60 * 60));
    const minuts = Math.floor((milisegons % (1000 * 60 * 60)) / (1000 * 60));
    return `${hores} hores i ${minuts} minuts`;
}
  
  



let botoPerfil = document.getElementById("final-perfil");
if (botoPerfil != null) {
    botoPerfil.addEventListener('click', (e) => {
        window.location.href = "user_profile.html";

    });
}
let botoRanking = document.getElementById("final-Ranking");
if (botoRanking != null) {
    botoRanking.addEventListener('click', (e) => {
        window.location.href = "global_ranking.html";

    });
}
