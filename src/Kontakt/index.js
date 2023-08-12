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

let name
let username
let punkte
let hasAdmin

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
            

            if(hasAdmin){
              checkWidth()
            }
                
          }
        })
        .then(() =>{

        })   
}

    const send_button = document.getElementById("send_button")
    const message_field = document.getElementById("message_field")

    send_button.addEventListener("click", ()=>{
      let messagecontent = message_field.value
      sendMessage(messagecontent)
      message_field.value = ""
    })

      function sendMessage(msg_content){
        const msgref = ref(database,"chats/" + uid)
        push(msgref, {
            username: username,
            msg_content: msg_content
          })
        }



     const message_container = document.querySelector(".message_container")

     function createmsg(msg, author){
      const new_msg = document.createElement("div")
      if(author == "admin"){
      new_msg.classList.add("message_admin")
      }else{
        new_msg.classList.add("message_you")
      }
      new_msg.textContent = msg;
      message_container.appendChild(new_msg)
      message_container.scrollTop = message_container.scrollHeight;
     }


     const msgRef = ref(database, "chats/" + uid);

     onChildAdded(msgRef, (childSnapshot) => {
      const messageData = childSnapshot.val().msg_content;
      const author = childSnapshot.val().username;
      createmsg(messageData, author);
    });


    


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
