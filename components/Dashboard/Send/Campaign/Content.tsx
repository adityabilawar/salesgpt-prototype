import { useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import { FiChevronDown, FiCircle, FiMail, FiSearch, FiEdit3, FiMoreHorizontal, FiUpload } from 'react-icons/fi';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient'; // Replace with your Firebase config import path
import { useSelector, useDispatch } from 'react-redux';
import { addSelectedLead, clearSelectedLeads } from '@/components/store/leadsSlice';
import { doc, setDoc } from 'firebase/firestore';
interface Campaign {
    id: string;
    campaignTitle: string;
    generatedPrompt: string;
    leads?: any[];
}


const Content = () => {
    const dispatch = useDispatch();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
    const selectedLeads = useSelector(state => state.leads.selectedLeads);

    const sendLeads = async (campaignId: string) => {
        try {
            // Replace with your Firebase doc path
            const docRef = doc(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'campaigns', campaignId);
            // Set the leads data to Firebase
            await setDoc(docRef, { leads: selectedLeads }, { merge: true });
            // Clear the Redux leads data
            dispatch(clearSelectedLeads());
        } catch (error) {
            console.error("Error sending leads: ", error);
        }
    };


    useEffect(() => {
        const fetchCampaigns = async () => {
            const campaignCollection = collection(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'campaigns');
            const campaignSnapshot = await getDocs(campaignCollection);
            const campaignsData: Campaign[] = campaignSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
            setCampaigns(campaignsData);
        }

        fetchCampaigns();
    }, []);

    const toggleOpen = (id: string) => {
        setIsOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="border-r-[1px] h-screen flex flex-col">
            <div className="flex-grow">
                <div className="relative flex border-b-[1px] px-10 py-5 text-2xl">
                    Campaigns
                </div>
                <div className="flex-grow-0 px-10 py-5 flex space-x-5">
                    <Link href="/dashboard/create-campaign">
                        <button className="border-[1px] px-6 py-3">Add Campaign</button>
                    </Link>
                </div>
                <div className="p-10 space-y-4">
                    {campaigns.map((campaign, i) => {
                        return (
                            <div className="flex flex-col border border-white w-full select-none" key={i}>
                                <div className="grid grid-cols-4 items-center cursor-pointer">
                                    <div className="flex items-center p-4 col-span-1">
                                        <p className="ml-2">{campaign.campaignTitle}</p>
                                    </div>
                                    <div className="flex items-end justify-end p-4 col-span-3" onClick={() => toggleOpen(i)}>
                                        <FiChevronDown size={24} />
                                    </div>
                                </div>
                                {isOpen[i] && (
                                    <div className="flex flex-col space-y-6 items-start p-4 border-t border-white">
                                        <div className="">{campaign.generatedPrompt}</div>
                                        <div className="flex space-x-5">
                                            <button className="flex items-center border-[1px] px-6 py-2">
                                                <FiEdit3 size={24} />
                                                <p className="ml-2">Edit</p>
                                            </button>
                                            <button className="flex items-center border-[1px] px-6 py-2" onClick={() => sendLeads(campaign.id)}>
                                                <FiUpload size={24} />
                                                <p className="ml-2">Send Leads</p>
                                            </button>
                                            <Link href="/dashboard/generate">
                                                <button className="flex items-center border-[1px] px-6 py-2">
                                                    <p className="ml-2">Continue</p>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Content
