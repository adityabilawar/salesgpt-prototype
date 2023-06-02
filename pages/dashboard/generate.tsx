import Sidebar from '@/components/Dashboard/Sidebar'
import Navbar from '../../components/Profile/Navbar'
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setView } from '@/components/store/sidebarSlice';
import MessagePanel from '@/components/Dashboard/Send/MessagePanel';

const Generate = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setView('SELECTED_LEADS'));
    }, [dispatch]);

    return (
        <div className="text-white">
            <div className="border-b-[1px] p-10">
                <Navbar />
            </div>
            <div className="grid grid-cols-5">
                <Sidebar />
                <div className="col-span-4"><MessagePanel /></div>
            </div>
        </div>
    )
}

export default Generate
