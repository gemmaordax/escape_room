//import all modules needed for a phone aut
import { } from "https://www.gstatic.com/firebasejs/6.0.2/firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";



//redirect to the user_profile.html page if the user is already logged in
let user_uid = window.localStorage.getItem('id');
if (user_uid != null) {
    window.location.href = "user_profile.html";

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
//LOGIN/LOGOUT METHODS
let loginButton = document.getElementById("login-button");

if (loginButton != null) {
    loginButton.addEventListener('click', ingresar);
}

function ingresar() {
    let emailLogin = document.getElementById("email").value;
    let passwordLogin = document.getElementById("password").value;
    login(auth, emailLogin, passwordLogin);
}



function login(auth, emailLogin, passwordLogin) {
    document.getElementById("missatgeError").innerHTML = "";
    signInWithEmailAndPassword(auth, emailLogin, passwordLogin)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...

            // save log in details into real time database
            let lgDate = new Date();
            update(ref(database, 'users/' + user.uid), {
                last_login: lgDate,
            })
                .then(() => {
                    // Data saved successfully!
                    console.log('user logged in successfully');
                    //save the token in the local storage
                    window.localStorage.setItem('id', user.uid);
                    //redirects to user_profile.html
                    window.location.href = "user_profile.html";
                })
                .catch((error) => {
                    // The write failed...
                    console.log("error");
                    document.getElementById("missatgeError").innerHTML= "Error d'autenticació, sisplau revisa els camps";
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            document.getElementById("missatgeError").innerHTML= "Error d'autenticació, sisplau revisa els camps";
        });
}



//FIN LOGIN LOGOUT METHODS
//////////////////////////////////////////