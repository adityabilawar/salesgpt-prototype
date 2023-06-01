import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import Content from '@/components/Dashboard/Send/Campaign/Content';
import MessagePanel from '@/components/Dashboard/Send/MessagePanel';
import Navbar from '@/components/Profile/Navbar';
import Sidebar from '@/components/Dashboard/Sidebar';
import LeadsSidebar from '@/components/Dashboard/Send/Campaign/LeadsSidebar';

interface Campaign {
    id: string;
    campaignTitle: string;
    generatedPrompt: string;
    leads?: any[];
}

const CampaignPage = () => {
    const router = useRouter();
    const { campaignId } = router.query;

    const [campaign, setCampaign] = useState<Campaign | null>(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            const docRef = doc(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'campaigns', campaignId as string);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setCampaign({ id: docSnap.id, ...docSnap.data() } as Campaign);
            } else {
                console.log("document doesn't exist");
            }
        }

        if (campaignId) {
            fetchCampaign();
        }
    }, [campaignId]);

    // Render your campaign data
    return (
        <div>
            {campaign && (
                <div className="text-white">
                    <div className="border-b-[1px] p-10">
                        <Navbar />
                    </div>
                    <div className="grid grid-cols-5">
                        <LeadsSidebar />
                        <div className="col-span-4"><MessagePanel /></div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CampaignPage;
