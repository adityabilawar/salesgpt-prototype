import React, { useEffect, useState } from 'react';
import { FiTrash2, FiEdit, FiCheck, FiRefreshCw } from "react-icons/fi";
import { auth, db } from '@/lib/firebaseClient';
import { doc, updateDoc, arrayRemove, getDoc, setDoc, arrayUnion, collection, getDocs, where, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { BsPlay } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { setSelectedLead } from '@/components/store/leadsSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { setCurrentMessage, setDisplayedMessage } from '@/components/store/messageSlice';


interface Campaign {
  id: string;
  leads: Lead[];
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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingUrl, setEditingUrl] = useState<string>('');
  const [editingId, setEditingId] = useState<string>('');
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [refresh, setRefresh] = useState(false);


  const linkedinPattern = /^https:\/\/www\.linkedin\.com\/in\/[^\/]+\/$/; // Regex for LinkedIn URL pattern

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

  const playLeadHandler = async (lead: Lead) => {
    if (!lead) return;
    console.log("Play button clicked for lead:", lead);
    dispatch(setSelectedLead(lead));
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
          <div
            key={lead.id}
            className="flex justify-between m-2 p-4 cursor-pointer rounded-md duration-100 hover:bg-gray-100"
            onClick={() => {
              console.log(lead);
              console.log(campaignId)
              if (lead.generatedMessages) {
                console.log("true")
                const leadMessage = lead.generatedMessages.find((msg: { campaignId: string, message: string }) => msg.campaignId === campaignId);
                if (leadMessage) {
                  dispatch(setCurrentMessage(leadMessage.message));
                } else {
                  console.log(`No generated message associated with campaignId ${campaignId} for lead ${lead.id}`);
                }
              } else {
                console.log(`No generated messages for lead ${lead.id}`);
              }
              dispatch(setSelectedLead(lead));
            }}
          >
            {`${lead.firstName} ${lead.lastName}`}
            <div className="flex space-x-2 text-xl">
              <BsPlay className="cursor-pointer" onClick={(e) => playLeadHandler(lead)} />
              <FiTrash2 className="cursor-pointer" onClick={(e) => {
                removeLeadHandler(lead);
              }} />
            </div>
          </div>
        )
      ))}
    </div>
  )
}

export default LeadsSidebar;
