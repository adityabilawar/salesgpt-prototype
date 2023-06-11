import Sidebar from '@/components/Dashboard/Sidebar'
import Navbar from '../components/Profile/Navbar'
import Center from '@/components/Dashboard/LeadsList'
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setView } from '@/components/store/sidebarSlice';

const dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setView('PROFILE'));
  }, [dispatch]);

  return (
    <div className="text-white h-screen flex flex-col overflow-hidden">
      <div className="grid grid-cols-5 h-full overflow-hidden">
        <Sidebar />
        <div className="col-span-4 flex flex-col">
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