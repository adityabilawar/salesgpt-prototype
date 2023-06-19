import { useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import { FiChevronDown, FiCircle, FiMail, FiSearch, FiEdit3, FiMoreHorizontal, FiUpload } from 'react-icons/fi';
import Link from 'next/link';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useSelector, useDispatch } from 'react-redux';
import { addSelectedLead, clearSelectedLead, clearSelectedLeads } from '@/components/store/leadsSlice';
import { doc, setDoc } from 'firebase/firestore';
import EditCampaign from './Campaign/EditCampaign';
import { RootState } from '@/components/store';
import { useRouter } from 'next/router';


const Center = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
    const selectedLeads = useSelector((state: RootState) => state.leads.selectedLeads);

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

    const toggleOpen = (id: number) => {
        setIsOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="border-r-[1px] h-screen flex flex-col">
            <div className="flex-grow">
                <div className="relative flex border-b-[1px] px-10 py-5 text-2xl">
                    Campaigns
                </div>

                <div className="m-10 border rounded-md">
                {!editingCampaign &&
                    <div className="flex-grow-0 px-5 py-5 flex space-x-5 border-b">
                        <Link href="/dashboard/create-campaign">
                            <button className="border-[1px] px-6 py-3 rounded-md bg-brand text-white">Add Campaign</button>
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
                        <div className="">
                            {campaigns.map((campaign, i) => {
                                return (
                                    <div className="flex flex-col border-b w-full" key={i}>
                                        <div className="flex justify-between items-center w-full" onClick={() => toggleOpen(i)}>
                                            <div className="flex items-center p-4">
                                                <p className="ml-2">{campaign.campaignTitle}</p>
                                            </div>
                                            <div className="flex p-4">
                                            <div className="flex space-x-5">
                                                    <button className="flex text-white bg-brand items-center rounded-md px-6 py-2" onClick={() => setEditingCampaign(campaign)}>
                                                        <FiEdit3 size={24} />
                                                        <p className="ml-2">Edit</p>
                                                    </button>
                                                    <button className="flex bg-brand text-white items-center rounded-md px-6 py-2" onClick={() => sendLeads(campaign.id)}>
                                                        <FiUpload size={24} />
                                                        <p className="ml-2">Send Leads</p>
                                                    </button>
                                                    <button className="flex bg-brand text-white items-center rounded-md px-6 py-2" onClick={() => {
                                                        router.push(`/dashboard/generate/${campaign.id}`);
                                                        dispatch(clearSelectedLead());
                                                    }}>
                                                            <p className="ml-2">View Campaign</p>
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                }
                </div>
            </div>
        </div>
    )
}

export default Center
