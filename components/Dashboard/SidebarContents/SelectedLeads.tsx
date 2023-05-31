import React, { useEffect, useState } from 'react';
import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { Lead, removeLead } from "@/components/store/leadsSlice"
import { RootState } from '@/components/store';

const SelectedLeads = () => {
  const dispatch = useDispatch();
  const selectedLeads: Lead[] = useSelector((state: RootState) => state.leads.selectedLeads);
  const [activeTab, setActiveTab] = useState('leads');
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const storedProfileData = localStorage.getItem('about');
    if (storedProfileData) {
      const parsedProfileData = JSON.parse(storedProfileData);
      setProfileData(parsedProfileData);
    }
  }, []);

  const removeLeadHandler = (lead: Lead) => {
    if (window.confirm(`Are you sure you want to remove ${lead.firstName} ${lead.lastName} from the list?`)) {
      dispatch(removeLead(lead));
    }
  }

  return (
    <div className="border-r-[1px] h-screen flex flex-col">
      {activeTab === 'leads' && selectedLeads.map((lead: Lead) => (
        lead && (
          <div key={lead.id} className="flex w-full justify-between p-5">
            {`${lead.firstName} ${lead.lastName}`}
            <FiTrash2 onClick={() => removeLeadHandler(lead)} />
          </div>
        )
      ))}
    </div>
  )
}

export default SelectedLeads;
