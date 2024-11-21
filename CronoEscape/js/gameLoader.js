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

                    cargar();

                    async function cargar() {
                        let checkPoint = await searchGame(currentUser);
                            console.log(checkPoint + " loaded")
                            //wait 2 seconds then proceeds with the next line of code
                            await new Promise(r => setTimeout(r, 2000));                            
                                
                            redirectToGame(checkPoint);
                        

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



/**funció searchGame(currentUser)
**busca si existeixen jocs per l'usuari actual, si no existeixen crea un nou joc i el carrega, 
**si existeixen carrega el joc amb checkpoint que no sigui 999(finalitzat), si tots els jocs estan finalitzats crea un nou joc i el carrega**/

async function searchGame(currentUser) {
    console.log("Buscant joc");
    let ownGames = await getOwnGames(currentUser);
    //si no existeixen jocs crea un nou joc i el pushea a la bd després carrega directament el checkpoint -1(sense inicialitzar)
    if (ownGames.length == 0) {
        console.log("creating first game");
        await createGame(currentUser, 0);
        loadGame(currentUser.user_uid + "1", -1);
        return "-1";
    }


    //per cada joc a ownGames mira si te checkpoint diferent de 999(finalitzat) llavors carrega el joc
    for (let game in ownGames) {
        if (ownGames[game].checkpoint != 999) {

            console.log("game found")


            let currentCheckpoint = ownGames[game].checkpoint;

            loadGame(currentUser.user_uid + ownGames[game].gameid, currentCheckpoint);
            return currentCheckpoint;
        }

    }
    //nomes arriva aqui si existeixen jocs pero no hi ha cap joc amb checkpoint diferent de 999(finalitzat)
    console.log("creating next game");
    let gameID = currentUser.user_uid + "" + (ownGames.length + 1);
    createGame(currentUser, ownGames.length);
    loadGame(gameID, -1);
    return "-1";

}



//crea un nou game amb id = currentUser.user_uid+(ownGames.length+1) i checkpoint = -1 (sense inicialitzar)
async function createGame(currentUser, ownGameslength) {
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



//gets all the games from the database and returns them in an array of objects
async function getOwnGames(user) {
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







async function redirectToGame(checkPoint) {
    let gameUrl = "joc.html";

    //check if the checkpoint corresponds to the checkpoint of the resposta1
    let data1 = httpRequest(`https://cronoescape-ioc-default-rtdb.europe-west1.firebasedatabase.app/respostes/resposta1/${checkPoint}/.json`);
    if (data1 != "null") {
        gameUrl = "joc1.html"
    }


    //check if the checkpoint corresponds to the checkpoint of the resposta2
    let data2 = httpRequest(`https://cronoescape-ioc-default-rtdb.europe-west1.firebasedatabase.app/respostes/resposta2/${checkPoint}/.json`);
    if (data2 != "null") {
        gameUrl = "joc2.html"
    }


    //check if the checkpoint corresponds to the checkpoint of the resposta3
    let data3 = httpRequest(`https://cronoescape-ioc-default-rtdb.europe-west1.firebasedatabase.app/respostes/resposta3/${checkPoint}/.json`);
    if (data3 != "null") {
        gameUrl = "final.html"
    }


    //redirects page to game url
    window.location.href = gameUrl;


}


// CALCUL TEMPS JOC

// Funció per obtenir la data actual.
function getCurrentDate() {
    const currentDate = new Date().getTime();
    return currentDate;
}
