export const REMOVE_SELECTED_LEAD = 'REMOVE_SELECTED_LEAD';

export const removeSelectedLead = (lead: Lead) => ({
    type: REMOVE_SELECTED_LEAD,
    payload: lead,
  });