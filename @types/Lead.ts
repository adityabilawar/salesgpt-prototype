interface BaseLead {
  id: string;
}

interface Lead extends BaseLead {
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    jobTitle: string;
    linkedIn: string;
    phone: string;
    refresh?: string;
    generatedMessages?: { campaignId: string; message: string }[];
    [key: string]: any;
}


