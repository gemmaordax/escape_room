//import all modules needed 
import { } from "https://www.gstatic.com/firebasejs/6.0.2/firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

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


//gets all the games from the database and returns them in an array of objects
function getAllGames() {
  let url = `${firebaseConfig.databaseURL}/games/.json`;
  let response = httpRequest(url);
  let jsonGames = JSON.parse(response);
  let allGames = [];
  //console log all of the attribute gameid of the games in the database
  for (let game in jsonGames) {
    let gameUrl = `${firebaseConfig.databaseURL}/games/${game}/.json`;
    let gameObj = JSON.parse(httpRequest(gameUrl));
    allGames.push(gameObj);
  }
  return allGames;
};




function getGlobalRanking() {
  let ranking = [];
  let allGames = getAllGames();
  for (let game in allGames) {//ONLY FOR THE FIRST ID=1 GAME AND FINISHED GAMES (CHECKPOINT=999)
    if (allGames[game].gameid === 1 && allGames[game].checkpoint === 999) {
      ranking.push(allGames[game]);
    };
  }


  //order the ranking by the duracion attibute, the atribute format is "hh:mm:ss"
  ranking.sort(function (a, b) {
    let aTime = a.duracion.split(":");
    let bTime = b.duracion.split(":");
    let aSeconds = (+aTime[0]) * 60 * 60 + (+aTime[1]) * 60 + (+aTime[2]);
    let bSeconds = (+bTime[0]) * 60 * 60 + (+bTime[1]) * 60 + (+bTime[2]);
    return aSeconds - bSeconds;
  });

  return ranking;
}

function renderRanking(ranking) {
  let gamesContainer = document.getElementById("gamesContainer");

  let userName;
  let duracion;
  let rankingSize = 5;



  //if the current page is global_ranking.html then the maxRanking is 10, if it is my_ranking.html then the maxRanking is 100
  if (window.location.href.includes("global_ranking.html")){
    rankingSize = 100;
  };
    
  
  

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
    

    if (game >= rankingSize) {
      
      break;
    }


    userName = ranking[game].userName;
    duracion = ranking[game].duracion;
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

renderRanking(getGlobalRanking());














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

