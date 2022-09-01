// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-analytics.js";
import { 
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    getDocs,
    onSnapshot,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
 } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js"


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyDWnziUkQpnw56JNoTw87YJbH5TopRHmD0",
authDomain: "family-finance-c0b7a.firebaseapp.com",
projectId: "family-finance-c0b7a",
storageBucket: "family-finance-c0b7a.appspot.com",
messagingSenderId: "9813308230",
appId: "1:9813308230:web:14962347efccb8aa8c6b47",
measurementId: "G-7GEVZ2ZS4W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const db = getFirestore();

//EXPENSES

export const saveExpense = (title, date, description, account, quantity, currency) => {
    //console.log(title, description, account, quantity)
    addDoc(collection(db,'expenses'), {title,date,description,account,quantity, currency})
    updateBalace();
}

export const getExpenses = async () => {
    var results = await getDocs(collection(db,'expenses'))
    return results;
}

export const onGetExpenses = (callback) => {
    onSnapshot(collection(db, 'expenses'), callback);
}

export const deleteExpense = (id) => {
    deleteDoc(doc(db,'expenses',id));
    updateBalace();
}

export const editExpense = async (id) => {
    return await getDoc(doc(db,'expenses',id));
}

export const updateExpense = async (id, newFields) => {
    await updateDoc(doc(db, 'expenses', id), newFields);
}

//export {onSnapshot, collection,db};


// INCOMES

export const saveIncome = (title, date, description, account, quantity, currency) => {
    //console.log(title, description, account, quantity)
    addDoc(collection(db,'incomes'), {title,date, description,account,quantity, currency})
    updateBalace();
}

export const onGetIncomes = (callback) => {
    onSnapshot(collection(db, 'incomes'), callback);
}

export const deleteIncome = (id) => {
    deleteDoc(doc(db,'incomes',id));
    updateBalace();
}

export const editIncome = async (id) => {
    return await getDoc(doc(db,'incomes',id));
}

export const updateIncome = async (id, newFields) => {
    await updateDoc(doc(db, 'incomes', id), newFields);    
}

// BALANCE

export const updateBalace = async () => {
    var expResults = await getDocs(collection(db,'expenses'))
    let totalExpING = 0;
    let totalExpSantander = 0;
    let totalExpAdvCash = 0;
    let totalExpBitBox = 0;    
    let totalExpINGFondo = 0;    
    expResults.forEach(exp => {
        const account = exp.data().account;
        if(account === 'ING'){
            //console.log(exp.data().quantity)
            totalExpING += parseFloat(exp.data().quantity);
        }else if(account === 'Santander'){
            totalExpSantander += parseFloat(exp.data().quantity);
        }else if(account === 'ADVCash'){
            totalExpAdvCash += parseFloat(exp.data().quantity);
        }else if(account === 'ING-Fondo'){
            totalExpINGFondo += parseFloat(exp.data().quantity);
        }else if(account === 'BitBox'){
            totalExpBitBox += parseFloat(exp.data().quantity);
        }        

    });
    //console.log(totalExpING)

    var incResults = await getDocs(collection(db,'incomes'))
    let totalIncING = 0;
    let totalIncSantander = 0;
    let totalIncAdvCash = 0;
    let totalIncBitBox = 0;    
    let totalIncINGFondo = 0;    
    incResults.forEach(inc => {
        const account = inc.data().account;
        if(account === 'ING'){
            totalIncING += parseFloat(inc.data().quantity);
        }else if(account === 'Santander'){
            totalIncSantander += parseFloat(inc.data().quantity);
        }else if(account === 'ADVCash'){
            totalIncAdvCash += parseFloat(inc.data().quantity);
        }else if(account === 'ING-Fondo'){
            totalIncINGFondo += parseFloat(inc.data().quantity);
        }else if(account === 'BitBox'){
            totalIncBitBox += parseFloat(inc.data().quantity);
        }        

    });
    //console.log(totalIncING)
    //console.log("Balance ING:", totalIncING - totalExpING);
    //console.log("Balance Santander:", totalIncSantander - totalExpSantander);
    const divBalances = document.getElementById('balances');
    divBalances.innerHTML = `
    <h3 class="h5">Balances</h3>
    <p>ING: <strong>${totalIncING - totalExpING}</strong></p>
    <p>Santander: <strong>${totalIncSantander - totalExpSantander}</strong></p>
    `;
}

//AUTHENTICATION
const auth = getAuth();
const liUser = document.getElementById('idUser');

//--Sign Up

const signUpForm = document.getElementById('signUpForm');
var signUpModal = new bootstrap.Modal(document.getElementById('signUpModal'));

signUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const signUpEmail = document.getElementById('signup-email').value;
    const signUpPassw = document.getElementById('signup-password').value;    
    
    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassw)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        liUser.innerHTML = `<a class="nav-link" href="#">${user.email}</a>`;
        signUpModal.hide();
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
})


//--Sign Up

const signInForm = document.getElementById('signInForm');
var signInModal = new bootstrap.Modal(document.getElementById('signInModal'));

signInForm.addEventListener('submit', e => {
    e.preventDefault();
    const signInEmail = document.getElementById('signin-email').value;
    const signInPassw = document.getElementById('signin-password').value;    
    
    signInWithEmailAndPassword(auth, signInEmail, signInPassw)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;       
        liUser.innerHTML = `<a class="nav-link" href="#">${user.email}</a>`;
        signInModal.hide();
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
})

// -- Logout
const liLogout = document.getElementById('liLogout');
liLogout.addEventListener('click', e=> {
    e.preventDefault();
    signOut(auth);
    liUser.innerHTML ="";
});

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log('User sign in')
      // ...
    } else {
      // User is signed out
      // ...
      console.log('User sign out')

    }
  });