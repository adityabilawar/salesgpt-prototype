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
    [key: string]: any;
}

interface LinkedInLead extends BaseLead {
  url: string;
}


