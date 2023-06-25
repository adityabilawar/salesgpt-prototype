import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayButtonState {
  lead: Lead | null;
  campaignId: string | null;
}

const initialState: PlayButtonState = {
  lead: null,
  campaignId: null,
};

export const playButtonSlice = createSlice({
  name: 'playButton',
  initialState,
  reducers: {
    setPlayButtonState: (state, action: PayloadAction<PlayButtonState>) => {
      state.lead = action.payload.lead;
      state.campaignId = action.payload.campaignId;
    },
  },
});

export const { setPlayButtonState } = playButtonSlice.actions;

export default playButtonSlice.reducer;
