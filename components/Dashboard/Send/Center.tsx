import { useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import { FiChevronDown, FiCircle, FiMail, FiSearch, FiEdit3, FiMoreHorizontal, FiUpload } from 'react-icons/fi';
import Link from 'next/link';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useSelector, useDispatch } from 'react-redux';
import { addSelectedLead, clearSelectedLeads } from '@/components/store/leadsSlice';
import { doc, setDoc } from 'firebase/firestore';
import EditCampaign from './Campaign/EditCampaign';
interface Campaign {
    id: string;
    campaignTitle: string;
    generatedPrompt: string;
    leads?: any[]; 
}


const Center = () => {
    const dispatch = useDispatch();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
    const selectedLeads = useSelector(state => state.leads.selectedLeads);

    const sendLeads = async (campaignId: string) => {
        try {
            const docRef = doc(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'campaigns', campaignId);
            await setDoc(docRef, { leads: selectedLeads }, { merge: true });
            dispatch(clearSelectedLeads());
        } catch (error) {
            console.error("Error sending leads: ", error);
        }
    };


    useEffect(() => {
        const fetchCampaigns = () => {
            const campaignCollection = collection(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'campaigns');
            const unsubscribe = onSnapshot(campaignCollection, (campaignSnapshot) => {
                const campaignsData: Campaign[] = campaignSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
                setCampaigns(campaignsData);
            });
            return unsubscribe;
        }
    
        const unsubscribe = fetchCampaigns();
    
        return () => {
            unsubscribe();
        }
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
                {!editingCampaign &&
                    <div className="flex-grow-0 px-10 py-5 flex space-x-5">
                        <Link href="/dashboard/create-campaign">
                            <button className="border-[1px] px-6 py-3">Add Campaign</button>
                        </Link>
                    </div>
                }
                {
                    editingCampaign ? (
                        <EditCampaign
                            campaign={editingCampaign}
                            onBack={() => setEditingCampaign(null)}
                        />
                    ) : (
                        <div className="p-10 space-y-4">
                            {campaigns.map((campaign, i) => {
                                return (
                                    <div className="flex flex-col border border-white w-full select-none" key={i}>
                                        <div className="flex justify-between items-center w-full cursor-pointer" onClick={() => toggleOpen(i)}>
                                            <div className="flex items-center p-4">
                                                <p className="ml-2">{campaign.campaignTitle}</p>
                                            </div>
                                            <div className="flex p-4">
                                                <FiChevronDown size={24} />
                                            </div>
                                        </div>
                                        {isOpen[i] && (
                                            <div className="flex flex-col space-y-6 items-start p-4 border-t border-white">
                                                <div className="">{campaign.generatedPrompt}</div>
                                                <div className="flex space-x-5">
                                                    <button className="flex items-center border-[1px] px-6 py-2" onClick={() => setEditingCampaign(campaign)}>
                                                        <FiEdit3 size={24} />
                                                        <p className="ml-2">Edit</p>
                                                    </button>
                                                    <button className="flex items-center border-[1px] px-6 py-2" onClick={() => sendLeads(campaign.id)}>
                                                        <FiUpload size={24} />
                                                        <p className="ml-2">Send Leads</p>
                                                    </button>
                                                    <Link href={`/dashboard/generate/${campaign.id}`}>
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
                    )
                }
            </div>
        </div>
    )
}

export default Center
