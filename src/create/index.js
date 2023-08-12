import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, set, ref, push, get } from "firebase/database";
import './index.css';



//database 
const firebaseConfig = {
  apiKey: "AIzaSyB3wQrFPiz1gooQqe2gyrBNtAK4R-PoIAI",
  authDomain: "noten-wetten.firebaseapp.com",
  projectId: "noten-wetten",
  storageBucket: "noten-wetten.appspot.com",
  messagingSenderId: "872335913403",
  appId: "1:872335913403:web:27aeba0f50c2f36022149e"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
let hasAdmin

let navbar = document.querySelector(".navbar")

onAuthStateChanged(auth, (user) => {

  
  let uid = user.uid;
  const userRef = ref(database, "users/" + uid);

  getuserdata()
  function getuserdata() {
        
    get(userRef)
        .then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            hasAdmin = userData.hasAdmin;
            
            //code fängt hier an weil der getuserdata zu langsam ist
            if (user && hasAdmin) {
              checkWidth()
              const submit = document.getElementById("submit_button")
              submit.addEventListener("click",writeUserData);
              
              function writeUserData(){
                  let fach = selectedValue;
                  let klausurNr = document.getElementById("klausur_number").value;
                  let person = document.getElementById("name").value;
                  const database = getDatabase(app);
                  const reference = push(ref(database, "wetten"));
                  if(klausurNr !="" && fach !="" && person !=""){
                    set(reference, {
                      Fach: fach,
                      KlausurNr: klausurNr,
                      Person: person,
                      beendet: "laufend",
                      finale_note:0
                  }).then(() => {
                      window.location.href = "../home/index.html";
                  })
                  }
                  else{
                    alert("fülle alle Felder aus");
                  }
                  
              }

              
              //---------------------------------------------------Design ---------------------------------------
              
              const dropdowns = document.querySelectorAll('.dropdown');
              let selectedValue = "";
              
              
              dropdowns.forEach(dropdown => {
                const select = dropdown.querySelector(".select");
                const caret = dropdown.querySelector(".caret");
                const menu = dropdown.querySelector(".menu");
                const options = dropdown.querySelectorAll(".menu li");
                const selected = dropdown.querySelector(".selected");
               
                select.addEventListener("click", () => {
                  select.classList.toggle("select-clicked");
                  caret.classList.toggle("caret-rotate");
                  menu.classList.toggle("menu-open");
                });
              
                options.forEach(option => {
                  option.addEventListener("click", () => {
                    selected.innerText = option.innerText;
                    selectedValue = option.dataset.value;
                    select.classList.remove("select-clicked");
                    caret.classList.remove("caret-rotate");
                    menu.classList.remove("menu-open");
              
                    options.forEach(option => {
                      option.classList.remove("active");
                    });
                    option.classList.add("active");
                    
                    console.log(selectedValue);
                  });
                });
              });
              
              
              
              } else {
                window.location.href = "../login/index.html";
              }


          }
        }) 
      }

});




function toggleMenu() {
    event.preventDefault();
    var dropdownMenu = document.querySelector(".dropdown-menu");
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
}

var menuButton = document.querySelector("[data-menu-button]");
menuButton.addEventListener("click", toggleMenu);

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