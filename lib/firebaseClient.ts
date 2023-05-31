import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

export const db = getFirestore(app);
