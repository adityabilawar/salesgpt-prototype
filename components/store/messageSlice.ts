import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GeneratedMessageState {
  currentMessage: string | null;
}

const initialState: GeneratedMessageState = {
  currentMessage: null
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setCurrentMessage: (state, action: PayloadAction<string>) => {
      state.currentMessage = action.payload;
    }
  }
});

export const { setCurrentMessage } = messageSlice.actions;

export default messageSlice.reducer;
