import React, { useEffect, useState } from 'react';
import { FiTrash2 } from "react-icons/fi";
import { db } from '@/lib/firebaseClient';
import { doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { BsPlay } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { setSelectedLead } from '@/components/store/leadsSlice';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  jobTitle: string;
  linkedIn: string;
  phone: string;
}

interface Campaign {
  id: string;
  leads: Lead[];
}

const LeadsSidebar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { campaignId } = router.query;
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const campaignRef = doc(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'campaigns', campaignId as string);
      const campaignSnap = await getDoc(campaignRef);
      const campaignData = campaignSnap.data() as Campaign;
      setLeads(campaignData.leads);
    }

    if (campaignId) {
      fetchLeads();
    }
  }, [campaignId]);

  const playLeadHandler = async (lead: Lead) => {
    console.log("Play button clicked for lead:", lead);
    dispatch(setSelectedLead(lead));
  }
  

  const removeLeadHandler = async (lead: Lead) => {
    if (window.confirm(`Are you sure you want to remove ${lead.firstName} ${lead.lastName} from the list?`)) {
      const userId = 'jOgfvrI7EfqjqcH2Gfeo';
      const campaignRef = doc(db, 'users', userId, 'campaigns', campaignId as string);
      await updateDoc(campaignRef, {
        leads: arrayRemove(lead)
      });

      setLeads(leads.filter(l => l.id !== lead.id));
    }
  }

  return (
    <div className="border-r-[1px] h-screen flex flex-col">
      {activeTab === 'leads' && leads.map((lead: Lead) => (
        lead && (
          <div key={lead.id} className="flex w-full justify-between p-5">
            {`${lead.firstName} ${lead.lastName}`}
            <div className="flex space-x-2 text-xl">
              <BsPlay className="cursor-pointer" onClick={() => playLeadHandler(lead)} />
              <FiTrash2 className="cursor-pointer" onClick={() => removeLeadHandler(lead)} />
            </div>
          </div>
        )
      ))}
    </div>
  )
}

export default LeadsSidebar;
