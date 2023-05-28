import { createSlice } from '@reduxjs/toolkit';

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    leads: [],
    selectedLeads: [],
    selectedLead: null,
  },
  reducers: {
    setLeads: (state, action: any) => {
      state.leads = action.payload;
    },
    addSelectedLead: (state: any, action: any) => {
      state.selectedLeads.push(action.payload);
    },
    clearSelectedLeads: (state) => { // New action to clear selected leads
      state.selectedLeads = [];
    },
    removeLead: (state, action) => {
      state.selectedLeads = state.selectedLeads.filter(
        (lead: any) => lead.leadName !== action.payload.leadName
      );
    },
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    },
  },
});

export const {
  setLeads,
  addSelectedLead,
  clearSelectedLeads, 
  removeLead,
  setSelectedLead,
} = leadsSlice.actions;


export default leadsSlice.reducer;
