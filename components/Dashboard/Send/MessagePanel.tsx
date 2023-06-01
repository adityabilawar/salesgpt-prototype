import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/components/store';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';
import { fetchUserData, User } from '@/components/redux/userSlice';
import { setDoc } from 'firebase/firestore';


interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  jobTitle: string;
  linkedIn: string;
  phone: string;
  [key: string]: any;
}


interface Campaign {
  id: string;
  generatedPrompt: string;
  callToAction: string;
  campaignTitle: string;
  platform: string;
  toneOfVoice: string;
  purpose: string;
  [key: string]: any;
}

const configuration = new Configuration({
  organization: "org-z7m6hqrQHuHbpI0K9pYlJiR0",
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

const MessagePanel = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(null);
  const selectedLead: Lead | null = useSelector((state: RootState) => state.leads.selectedLead);
  const [messagesGenerated, setMessagesGenerated] = useState<number>(0);
  const [finalMessage, setFinalMessage] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      const campaignId = 'ShQWzH9paCZeT3KxuWQZ'; // Replace this with the actual campaign id
      const campaignDocRef = doc(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'campaigns', campaignId);
      const campaignSnapshot = await getDoc(campaignDocRef);

      
  
      if (!campaignSnapshot.exists()) {
        console.error('Campaign does not exist');
        return;
      }
  
      const campaignData = campaignSnapshot.data();
  
      if (!campaignData || typeof campaignData.generatedPrompt !== 'string') {
        console.error('Invalid campaign data');
        return;
      }
    
      const campaign: Campaign = {
        id: campaignSnapshot.id,
        generatedPrompt: campaignData.generatedPrompt,
        callToAction: campaignData.callToAction,
        campaignTitle: campaignData.campaignTitle,
        platform: campaignData.platform,
        toneOfVoice: campaignData.toneOfVoice,
        purpose: campaignData.purpose,
        ...campaignData,
      };

      const userDataRef = doc(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo');
      const userSnapshot = await getDoc(userDataRef);

      if (!userSnapshot.exists()) {
        console.error('User does not exist');
        return;
      }

      const userData = userSnapshot.data();
      if (!userData) {
        console.error('Invalid user data');
        return;
      }

      const user: User = {
        id: userSnapshot.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        companyName: userData.companyName,
        companyInfo: userData.companyInfo,
        phoneNumber: userData.phoneNumber,
        companyValues: userData.companyValues,
        problem: userData.problem,
        email: userData.email,
        linkedInProfile: userData.linkedInProfile,
        jobTitle: userData.jobProfile,
      };
      setUser(user);
      if (selectedLead) {
        const message = await generatePersonalizedMessage(
          JSON.parse(JSON.stringify(selectedLead)),
          campaign,
          JSON.parse(JSON.stringify(user))
        );
        setFinalMessage(message);
        setMessagesGenerated(prevCount => prevCount + 1);
      }
    }
  
    fetchData();
  }, [selectedLead]);

  console.log("user:" + JSON.stringify(user))


  async function generatePersonalizedMessage(
    lead: Lead,
    campaign: Campaign,
    user: User
  ): Promise<string> {
    const aboutInput = `Never forget the recipient's name is ${lead.firstName} ${lead.lastName}. The company values are ${user.companyValues} and we are solving ${user.problem}. Never forget our name is ${user.firstName} ${user.lastName}.`;
  
    try {
      const response = await axios.post('/api/openai', { user, lead, campaign });
      if (response.data && response.data.message) {
        const message = response.data.message;
  
        const leadRef = doc(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'campaigns', campaign.id, 'leads', lead.id);
        await setDoc(leadRef, { generatedMessage: message }, { merge: true });
        return message;
      } else {
        throw new Error("AI model failed to generate a personalized message");
      }
  
    } catch (error) {
      console.error(error);
      throw new Error("Error generating message");
    }
  }
  

  return (
    <div className="flex-grow">
      <div className="relative flex border-b px-10 py-5 text-2xl">
        Campaigns
      </div>
      <div className="flex-grow-0 px-10 py-5 flex space-x-5">
        {/* {messagesGenerated < selectedLeads.length ? (
          <div className="flex justify-center items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : ( */}
          <textarea className="w-full h-60 border text-black" value={finalMessage} readOnly></textarea>
        {/* )} */}
      </div>
    </div>

  );
}

export default MessagePanel;
