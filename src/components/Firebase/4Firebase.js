import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import './Firebase.css';

const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
  projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}`,
  appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,
  measurementId: `${process.env.REACT_APP_FIREBASE_MEASURENENT_ID}`
};

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
provider.setCustomParameters({
  'login_hint': 'user@example.com'
});

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();

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
const resetPassword = (email, handleError,handleSuccess) => {
  try {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        handleSuccess("Reset Sent");
        console.log("Reset sent");
      })
      .catch((error) => {
        handleError(error.message);
        // ..
      });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const signInWithGoogle = (setLogin, setHasError,setErrors) => {
  setLogin(true);
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      //const credential = GoogleAuthProvider.credentialFromResult(result);
      //const token = credential.accessToken;
      // The signed-in user info.
      //const user = result.user;
      // ...
      setLogin(false);
    }).catch((error) => {
      // Handle Errors here.
      //const errorCode = error.code;
      //const errorMessage = error.message;
      // The email of the user's account used.
      //const email = error.email;
      // The AuthCredential type that was used.
      //const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      setHasError(true);
      setErrors(error.message);
      setLogin(false);
    });
}

const signInEmailAndPassword = (email, password,setLogin,setHasError,setErrors) => {
  setLogin(true);
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      //const user = userCredential.user;
      //const token = userCredential.accessToken;
      // The signed-in user info.
      //localStorage.setItem('user', JSON.stringify(user));


      // ...
      setLogin(false);
    })
    .catch((error) => {
      //const errorCode = error.code;
      //const errorMessage = error.message;
      setHasError(true);
      setErrors(error.message);
      setLogin(false);
    });


};


const logout = () => {
  auth.signOut();
};
export {
  auth,
  registerWithEmailAndPassword,
  resetPassword,
  signInWithGoogle,
  logout,
  signInEmailAndPassword
};
