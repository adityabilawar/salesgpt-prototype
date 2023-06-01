import { db } from "@/lib/firebaseClient";

export const getUserData = async (userId) => {
  const doc = await db.collection('users').doc(userId).get();
  
  if (!doc.exists) {
    console.log('No such user!');
  } else {
    return doc.data();
  }
}

export const updateUserData = async (userId, updatedData) => {
  await db.collection('users').doc(userId).update(updatedData);
}
