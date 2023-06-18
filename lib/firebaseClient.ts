import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword as _signInWithEmailAndPassword, createUserWithEmailAndPassword as _createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBMZIJS9aS31N6g0qi1c0UeEN2MK_pcRjA",
  authDomain: "pipelinedb-ea38a.firebaseapp.com",
  projectId: "pipelinedb-ea38a",
  storageBucket: "pipelinedb-ea38a.appspot.com",
  messagingSenderId: "340072512612",
  appId: "1:340072512612:web:ba1086f34e57fb2f4e7371",
  measurementId: "G-JNGRD4C9Q4"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);

export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await _signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const createUserWithEmailAndPassword = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    const userCredential = await _createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("user: ", user);
    if(user) {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { uid: user.uid, firstName, lastName, email });
      console.log("Document written with ID: ", user.uid);
      return { user, error: null };
    }
  } catch (error: any) {
    console.error("Error adding document: ", error);
    return { user: null, error: error.message };
  }
};

export const db = getFirestore(app);