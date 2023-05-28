import Sidebar from '@/components/Dashboard/Sidebar'
import Navbar from '../../components/Profile/Navbar'
import RightBar from '../../components/Profile/RightBar'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setView } from '@/pages/store/sidebarSlice';
import Center from '@/components/Dashboard/Send/Center'

const send = () => {
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
                <div className="col-span-4"><Center /></div>
            </div>
        </div>
    )
}

export default send