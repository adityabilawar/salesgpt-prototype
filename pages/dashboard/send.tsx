import Sidebar from '@/components/Dashboard/Sidebar'
import Navbar from '../../components/Profile/Navbar'
import RightBar from '../../components/Profile/RightBar'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setView } from '@/components/store/sidebarSlice';
import Center from '@/components/Dashboard/Send/CampaignsList'

const send = () => {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(setView('SELECTED_LEADS'));
    }, [dispatch]);
    return (
        <div>
            <div className="grid grid-cols-5">
                <Sidebar />
                <div className="col-span-4"><Center /></div>
            </div>
        </div>
    )
}

export default send