interface Campaign {
    id: string;
    campaignTitle: string;
    generatedPrompt: string;
    platform?: string; 
    callToAction?: string;
    toneOfVoice?: string; 
    purpose?: string; 
    leads?: Lead[]; 
    [key: string]: any;
}