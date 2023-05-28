import React, { useEffect, useState } from 'react';
import { BsPlusLg, BsTelephone, BsThreeDots } from "react-icons/bs"
import { AiOutlineMail } from "react-icons/ai"
import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { removeLead } from "@/pages/store/leadsSlice"
import { animated, useSpring } from 'react-spring';

const SelectedLeads = () => {
    const dispatch = useDispatch();
    const selectedLeads = useSelector(state => state.leads.selectedLeads) || [];
    const filteredLeads = selectedLeads ? selectedLeads.filter(Boolean) : [];
    const [activeTab, setActiveTab] = useState('leads');
    const [profileData, setProfileData] = useState(null);
    const springProps = useSpring({
        borderBottom: activeTab === 'leads' ? '2px solid white' : '2px solid white',
        left: activeTab === 'leads' ? '0%' : '50%',
        position: 'absolute',
        width: '50%',
        bottom: 0,
        config: { friction: 30, tension: 180 },
    });


    useEffect(() => {
        const storedProfileData = localStorage.getItem('about');
        if (storedProfileData) {
            const parsedProfileData = JSON.parse(storedProfileData);
            setProfileData(parsedProfileData);
        }
    }, []);

    const removeLeadHandler = (lead) => {
        if (window.confirm(`Are you sure you want to remove ${lead.leadName} from the list?`)) {
            dispatch(removeLead(lead));
        }
    }
    return (
        <div className="border-r-[1px] h-screen flex flex-col">
            {activeTab === 'leads' && selectedLeads.map((lead, i) => (
                lead && (
                    <div key={i} className="flex w-full justify-between p-5">
                        {lead.leadName}
                        <FiTrash2 onClick={() => removeLeadHandler(lead)} />
                    </div>
                )
            ))}
        </div>
    )
}

export default SelectedLeads