import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { doc, collection, getDocs } from 'firebase/firestore';
import { REMOVE_SELECTED_LEAD } from '../redux/actions/leadActions';
import { db } from '@/lib/firebaseClient';

interface LeadsState {
  leads: Lead[];
  selectedLeads: Lead[];
  selectedLead: Lead | null;
}

const initialState: LeadsState = {
  leads: [],
  selectedLeads: [],
  selectedLead: null,
};

export const fetchLeads = createAsyncThunk('leads/fetchLeads', async (userId: string) => {
  const userDocRef = doc(db, 'users', userId);
  const leadsCol = collection(userDocRef, 'leads');
  const leadSnapshot = await getDocs(leadsCol);
  const leadsList: Lead[] = leadSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
  return leadsList;
});


const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    addSelectedLead: (state, action: PayloadAction<Lead>) => {
      console.log('Adding selected lead: ', action.payload);
      state.selectedLeads.push(action.payload);
    },
    clearSelectedLeads: (state) => {
      state.selectedLeads = [];
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
    removeLead: (state, action: PayloadAction<Lead>) => {
      state.selectedLeads = state.selectedLeads.filter(
        (lead: Lead) => lead.id !== action.payload.id
      );
    },
    setSelectedLead: (state, action: PayloadAction<Lead>) => {
      state.selectedLead = action.payload;
    },
    updateLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads = action.payload;
    },
    updateSelectedLead: (state, action: PayloadAction<Lead>) => {
      if (state.selectedLead && state.selectedLead.id === action.payload.id) {
        state.selectedLead = action.payload;
      }
    },
    toggleLeadSelection: (state, action: PayloadAction<Lead>) => {
      const exists = state.selectedLeads.find((lead: Lead) => lead.id === action.payload.id);
      console.log('Toggling lead selection: ', action.payload);
      if (exists) {
        state.selectedLeads = state.selectedLeads.filter((lead: Lead) => lead.id !== action.payload.id);
      } else {
        state.selectedLeads.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLeads.fulfilled, (state, action) => {
      state.leads = action.payload;
    });
  },
});

export const {
  addSelectedLead,
  clearSelectedLeads,
  clearSelectedLead,
  removeLead,
  setSelectedLead,
  updateLeads,
  updateSelectedLead, 
  toggleLeadSelection,
} = leadsSlice.actions;

export default leadsSlice.reducer;
