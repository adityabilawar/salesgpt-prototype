import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  companyName: string;
  companyInfo: string;
  email: string;
  phoneNumber: string;
  linkedInProfile: string;
}

const initialState: User = {
  id: "",
  firstName: "",
  lastName: "",
  jobTitle: "",
  companyName: "",
  companyInfo: "",
  email: "",
  phoneNumber: "",
  linkedInProfile: "",
};

export const fetchUserData = createAsyncThunk('user/fetchUserData', async (userId: string) => {
  const userDocRef = doc(db, 'users', userId);
  const userSnapshot = await getDoc(userDocRef);
  const userData = { id: userSnapshot.id, ...userSnapshot.data() } as User;
  return userData;
});

export const updateUserData = createAsyncThunk('user/updateUserData', async ({userId, updatedData}: { userId: string, updatedData: Partial<User> }) => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, updatedData);
    return updatedData;
  });
  

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<User>) => {
        return { ...state, ...action.payload };
      })
      .addCase(updateUserData.fulfilled, (state, action: PayloadAction<Partial<User>>) => {
        return { ...state, ...action.payload };
      });
  },
});

export default userSlice.reducer;