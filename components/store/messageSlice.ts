import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GENERATE_MESSAGE } from '../redux/actions/leadActions';

interface GeneratedMessageState {
  currentMessage: string | null;
  displayedMessage: string | null;
  lead: any;
  campaignId: string | null;
}

const initialState: GeneratedMessageState = {
  currentMessage: null,
  displayedMessage: null,
  lead: null,
  campaignId: null,
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
    [GENERATE_MESSAGE]: (state, action: PayloadAction<{lead: any, campaignId: string}>) => {
      state.lead = action.payload.lead;
      state.campaignId = action.payload.campaignId;
    },
  },
});

export const { setCurrentMessage, setDisplayedMessage } = messageSlice.actions;

export default messageSlice.reducer;
