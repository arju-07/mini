import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyAqBwJ316Q4aS0mObljnGZZ7HXVNb_YsPk",

    authDomain: "mini-671ab.firebaseapp.com",

    projectId: "mini-671ab",

    storageBucket: "mini-671ab.firebasestorage.app",

    messagingSenderId: "695395147041",

    appId: "1:695395147041:web:890101007e91df8d543260"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

//submit button
const submitBtn = document.getElementById('submit-btn');
submitBtn.addEventListener('click', function (event) {
    event.preventDefault();
    alert(5)
})