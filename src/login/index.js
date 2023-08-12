import './index.css';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, set, ref, update,get, push } from "firebase/database";



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

//add new user to database
const register_button = document.getElementById("register_button")
register_button.addEventListener("click", (e)=>{              
const reg_username = document.getElementById("reg_username").value;
const reg_name = document.getElementById("reg_name").value;
const reg_email = document.getElementById("reg_email").value;
const reg_password = document.getElementById("reg_password").value;
const reg_confirm_password = document.getElementById("reg_password_confirm").value;

if(validate_email(reg_email) == false) {         
    alert("gib eine echte Email Adresse an");
    return;
}

if(validate_password(reg_password, reg_confirm_password) == false) {         
    alert("passwort stimmt nicht überein");
    return;
}

if(validate_textfield(reg_name) == false){
    alert("gib deinen Namen an")
    return;
}
if(validate_textfield(reg_username) == false){
    alert("gib deinen Namen an")
    return;
}
createUserWithEmailAndPassword(auth, reg_email, reg_password)
    .then((userCredential) =>{
            
        const user = userCredential.user;
        console.log(user)
        console.log("geschafft");
        set(ref(database,"users/" + user.uid),{
            username: reg_username,
            name: reg_name,
            email: reg_email,
            hasAdmin: false,
            punkte: 0,
            gewonnene_Wetten:0,
            verlorene_Wetten:0,
            jahrgang: 2024,
        })


        var msg_ref = ref(database,"chats/" + user.uid)
        push(msg_ref, {
            username: reg_username,
            msg_content: "Hallo. Ich heiße " + reg_name + " und ich benutze jetzt diese Webseite"
          })
          .then(() => {                      
            window.location.href = "../home/index.html";
          })
          .catch((error) => {
            console.error("Error storing user data:", error);
          });

        
    })    
    .catch((error) =>{
        const errorCode = error.Code;
        const errorMessage = error.Message;
        alert(errorCode, errorMessage);
    })

})

const login_button = document.getElementById("login_button")
login_button.addEventListener("click", (e)=>{
    console.log("in")
    const login_email = document.getElementById("login_email").value;
    const login_password = document.getElementById("login_password").value;


    signInWithEmailAndPassword(auth, login_email, login_password)
    .then((userCredential) => {
    
    const date = new Date();
    const user = userCredential.user;
    update(ref(database,"users/" + user.uid),{
        last_login:date,
    })
    window.location.href = "../home/index.html";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage, errorCode);
  });
})


const user = auth.currentUser;
onAuthStateChanged(auth, (user)=>{
    if(user){
        const uid = user.uid;
    }
    else{
        console.log("no user is logged in");
    }
})


function validate_email(email){
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(validRegex.test(email) == true){
    return true;
}
else{
    return false;
}
}

function validate_textfield(text){
    if(text == "" || text == null){
        return false;
    }
}

function validate_password(password, confirm_password){
    if(password == confirm_password){
        return true;
    }
    else{
        return false;
    }
}



const login_container =  document.querySelector(".login_container")
const register_container = document.querySelector(".register_container")

document.getElementById("login").addEventListener("click", ()=>{
    event.preventDefault()
    login_container.style.display = "block"
    register_container.style.display = "none"
})
document.getElementById("register").addEventListener("click", ()=>{
    event.preventDefault()
    login_container.style.display = "none"
    register_container.style.display = "block"
})

