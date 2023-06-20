import React, { useEffect, useState } from 'react';
import { FiTrash2, FiEdit, FiCheck, FiRefreshCw } from "react-icons/fi";
import { auth, db } from '@/lib/firebaseClient';
import { doc, updateDoc, arrayRemove, getDoc, setDoc, arrayUnion, collection, getDocs, where, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { BsPlay } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { setSelectedLead } from '@/components/store/leadsSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { setCurrentMessage } from '@/components/store/messageSlice';


interface Campaign {
  id: string;
  leads: Lead[];
}

interface LinkedInLead {
  id: string;
  url: string;
}

interface LeadsSidebarProps {
  campaignId: string;
  userId: string | null;
}

const LeadsSidebar = ({ campaignId, userId }: LeadsSidebarProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [linkedinInput, setLinkedinInput] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [linkedinError, setLinkedinError] = useState<string>('');
  const [linkedInLeads, setLinkedInLeads] = useState<LinkedInLead[]>([]);
  const [editingUrl, setEditingUrl] = useState<string>('');
  const [editingId, setEditingId] = useState<string>('');
  const [currentLead, setCurrentLead] = useState<Lead | LinkedInLead | null>(null);
  const [refresh, setRefresh] = useState(false);


  const linkedinPattern = /^https:\/\/www\.linkedin\.com\/in\/[^\/]+\/$/; // Regex for LinkedIn URL pattern

  const handleLinkedInInput = async () => {
    const linkedInUrls = linkedinInput.split('\n').filter(url => linkedinPattern.test(url.trim()));
    if (linkedInUrls.length === 0) {
      setLinkedinError('Please double check your link structures. They should be structured in https://www.linkedin.com/in/username');
      return;
    }
    const linkedinLeadsCollection = collection(db, 'users', userId as string, 'campaigns', campaignId as string, 'linkedinLeads');

    for (const url of linkedInUrls) {
      const q = query(linkedinLeadsCollection, where("url", "==", url));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const newLinkedInLead = doc(linkedinLeadsCollection);
        await setDoc(newLinkedInLead, { url: url });
      }
    }

    setLinkedinInput('');
    setLinkedinError('');
  };

  useEffect(() => {
    const fetchLinkedInLeads = async () => {
      if (!userId) {
        console.error('userId is null');
        return;
      }
      const linkedinLeadsCollection = collection(db, 'users', userId, 'campaigns', campaignId as string, 'linkedinLeads');
      const linkedInLeadsSnap = await getDocs(linkedinLeadsCollection);
      setLinkedInLeads(linkedInLeadsSnap.docs.map(doc => ({ id: doc.id, url: doc.data().url })));
    }
    fetchLinkedInLeads();
  }, [campaignId, userId]);


  useEffect(() => {
    const fetchLeads = async () => {
      const campaignRef = doc(db, 'users', userId as string, 'campaigns', campaignId as string);
      const campaignSnap = await getDoc(campaignRef);
      const campaignData = campaignSnap.data() as Campaign;
      setLeads(campaignData.leads);
    }

    if (campaignId) {
      fetchLeads();
    }
  }, [campaignId, refresh]);

  const playLeadHandler = async (lead: Lead | LinkedInLead) => {
    if (!lead) return;
    console.log("Play button clicked for lead:", lead);

    // Fetch the associated generated message...
    const leadRef = doc(db, 'users', userId as string, 'leads', lead.id);
    const leadDoc = await getDoc(leadRef);

    if (leadDoc.exists()) {
      const leadData = leadDoc.data();
      // ...and dispatch it to the Redux store
      if (leadData?.generatedMessage) {
        dispatch(setCurrentMessage(leadData.generatedMessage));
      }
    }

    dispatch(setSelectedLead(lead));
  }



  const getLinkedInUsername = (url: string | undefined) => {
    return url ? url.replace('https://www.linkedin.com/in/', '') : '';
  }


  const editLinkedInLeadHandler = async (id: string, username: string) => {
    const url = `https://www.linkedin.com/in/${username}`;
    const linkedInLeadRef = doc(db, 'users', userId as string, 'campaigns', campaignId as string, 'linkedinLeads', id);
    await setDoc(linkedInLeadRef, { url: url });
    setLinkedInLeads(linkedInLeads.map(lead => lead.id === id ? { ...lead, url: url } : lead));
    setEditingUrl('');
    setEditingId('');
  }

  const removeLinkedInLeadHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this LinkedIn URL from the list?')) {
      const linkedInLeadRef = doc(db, 'users', userId as string, 'campaigns', campaignId as string, 'linkedinLeads', id);
      await updateDoc(linkedInLeadRef, { url: arrayRemove() });
      setLinkedInLeads(linkedInLeads.filter(lead => lead.id !== id));
    }
  }

  const removeLeadHandler = async (lead: Lead) => {
    if (window.confirm(`Are you sure you want to remove ${lead.firstName} ${lead.lastName} from the list?`)) {
      const campaignRef = doc(db, 'users', userId as string, 'campaigns', campaignId as string);
      await updateDoc(campaignRef, {
        leads: arrayRemove(lead)
      });

      setLeads(leads.filter(l => l.id !== lead.id));
    }
  }

  return (
    <div className="border-r-[1px] h-screen flex flex-col overflow-y-auto">
      <h1 className="p-5 text-3xl mt-5 border-b-[1px]">Leads</h1>
      {activeTab === 'leads' && leads.map((lead: Lead) => (
        lead && (
          <div key={lead.id} className="flex justify-between m-2 p-4 cursor-pointer rounded-md duration-100 hover:bg-gray-100" onClick={async () => {
            dispatch(setSelectedLead(lead));
          }}
          >
            {`${lead.firstName} ${lead.lastName}`}
            <div className="flex space-x-2 text-xl">
              <BsPlay className="cursor-pointer" onClick={() => playLeadHandler(lead)} />
              <FiTrash2 className="cursor-pointer" onClick={() => removeLeadHandler(lead)} />
            </div>
          </div>
        )
      ))}
      {modalOpen && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-60 z-10 flex justify-center items-center">
          <div className="bg-[#2C2F48] rounded-lg w-2/3 p-8">
            <h2 className="text-2xl text-black mb-8">Upload Leads</h2>
            <div className="flex">
              <div
                className={`cursor-pointer rounded-t-md py-2 px-4 ${activeTab === 'linkedin' ? 'bg-[#383B59]' : ''}`}
                onClick={() => setActiveTab('linkedin')}
              >
                LinkedIn URLs
              </div>
            </div>
            <div>
              <textarea
                className="mt-8 w-full h-48 bg-[#383B59] text-black p-2 rounded-md"
                placeholder="Paste LinkedIn URLs here..."
                value={linkedinInput}
                onChange={(e) => setLinkedinInput(e.target.value)}
              />
              <div className="text-red-500">{linkedinError}</div>
              <button className="mt-4 bg-[#383B59] text-black py-2 px-4 rounded-md" onClick={handleLinkedInInput}>
                Import
              </button>
            </div>
            <div className="mt-8 text-right">
              <button className="text-black" onClick={() => setModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default LeadsSidebar;
