// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABg3V02KNObibJuZUDrLBiCTU8iA-CZkA",
  authDomain: "ai-code-reviewer-63b24.firebaseapp.com",
  projectId: "ai-code-reviewer-63b24",
  storageBucket: "ai-code-reviewer-63b24.firebasestorage.app",
  messagingSenderId: "40976255984",
  appId: "1:40976255984:web:afbf0ce4c16e245fce2b35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication (For Login)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async (emailHint) => {
  try {
    // If an email was passed from the history list, tell Google to use it!
    if (typeof emailHint === 'string') {
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        login_hint: emailHint // Pre-fills the email in the Google popup
      });
    } else {
      // Otherwise, just show the normal account chooser
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
    }

    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    // If user closes the popup, just log it. Don't crash the app!
    console.log("Login cancelled by user:", error.message);
  }
};
export const logout = () => signOut(auth);

// Export Database (For Sharing Code)
export const db = getFirestore(app);

export const saveSnippet = async (code, language) => {
  try {
    const docRef = await addDoc(collection(db, "shared_codes"), {
      code: code,
      language: language,
      createdAt: new Date()
    });
    return docRef.id; // Returns the ID so we can generate a share link
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
};

export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account'
});