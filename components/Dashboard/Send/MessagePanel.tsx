import React, { useState, useEffect } from 'react';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/components/store';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';
import { fetchUserData, User } from '@/components/redux/userSlice';
import { setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

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
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { campaignId } = router.query;

  useEffect(() => {
    async function fetchData() {
      if (!campaignId) return;
      const campaignDocRef = doc(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'campaigns', campaignId as string);
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
  const saveGeneratedMessage = async () => {
    if (finalMessage.trim() === '') {
      alert('The message is empty. Please generate a message before saving.');
      return;
    }
  
    if (!user || !selectedLead || !campaignId) return;
    const campaignRef = doc(db, 'users', user.id, 'campaigns', campaignId as string);
    const campaignDoc = await getDoc(campaignRef);
  
    if (!campaignDoc.exists()) {
      console.error('Campaign does not exist');
      return;
    }
  
    let campaignData = campaignDoc.data();
  
    if (campaignData) {
      let leadIndex = campaignData.leads.findIndex((lead: Lead) => lead.id === selectedLead.id);
      if (leadIndex !== -1) {
        campaignData.leads[leadIndex].generatedMessage = finalMessage;
        await setDoc(campaignRef, campaignData);
        console.log('Message saved successfully');
      } else {
        console.error('Lead not found in campaign');
      }
    } else {
      console.error('Invalid campaign data');
    }
  };
  

  async function generatePersonalizedMessage(
    lead: Lead,
    campaign: Campaign,
    user: User
  ): Promise<string> {
    setLoading(true);
    const aboutInput = `Never forget the recipient's name is ${lead.firstName} ${lead.lastName}. The company values are ${user.companyValues} and we are solving ${user.problem}. Never forget our name is ${user.firstName} ${user.lastName}.`;

    try {
      const response = await axios.post('/api/openai', { user, lead, campaign });
      // console.log(response.data);
      if (response.data && response.data.message) {
        const message = response.data.message;

        const leadRef = doc(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'campaigns', campaign.id, 'leads', lead.id);
        await setDoc(leadRef, { generatedMessage: message }, { merge: true });
        return message;
      } else {
        throw new Error("AI model failed to generate a personalized message");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("This is the error:" + error);
        if (error.message === 'getaddrinfo ENOTFOUND kg.diffbot.com') {
          alert('Unable to access LinkedIn data. Please try again later.');
        }
      }
      return '';
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex-grow">
      <div className="relative flex border-b px-10 py-5 text-2xl">
        Campaigns
      </div>
      <div className="flex-grow-0 px-10 py-5 flex flex-col justify-start items-start">
        {loading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <textarea
          className="w-full h-60 border text-black"
          value={finalMessage}
          onChange={(e) => setFinalMessage(e.target.value)}
        ></textarea>
        <button
          className="mt-5 px-4 py-2 border-[1px]"
          onClick={saveGeneratedMessage}
          disabled={loading}
        >
          Save
        </button>
      </div>
    </div>
  );

}

export default MessagePanel;
