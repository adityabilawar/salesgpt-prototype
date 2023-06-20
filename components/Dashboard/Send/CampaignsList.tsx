import { useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import { FiChevronDown, FiCircle, FiMail, FiSearch, FiEdit3, FiMoreHorizontal, FiUpload } from 'react-icons/fi';
import Link from 'next/link';
import { collection, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { useSelector, useDispatch } from 'react-redux';
import { addSelectedLead, clearSelectedLead, clearSelectedLeads } from '@/components/store/leadsSlice';
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import EditCampaign from './Campaign/EditCampaign';
import { RootState } from '@/components/store';
import { useRouter } from 'next/router';

interface Campaign {
    id: string;
    campaignTitle: string;
    // Add other campaign properties here
}

const CampaignsList = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
    const [campaignHasDocuments, setCampaignHasDocuments] = useState(false);
    const selectedLeads = useSelector((state: RootState) => state.leads.selectedLeads);
    const [userId, setUserId] = useState<string | null>(null);
    const [campaignsWithLeads, setCampaignsWithLeads] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);


    const sendLeads = async (campaignId: string) => {
        try {
            if (!userId) {
                console.error('User ID is null');
                return;
            }
 
            const docRef = doc(db, 'users', userId, 'campaigns', campaignId);
            await setDoc(docRef, { leads: selectedLeads }, { merge: true });
            dispatch(clearSelectedLeads());
        } catch (error) {
            console.error('Error sending leads:', error);
        }
    };

    useEffect(() => {
        if (!userId) {
            console.error('User ID is null');
            return;
        }

        const fetchCampaigns = () => {
            const campaignCollection = collection(db, 'users', userId, 'campaigns');
            const unsubscribe = onSnapshot(campaignCollection, (campaignSnapshot) => {
                const campaignsData: Campaign[] = campaignSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                } as Campaign));
                setCampaigns(campaignsData);
            });
            return unsubscribe;
        };

        const unsubscribe = fetchCampaigns();

        return () => {
            unsubscribe();
        };
    }, [userId]);

    const toggleOpen = (id: number) => {
        setIsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        const fetchLeadsForCampaigns = async () => {
            // Create a copy of the current campaignsWithLeads state
            const updatedCampaignsWithLeads = { ...campaignsWithLeads };

            // Iterate over each campaign
            for (const campaign of campaigns) {
                // Fetch the document for the campaign from Firestore
                const docRef = doc(db, 'users', userId as string, 'campaigns', campaign.id);
                const campaignDoc = await getDoc(docRef);

                // Update the value of the campaign in the object to indicate if it has leads or not
                updatedCampaignsWithLeads[campaign.id] = Boolean(campaignDoc.data()?.leads?.length);
            }

            // Update the state with the new values
            setCampaignsWithLeads(updatedCampaignsWithLeads);
        };

        // Only run this effect if there is a user and there are campaigns
        if (userId && campaigns.length) {
            fetchLeadsForCampaigns();
        }
    }, [campaigns, userId]);

    useEffect(() => {
        const fetchCampaignDocuments = async () => {
            // Iterate over each campaign
            for (const campaign of campaigns) {
                // Fetch the documents for the campaign from Firestore
                const campaignDocuments = await getDocs(collection(db, 'users', userId as string, 'campaigns', campaign.id, 'leads'));

                // Set campaignHasDocuments based on whether any documents were fetched
                setCampaignHasDocuments(!campaignDocuments.empty);
            }
        };
        fetchCampaignDocuments();
    }, [campaigns, userId]);
    return (
        <div className="border-r-[1px] flex flex-col">
            <div>
                <div className="relative flex border-b-[1px] px-10 py-5 text-2xl">Campaigns</div>

                <div className="m-10 border rounded-md h-full overflow-auto">
                    {!editingCampaign && (
                        <div className="flex-grow-0 px-5 py-5 flex space-x-5 border-b">
                            <Link href="/dashboard/create-campaign">
                                <button className="border-[1px] px-6 py-3 rounded-md bg-brand text-white md:text-sm lg:text-md">Add Campaign</button>
                            </Link>
                        </div>
                    )}
                    {editingCampaign ? (
                        <EditCampaign campaign={editingCampaign} onBack={() => setEditingCampaign(null)} />
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
                                                    <button
                                                        className="flex text-white bg-brand items-center rounded-md px-6 py-2"
                                                        onClick={() => setEditingCampaign(campaign)}
                                                    >
                                                        <FiEdit3 size={20} />
                                                        <p className="ml-2 md:text-sm lg:text-md ">Edit</p>
                                                    </button>
                                                    <button
                                                        className="flex bg-brand text-white items-center rounded-md px-6 py-2"
                                                        onClick={() => sendLeads(campaign.id)}
                                                    >
                                                        <FiUpload size={20} />
                                                        <p className="ml-2 md:text-sm lg:text-md">Send Leads</p>
                                                    </button>
                                                    <div className="group relative flex justify-center">
                                                        <button disabled={!campaignsWithLeads[campaign.id]} // Disable the button if the campaign has no leads
                                                            className={`group relative flex bg-brand ${!campaignsWithLeads[campaign.id] && "bg-gray-600"} text-white items-center rounded-md px-6 py-2 md:text-sm lg:text-md`}
                                                            onClick={() => {
                                                                router.push(`/dashboard/generate/${campaign.id}`);
                                                                dispatch(clearSelectedLead());
                                                            }}>View Campaign</button>
                                                         {!campaignsWithLeads[campaign.id] && <span className="absolute -top-14 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Upload leads before proceeding!</span> }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignsList;
