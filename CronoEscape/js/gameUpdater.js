

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



let newCheckpoint = localStorage.getItem("checkPoint");
let gameID = localStorage.getItem("gameID");

const url = `https://cronoescape-ioc-default-rtdb.europe-west1.firebasedatabase.app/games/${gameID}/.json`;

let game = JSON.parse(httpRequest(url));

game.checkpoint = newCheckpoint;

updateGame(game);
//redirects to game_loader.html

function redirect(){
    window.location.href = "game_loader.html";
}

async function updateGame(game){
    const dbRef = ref(database, 'games/' + gameID);
    //after update, redirect to game_loader.html
    await update(dbRef, game);
    redirect();
    
    
    

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