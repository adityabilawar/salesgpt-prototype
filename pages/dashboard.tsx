import Sidebar from '@/components/Dashboard/Sidebar'
import Navbar from '../components/Profile/Navbar'
import Center from '@/components/Dashboard/LeadsList'
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setView } from '@/components/store/sidebarSlice';
import Profile from '@/components/Dashboard/SidebarContents/Profile';

const dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setView('PROFILE'));
  }, [dispatch]);

  return (
    <div className="text-black h-screen flex flex-col overflow-hidden">
      <div className="h-full overflow-y-auto">
        <Profile />
        <div className="flex flex-col">
          <Navbar />
          <div className="overflow-auto">
            <Center />
          </div>
        </div>
      </div>
    </div>
  )
}


export default dashboard;