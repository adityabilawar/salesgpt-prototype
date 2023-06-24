  import React, { useState, useEffect, useRef } from 'react';
  import { doc, getDoc, addDoc, collection, setDoc } from 'firebase/firestore';
  import { auth, db } from '@/lib/firebaseClient';
  import { useDispatch, useSelector } from 'react-redux';
  import { RootState } from '@/components/store';
  import axios from 'axios';
  import { Configuration, OpenAIApi } from 'openai';
  import { fetchUserData, User } from '@/components/redux/userSlice';
  import { useRouter } from 'next/router';
  import { FiRotateCw } from 'react-icons/fi';
  import { onAuthStateChanged } from 'firebase/auth';
  import autosize from 'autosize';

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
    const [loading, setLoading] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [campaignTitle, setCampaignTitle] = useState<string | null>(null);
    const router = useRouter();
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const { campaignId } = router.query;
    const [currentMessage, setCurrentMessage] = useState<string | null>(null);
    const [displayedMessage, setDisplayedMessage] = useState<string | null>(null);
    const textareaRef = useRef(null);


    if (selectedLead) {
      console.log("Selected lead: " + selectedLead.toString());
    }

    const saveGeneratedMessage = async () => {
      if (isDeleted) {
        alert('The message has been deleted. Generate a new one before saving.');
        return;
      }

      if (!displayedMessage || displayedMessage.trim() === '') {
        alert('The message is empty. Please generate a message before saving.');
        return;
      }

      if (!selectedLead || !userId || !campaignId) return;

      const leadRef = doc(db, 'users', userId, 'leads', selectedLead.id);
      const leadDoc = await getDoc(leadRef);

      if (!leadDoc.exists()) {
        console.error('Lead does not exist');
        return;
      }

      const leadData = leadDoc.data();

      if (!leadData) {
        console.error('Invalid lead data');
        return;
      }

      const updatedLeadData = {
        ...leadData,
        generatedMessages: leadData.generatedMessages || [],
      };

      let messageIndex = updatedLeadData.generatedMessages.findIndex(
        (msg: { campaignId: string, message: string }) => msg.campaignId === campaignId
      );

      if (messageIndex !== -1) {
        updatedLeadData.generatedMessages[messageIndex].message = displayedMessage;
      } else {
        updatedLeadData.generatedMessages.push({ campaignId, message: displayedMessage });
      }

      await setDoc(leadRef, updatedLeadData);

      console.log('Message saved successfully');

      // Set isDeleted to true and clear the displayedMessage
      setIsDeleted(true);
      setDisplayedMessage(null);
    };



    async function generatePersonalizedMessage(lead: Lead, campaign: Campaign, user: User): Promise<string> {
      setLoading(true);
      const aboutInput = `Never forget the recipient's name is ${lead.firstName} ${lead.lastName}. The company values are ${user.companyValues} and we are solving ${user.problem}. Never forget our name is ${user.firstName} ${user.lastName}.`;

      try {
        const response = (lead.refresh) ? await axios.post('/api/refresh', { user, lead, campaign, currResult: displayedMessage }) : await axios.post('/api/openai', { user, lead, campaign });
        // F(response.data);
        if (response.data && response.data.message) {
          const message = response.data.message;

          const leadsCollectionRef = collection(
            db,
            'users',
            userId as string,
            'campaigns',
            campaign.id as string,
            'leads'
          );
          const leadRef = doc(leadsCollectionRef, lead.id as string);

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

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(null);
        }
      });
      return () => {
        unsubscribe();
      };
    }, []);

    useEffect(() => {
      async function fetchCampaignAndUserData() {
        if (!campaignId || !userId) return;

        const campaignDocRef = doc(db, 'users', userId, 'campaigns', campaignId as string);
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

        setCampaignTitle(campaignData.campaignTitle);

        const userDataRef = doc(db, 'users', userId);
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
      }

      fetchCampaignAndUserData();
    }, [campaignId, userId]);

    useEffect(() => {
      async function handleLeadSelectionAndMessageGeneration() {
        setLoading(true);
        if (!selectedLead || !userId || !campaignId) return;
  
        const leadRef = doc(db, 'users', userId, 'leads', selectedLead.id);
        const leadDoc = await getDoc(leadRef);
  
        if (leadDoc.exists()) {
          const leadData = leadDoc.data();
          if (leadData?.generatedMessages) {
            const campaignMessage = leadData.generatedMessages.find((msg: { campaignId: string, message: string }) => msg.campaignId === campaignId);
            if (campaignMessage) {
              setCurrentMessage(campaignMessage.message);
              setDisplayedMessage(campaignMessage.message);
              setLoading(false); // We found an existing message, so we stop loading here
              return;
            }
          }
        }
  
        // If the lead doesn't have generatedMessages or the generatedMessage for the campaign doesn't exist, set the finalMessage, currentMessage, and displayedMessage to an empty string
        setCurrentMessage('');
        setDisplayedMessage('');
        setLoading(false); // No message found, stop loading without generating a new one
  
        /* 
        const campaignDocRef = doc(db, 'users', userId, 'campaigns', campaignId as string);
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
  
        if (user) {
          const message = await generatePersonalizedMessage(
            JSON.parse(JSON.stringify(selectedLead)),
            campaign,
            JSON.parse(JSON.stringify(user))
          );
          setDisplayedMessage(message);
          if (!currentMessage) {
            setCurrentMessage(message);
          }
          setMessagesGenerated((prevCount) => prevCount + 1);
        }
        */
      }
  
      handleLeadSelectionAndMessageGeneration();
      // setLoading(false); // Remove this, as we're now handling the loading state inside the function
    }, [selectedLead, campaignId, userId, user]);

    useEffect(() => {
      if (currentMessage) {
        setDisplayedMessage(currentMessage);
      }
    }, [currentMessage]);

    useEffect(() => {
      if (textareaRef.current) {
        autosize(textareaRef.current);
      }
    }, [displayedMessage]);

    return (
      <div className="flex-grow overflow-y-auto h-full">
        <div className="relative flex border-b px-10 py-5 text-2xl">
          {campaignTitle ? campaignTitle : 'Loading...'}
        </div>
        <div className="flex-grow-0 px-10 py-5 flex flex-col justify-start items-start">
          <h1 className="mb-5 font-bold">Generating message for {selectedLead && selectedLead.firstName} {selectedLead && selectedLead.lastName}, {selectedLead && selectedLead.companyName}</h1>
          <div className="relative w-full min-h-60 overflow-y-auto">
          <textarea
          ref={textareaRef}
          className={`w-full h-full border text-black rounded-md ${loading ? 'opacity-50' : ''}`}
          value={displayedMessage || ''} // when displayedMessage is null, set the value to an empty string
          onChange={(e) => setDisplayedMessage(e.target.value)}
        ></textarea>
            {loading && (
              <div className="absolute inset-0 bg-gray-200 opacity-50 rounded-md flex justify-center items-center">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          <div className="flex space-x-2 justify-start items-center mt-5">
            <button
              className="px-4 py-2 border-[1px] rounded-md bg-brand text-white"
              onClick={saveGeneratedMessage}
              disabled={loading}
            >
              Save
            </button>
            <button className="h-full">
              <FiRotateCw size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default MessagePanel;
