import React, { useEffect, useState } from 'react';
import Profile from './SidebarContents/Profile';
import LeadDetails from './SidebarContents/LeadDetails';
import SelectedLeads from './SidebarContents/SelectedLeads';
import { useSelector } from 'react-redux'

const Sidebar = () => {
    const view = useSelector((state: any) => state.sidebar.view);

    let content;
    if (view === 'PROFILE') {
        content = <Profile />;
    } else if (view === 'LEAD_DETAILS') {
        content = <LeadDetails />;
    } else if (view === 'SELECTED_LEADS') {
        content = <SelectedLeads />;
    }
    return (
        <div className="border-r-[1px] h-screen flex flex-col">
        {content}
    </div>
    )
}

export default Sidebar
