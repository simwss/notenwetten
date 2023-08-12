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
const reference = ref(database);


let name
let username
let punkte
let hasAdmin
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
            jahrgang = userData.jahrgang;

            if(hasAdmin){
              checkWidth()
            }
                
          }
        })
        .then(() =>{
          onChildAdded(child(reference, "wetten"),(element) => {
            let data = element.val();
            if(data.beendet == "laufend" && jahrgang == data.jahrgang){
            createDiv(data.Fach, data.KlausurNr, data.Person, element.key);
            }
          })          

          onChildAdded(child(reference, "wetten"),(element) => {
            let data = element.val();
            if(data.beendet == "beendet" && jahrgang == data.jahrgang){
            createDiv_finished(data.finale_note, data.Fach, data.KlausurNr, data.Person, element.key);
            }
          })    


          checkWidth()
          var profile_menu = document.querySelector(".profile-menu");
          const secondChild = profile_menu.querySelectorAll('a')[1];
          secondChild.textContent = "Punkte: " + punkte
        })
        
      }

      





const section1 = document.querySelector('[data-current]')

function createDiv(fach, klausurNr, person, key, name) {
    
    console.log("wettenId" + key);
    const neue_wette = document.createElement('div');
    neue_wette.classList.add("container");
    section1.appendChild(neue_wette);

    let pPerson = document.createElement('p');
    pPerson.textContent = person;
    neue_wette.appendChild(pPerson);
    let pklausurNr = document.createElement('p');
    pklausurNr.textContent = klausurNr +". " + fach;
    neue_wette.appendChild(pklausurNr);




   let submit_grade = document.createElement("input")
   submit_grade.type = "number"
   submit_grade.id = "grade_input";
   
   

   let label = document.createElement("label");
    label.textContent = "Notenpunkte"; 
    label.setAttribute("for", submit_grade.id); 
    neue_wette.appendChild(label);
    neue_wette.appendChild(submit_grade)
    
    let submit_button = document.createElement("button")
    submit_button.textContent = "Submit"
    neue_wette.appendChild(submit_button)

    submit_button.addEventListener("click", () => {
        if (submit_grade.value >= 0 && submit_grade.value <= 15 && submit_grade.value != "") {
          const note = submit_grade.value;
          vote(note, fach, klausurNr, person, key, name)
          .then(() => {
            blocktest(key, submit_grade, submit_button);
          })
          }
         else {
          alert("Gebe die Note in Punkten an");
        }
      });

    // alte noten

     //----------------------------------------------------------------
    
     let user = auth.currentUser;
     let userId = user.uid;
     let voteRef = ref(database, 'abstimmungen');
     get(voteRef)
     .then((snapshot) => {
       let votes = snapshot.val();
     
       if (votes) {
         for (const voteId in votes) {
           const vote = votes[voteId];
           if (vote.Klausur_key === key && vote.wetter_ID === userId) {
               submit_grade.value =  vote.Bewertung;
               submit_grade.readOnly = "true";
               submit_button.style.display = "none"
             return;
           }
         }
       }
     })
     //---------------------------------------------------------------------


    const reference = ref(database);
    get(child(reference, "wetten"))
    .then((snapshot) =>{
        var wetten_arr = [];
            snapshot.forEach(childSnapshot => {
                const key = childSnapshot.key;
                const data = childSnapshot.val();
                wetten_arr.push({ key, ...data });
            })
            addOldGrades(wetten_arr);
    })
    
   function addOldGrades(wetten_arr){
        let alte_noten = document.createElement("p")
        wetten_arr.forEach(element => {
            if(element.Person == person && element.beendet == "beendet" && element.Fach == fach){
                alte_noten.textContent = alte_noten.textContent + " " + element.finale_note
            }
        })
        neue_wette.appendChild(alte_noten);
    }








    //--------------------------------Abstimmung Beenden-----------/



    let beenden_container = document.createElement("div")
    beenden_container.classList.add("beenden_container")
    let beenden_button = document.createElement("button")
    let  beenden_feld = document.createElement("input")
    beenden_feld.type="number"
    beenden_button.textContent = "beenden"
    beenden_container.appendChild(beenden_feld)
    beenden_container.appendChild(beenden_button)
    neue_wette.appendChild(beenden_container)

    if(hasAdmin){
      beenden_container.style.display = "flex";
    }

    beenden_button.addEventListener("click", () => {
      if (beenden_feld.value >= 0 && beenden_feld.value <= 15) {
        const finale_note = beenden_feld.value;
        console.log(finale_note)
        neue_wette.parentNode.removeChild(neue_wette);
        let dbref = ref(database, 'wetten/'+ key)
        get(dbref)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const aktuelleDaten = snapshot.val();
            aktuelleDaten.beendet = "beendet";
            aktuelleDaten.finale_note = finale_note;
            set(dbref, aktuelleDaten)
        }
      })

      get(voteRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach(childSnapshot => {
            const vote = childSnapshot.val();
            if (vote.Klausur_key === key) {
              const abstimmungsdaten = childSnapshot.val();
              abstimmungsdaten.beendet = "beendet";
              set(childSnapshot.ref, abstimmungsdaten);
            }
          });
        }
      });

      
      let abstimmungenref = ref(database, "abstimmungen/")
      
      get(abstimmungenref)
      .then((snapshot) => {
        if (snapshot.exists()) {
          let closestUserKeys = [];
          let allusers = [];
          let closestDifference = 16;
          snapshot.forEach(childSnapshot => {
            const wetten = childSnapshot.val();
            const userKey = wetten.wetter_ID;                                            
            const bewertungPunkte = wetten.Bewertung;
            const difference = Math.abs(bewertungPunkte - finale_note)
            if(wetten.Klausur_key == key){ 
                allusers.push(userKey)                                                     //nur von bestimmter klausur
                if (difference === closestDifference) {
                  closestUserKeys.push(userKey);
                }
                 else if (difference < closestDifference) {
                  closestDifference = difference;
                  closestUserKeys = [userKey];
                }
          }
          });

          
          //punkteverteilung
      
          const nonWinnerPool = 4 * (allusers.length - closestUserKeys.length);
          const poolPerWinner = nonWinnerPool / closestUserKeys.length;
          let gewonnen;
          let verloren;
          
          console.log(allusers, closestUserKeys)
          allusers.forEach(userKey => {
            if (closestUserKeys.includes(userKey)) {
              gewonnen = 1;
              verloren = 0;
              updateUserPunkte(userKey, poolPerWinner, gewonnen, verloren);


            } else {
              gewonnen = 0;
              verloren = 1;
              updateUserPunkte(userKey, -4, gewonnen, verloren);
            }
          });
        } 
      });
    }
    else {
      alert("Gebe die Note in Punkten an");
    }
  });
}

