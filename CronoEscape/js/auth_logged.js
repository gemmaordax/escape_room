//import all modules needed for a phone aut


import { } from "https://www.gstatic.com/firebasejs/6.0.2/firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";





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

//FIN LOGOUT METHODS
//////////////////////////////////////////

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
                        user_IP: snapshot.val().user_IP.toString(),
                         avatar: snapshot.val().avatar.toString()

                    }
                    //si la url es user_profile carrega les dades de l'usuari i els jocs, si conté joc.html carrega el joc
                    if (!window.location.href.includes("/joc") && !window.location.href.includes("/game_loader.html")) {
                        renderUserData(currentUser);
                        renderUserGames(currentUser);
                        return;
                    }

                    


                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

        }

    });

}

//ESTA FUNCION PINTA LOS DATOS DEL USUARIO EN EL PERFIL
function renderUserData(currentUser) {

    document.getElementById("userName-container").innerHTML += ` ${currentUser.userName}`

    // Mostra el correu de l'usuari
    document.getElementById("userEmailText").innerHTML += ` ${currentUser.email}`;
    // Mostra la data de creació de l'usuari
    document.getElementById("userCreationDate").innerHTML += ` ${currentUser.dateOfCreation}`;
    // Mostra el total de partides que ha realitzat l'usuari
    const numGamesPlayed = getOwnGames(currentUser).length;
    document.getElementById("games-played").innerHTML += ` ${numGamesPlayed}`;
    // Assignem avatar amb el numero random que s'ha seleccionat aleatoriament al register
    let avatar = document.getElementById("imatge-avatar");
    avatar.src = `../img/avatar${currentUser.avatar}.png`;
}


//FIN USER PROFILE METHODS
//////////////////////////////////////////





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

//function to check if the data exists in the database
function dataExists(url) {
    let data = httpRequest(url);
    if (data != "null") {
        return true;
    } else {
        return false;
    }
}


//FIN HTTP REQUEST METHODS
//////////////////////////////////////////

/////////////////////////////////////////
//GAME METHODS

let PlayButton = document.getElementById("game-start");
if (PlayButton != null) {
    PlayButton.addEventListener('click', (e) => {
        window.location.href = "game_loader.html";

    });
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

    let gamesContainer = document.getElementById("gamesContainer");

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



// Funció per calcular el temps empleat jugant accepta 2 parametres en milisegons startDate.getTime() i endDate.getTime().
function tempsTotal(startDate, endDate) {
    const calculTemps = endDate - startDate; // Diferència en milisegons.
    const tempsSegons = calculTemps / 1000; // Convertim a segons.
    const hores = Math.floor(tempsSegons / 3600); // Convertim a hores.
    const minuts = Math.floor((tempsSegons - (hores * 3600)) / 60); // Convertim a minuts.
    const segons = Math.floor(tempsSegons - (hores * 3600) - (minuts * 60)); // Convertim a segons.
    //retorna un string amb el temps total en format "HH:MM:SS"
    return `${hores}:${minuts}:${segons}`;
}

// Funció per convertir de date a string "HH:MM:SS".
function dateToString(date) {
    const hores = date.getHours();
    const minuts = date.getMinutes();
    const segons = date.getSeconds();
    return `${hores}:${minuts}:${segons}`;
}

// Funció per convertir de string "HH:MM:SS" a date en milisegons.
function stringToDate(str) {
    const [hores, minuts, segons] = str.split(':');
    const date = new Date();
    date.setHours(hores);
    date.setMinutes(minuts);
    date.setSeconds(segons);
    return date;
}



