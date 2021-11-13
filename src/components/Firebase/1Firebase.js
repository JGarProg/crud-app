import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider} from "firebase/auth";
import './Firebase.css';

const firebaseConfig = {
  apiKey: "AIzaSyDs7U3TNl-qVUBLLNDXaGctZRMgzYVjazQ",
  authDomain: "misiontic-9cbef.firebaseapp.com",
  projectId: "misiontic-9cbef",
  storageBucket: "misiontic-9cbef.appspot.com",
  messagingSenderId: "118113302071",
  appId: "1:118113302071:web:5c292a62441c3724c231b2",
  measurementId: "G-C5VEX3X1NF"
};


//Initialize Firebase;
initializeApp(firebaseConfig);
const auth = getAuth();

const signInWithGoogle = () => {
};

const registerWithEmailAndPassword = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    //const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    //const errorCode = error.code;
    //const errorMessage = error.message;
    alert(error.message);
    // ..
  });
};









//const signInEmailAndPassword =  ( email, password) => {
  //createUserWithEmailAndPassword(auth, email, password)
  //.then((userCredential) => {
    // Signed in 
    //const user = userCredential.user;
    // ...
 // })
  //.catch((error) => {
    //const errorCode = error.code;
    //const errorMessage = error.message;
    //alert(error.message);
    
    // ..
  //});

//};
const sendPasswordResetEmail = (email) => {
  try {
    //await auth.sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  auth.signOut();
};
export {
  auth,
  registerWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithGoogle,
  logout,
};
