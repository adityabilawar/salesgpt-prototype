import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GeneratedMessageState {
  currentMessage: string | null;
  displayedMessage: string | null;
}

const initialState: GeneratedMessageState = {
  currentMessage: null,
  displayedMessage: null,
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setCurrentMessage: (state, action: PayloadAction<string>) => {
      state.currentMessage = action.payload;
    },
    setDisplayedMessage: (state, action: PayloadAction<string | null>) => {
      state.displayedMessage = action.payload;
    },
  },
});

export const { setCurrentMessage, setDisplayedMessage } = messageSlice.actions;

export default messageSlice.reducer;