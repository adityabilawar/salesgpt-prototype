import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { doc, collection, getDocs } from 'firebase/firestore';
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

export const fetchLeads = createAsyncThunk('leads/fetchLeads', async () => {
  const userId = "jOgfvrI7EfqjqcH2Gfeo";
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
      state.selectedLeads.push(action.payload);
    },
    clearSelectedLeads: (state) => {
      state.selectedLeads = [];
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
  removeLead,
  setSelectedLead,
  updateLeads,
  updateSelectedLead, 
} = leadsSlice.actions;

export default leadsSlice.reducer;
