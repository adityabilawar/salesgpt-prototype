export const REMOVE_SELECTED_LEAD = 'REMOVE_SELECTED_LEAD';
export const GENERATE_MESSAGE = 'GENERATE_MESSAGE';

export const removeSelectedLead = (lead: Lead) => ({
    type: REMOVE_SELECTED_LEAD,
    payload: lead,
  });

  export const generateMessage = (lead, campaignId) => ({
    type: GENERATE_MESSAGE,
    payload: {
      lead,
      campaignId,
    },
  });