//-----------------------------------------------------------------------------------------------------------------------------------
function vote(bewertung, fach, klausurNr, person, key) {
    return new Promise((resolve, reject) => {
      let user = auth.currentUser;
      let userId = user.uid;
      let wetter = user.email;
      let voteRef = ref(database, 'abstimmungen');
  
      get(voteRef)
        .then((snapshot) => {
          let votes = snapshot.val();
  
          if (votes) {
            for (const voteId in votes) {
              const vote = votes[voteId];
              if (vote.Klausur_key === key && vote.wetter_ID === userId) {
                alert('Du hast schon einmal abgestimmt');
                return;
              }
            }
          }
          const newVoteRef = push(voteRef);
          const voteData = {
            Klausur_key: key,
            Bewertung: Math.round(bewertung),
            Kandidat: person,
            Klausur_Fach: fach,
            Klausur_Nr: klausurNr,
            wetter_ID: userId,
            wetter_mail: wetter,
            wetter_name: name,
            wetter_username: username,
            beendet: "laufend",
          };
  
          set(newVoteRef, voteData)
            .then(() => {
              console.log('Abstimmung erfolgreich');
              resolve();
            })
            .catch((error) => {
              console.error('Etwas ist schief gelaufen :(', error);
              reject(error);
            });
        })
        .catch((error) => {
          console.error('Error fetching votes:', error);
          reject(error);
        });
    });
  }
  
  //-----------------------------------------------------------------------------------------------------------------------------------
  
  function blocktest(key, submit_grade, submit_button){

          let user = auth.currentUser;
          let userId = user.uid;
          let voteRef = ref(database, 'abstimmungen');
          get(voteRef)
          .then((snapshot) => {
            let votes = snapshot.val();
      
            // Check if the user has already submitted an answer for the given Klausurenkey
            if (votes) {
              for (const voteId in votes) {
                const vote = votes[voteId];
                if (vote.Klausur_key === key && vote.wetter_ID === userId) {
                  console.log("hallo")
                  submit_grade.value =  vote.Bewertung;
                  submit_grade.readOnly = "true";
                  submit_button.style.display = "none"
                  return;
                }
              }
            }
          })
}

//-----------------------------------------------------------------------------------------------------------------------------------

function updateUserPunkte(userKey, punktzahl, gewonnen, verloren) {
  let userRef = ref(database, "users/");
  const userDocRef = child(userRef, userKey);

  get(userDocRef)
    .then(snapshot => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        userData.punkte = userData.punkte + punktzahl;
        userData.gewonnene_Wetten = userData.gewonnene_Wetten + gewonnen;
        userData.verlorene_Wetten = userData.verlorene_Wetten + verloren;
        set(userDocRef, userData)
          
      } 
    })
}





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
