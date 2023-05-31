import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useSelector } from 'react-redux';
import { RootState } from '@/components/store';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

interface Campaign {
  prompt: string;
  [key: string]: any;
}

const configuration = new Configuration({
    organization: "org-z7m6hqrQHuHbpI0K9pYlJiR0",
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const MessagePanel = () => {
  const selectedLeads: Lead[] = useSelector((state: RootState) => state.leads.selectedLeads);
  const [messagesGenerated, setMessagesGenerated] = useState<number>(0);
  const [finalMessage, setFinalMessage] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      const campaignId = "vQOc6n7NJlAIAIepgcg8";
      const docRef = doc(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'campaigns', campaignId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const campaign: Campaign = docSnap.data() as Campaign;
        if(Array.isArray(selectedLeads) && selectedLeads.length > 0){
          const lead: Lead = selectedLeads[0];
          const message = await generatePersonalizedMessage(lead, campaign);
          setFinalMessage(message);
          setMessagesGenerated(prevCount => prevCount + 1);
        }
      } else {
        console.log("No such document!");
      }
    }

    fetchData();
  }, [selectedLeads]);

  async function generatePersonalizedMessage(lead: Lead, campaign: Campaign): Promise<string> {
    const aboutInput = `Never forget the recipient's name is ${lead.firstName} ${lead.lastName}.`;
  
    try {
      const response = await axios.post('/api/openai', { lead, campaign });
  
      if (response.data && response.data.message) {
        return response.data.message;
      } else {
        throw new Error("AI model failed to generate a personalized message");
      }
  
    } catch (error) {
      console.error(error);
      throw new Error("Error generating message");
    }
  }

  return (
    <div className="border-r h-screen flex flex-col">
      <div className="flex-grow">
        <div className="relative flex border-b px-10 py-5 text-2xl">
          Campaigns
        </div>
        <div className="flex-grow-0 px-10 py-5 flex space-x-5">
          <textarea className="w-full h-60 border text-black" value={finalMessage} readOnly></textarea>
        </div>
      </div>
    </div>
  );
}

export default MessagePanel;
