import Sidebar from '@/components/Dashboard/Sidebar'
import Navbar from '../components/Profile/Navbar'
import RightBar from '../components/Profile/RightBar'
import Center from '@/components/Dashboard/Center'
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setView } from '@/components/store/sidebarSlice';

const dashboard = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setView('PROFILE'));
    }, [dispatch]);

    return (
        <div className="text-white">
            <div className="border-b-[1px] p-10">
                <Navbar />
            </div>
            <div className="grid grid-cols-5">
                <Sidebar />
                <div className="col-span-4"><Center /></div>
            </div>
        </div>
    )
}

export default dashboard
