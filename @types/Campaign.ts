interface Campaign {
    id: string;
    campaignTitle: string;
    generatedPrompt: string;
    platform?: string; 
    callToAction?: string;
    toneOfVoice?: string; 
    purpose?: string; 
    leads?: Lead[]; 
    wordLimit?: string;
    [key: string]: any;
}