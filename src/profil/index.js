import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import { getDatabase, set, ref, child , get, push, update, increment, onChildAdded } from "firebase/database";
import './index.css';

const firebaseConfig = {
  apiKey: "AIzaSyB3wQrFPiz1gooQqe2gyrBNtAK4R-PoIAI",
  authDomain: "noten-wetten.firebaseapp.com",
  databaseURL: "https://noten-wetten-default-rtdb.firebaseio.com",
  projectId: "noten-wetten",
  storageBucket: "noten-wetten.appspot.com",
  messagingSenderId: "872335913403",
  appId: "1:872335913403:web:f8cb53e49086b32f22149e"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
const reference = ref(database)

let name
let username
let punkte
let hasAdmin
let gewonnene_wette
let verlorene_wette
let jahrgang
let navbar = document.querySelector(".navbar")

onAuthStateChanged(auth, (user) => {
    if (user) {
    let uid = user.uid;


getuserdata()
function getuserdata() {
    
    const userRef = ref(database, "users/" + uid);
    
        
    get(userRef)
        .then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            hasAdmin = userData.hasAdmin;
            name = userData.name;
            username = userData.username;
            punkte = userData.punkte;
            gewonnene_wette = userData.gewonnene_Wetten
            verlorene_wette = userData.verlorene_Wetten
            jahrgang = userData.jahrgang
            

            if(hasAdmin){
              checkWidth()
            }
                
          }
        })
        .then(() =>{
          var profile_menuButton = document.querySelector("[data-menu-button-profile]");
          var profile_menu = document.querySelector(".profile-menu");

          const secondChild = profile_menu.querySelectorAll('a')[1];
          secondChild.textContent = "Punkte: " + punkte
          var gewonnen_container = document.getElementById("gewonnen")
          gewonnen_container.innerHTML = "gewonnene Wetten: " + gewonnene_wette + "<br> verlorene Wetten: " + verlorene_wette
          var name_container = document.getElementById("name")
          name_container.innerHTML = username
          var punkte_container = document.getElementById("punkte")
          punkte_container.innerHTML = "Punkte: " + punkte

          onChildAdded(child(reference, "wetten"),(element) => {
            let data = element.val();
            if(data.beendet == "beendet" && jahrgang == data.jahrgang){
            createDiv_finished(data.finale_note, data.Fach, data.KlausurNr, data.Person, element.key);
            }
          })  
        })
        
      }


  
  //-----------------------------------------------------------------------------------------------------------------------------------





const section2 = document.querySelector('[data-finished]')

function createDiv_finished(finale_note, fach, klausurNr, person, key) {
   console.log("wettenId" + key);
   const neue_wette = document.createElement('div');
   neue_wette.classList.add("container");
   section2.appendChild(neue_wette);
   let pPerson = document.createElement('p');
   pPerson.textContent = person;
   neue_wette.appendChild(pPerson);
   let pklausurNr = document.createElement('p');
   pklausurNr.textContent = klausurNr +". " + fach;
   neue_wette.appendChild(pklausurNr);
   let pFinale_Note = document.createElement('p');
   pFinale_Note.innerHTML = "Punktzahl " + "<br>" + finale_note
   neue_wette.appendChild(pFinale_Note);
}
}
 else {
    window.location.href = "../login/index.html";
  }
});




function toggleMenu() {
    event.preventDefault();
    var dropdownMenu = document.querySelector(".dropdown-menu");
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
}

var menuButton = document.querySelector("[data-menu-button]");
menuButton.addEventListener("click", toggleMenu);


function toggleMenuProfile() {
  event.preventDefault();
  var profile_menu = document.querySelector(".profile-menu");
  profile_menu.style.display = profile_menu.style.display === "block" ? "none" : "block";
}

var profile_menuButton = document.querySelector("[data-menu-button-profile]");
profile_menuButton.addEventListener("click", toggleMenuProfile);

function checkWidth() {
  var dropdownMenu = document.querySelector(".dropdown-menu");
    if (window.innerWidth < 768) {
        dropdownMenu.style.display = "none";
    }

    if (window.innerWidth > 768 && hasAdmin) {
      const erstellen_button = navbar.querySelectorAll('a')[2]
      erstellen_button.style.display = "block"
      const admin_button = navbar.querySelectorAll('a')[4]
      admin_button.style.display = "block"
      console.log("success")


      const dropdwn_erstellen_button = dropdownMenu.querySelectorAll('a')[1]
      dropdwn_erstellen_button.style.display = "none"
      const dropdwn_admin_button = dropdownMenu.querySelectorAll('a')[3]
      dropdwn_admin_button.style.display = "none"
      console.log("success")
      
  }
  else{
    const erstellen_button = navbar.querySelectorAll('a')[2]
    erstellen_button.style.display = "none"
    const admin_button = navbar.querySelectorAll('a')[4]
    admin_button.style.display = "none"

    const dropdwn_erstellen_button = dropdownMenu.querySelectorAll('a')[1]
    dropdwn_erstellen_button.style.display = "block"
    const dropdwn_admin_button = dropdownMenu.querySelectorAll('a')[3]
    dropdwn_admin_button.style.display = "block"

    console.log("success 2")

  }
}

window.addEventListener("load", checkWidth);
window.addEventListener("resize", checkWidth);
window.addEventListener("load",colorswitch);

const root = document.documentElement;
const switcher = document.getElementById("color_switcher").addEventListener("click",colorswitch)



function colorswitch() {
  let switch_button = document.getElementById("color_switcher")
  event.preventDefault()
  if (switch_button.hasAttribute('data-button-active')) {
    root.style.setProperty("--text", "white");
    root.style.setProperty("--background", "#181818")
    root.style.setProperty("--primary", "#3d3d3d")
    root.style.setProperty("--secondary", "#212121")
    root.style.setProperty("--accent", "#75ff75")
    root.style.setProperty("--white", "white")
    root.style.setProperty("--shadow", "black")
    switch_button.removeAttribute('data-button-active')
    switch_button.style.backgroundColor = "#ebbcb2"
  } else {
    root.style.setProperty("--text", "#080302");
    root.style.setProperty("--background", "#fefbfb")
    root.style.setProperty("--primary", "#9ed9e6")
    root.style.setProperty("--secondary", "#ebbcb2")
    root.style.setProperty("--accent", "#2b90a6")
    root.style.setProperty("--white", "white")
    root.style.setProperty("--shadow", "black")
    switch_button.setAttribute('data-button-active', '')
    switch_button.style.backgroundColor = "#212121"
  }
}
