import React, { useEffect, useState } from 'react';
import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { removeLead } from "@/components/store/leadsSlice"
import { RootState } from '@/components/store';
import { db } from '@/lib/firebaseClient';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';

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

  const removeLeadHandler = async (lead: Lead) => {
    if (window.confirm(`Are you sure you want to remove ${lead.firstName} ${lead.lastName} from the list?`)) {
      dispatch(removeLead(lead));
    }
  }

  return (
    <div className="border-r-[1px] h-screen flex flex-col">
      <h1 className="px-5 text-xl py-10">Selected leads</h1>
      {selectedLeads.length > 0 ? (
        selectedLeads.map((lead: Lead) => (
          lead && (
            <div key={lead.id} className="flex w-full justify-between p-5">
              {`${lead.firstName} ${lead.lastName}, ${lead.companyName}`}
              <FiTrash2 onClick={() => removeLeadHandler(lead)} />
            </div>
          )
        ))
      ) : (
        <div className="p-10 h-full">
          <p>There are no leads selected. Please go back to the dashboard to select leads.</p>
        </div>
      )}
    </div>
  )
}

export default SelectedLeads;
