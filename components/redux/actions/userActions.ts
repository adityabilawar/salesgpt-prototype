import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "@/lib/firebaseClient";

export const getUserData = async (userId: any) => {
  const userDoc = doc(db, 'users', userId);
  const docSnap = await getDoc(userDoc);
  
  if (!docSnap.exists()) {
    console.log('No such user!');
  } else {
    return docSnap.data();
  }
}

export const updateUserData = async (userId: string, updatedData: any) => {
  const userDoc = doc(db, 'users', userId);
  await updateDoc(userDoc, updatedData);
}
