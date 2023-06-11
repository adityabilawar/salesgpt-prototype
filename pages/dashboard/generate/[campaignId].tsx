import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import Content from '@/components/Dashboard/Send/Campaign/Content';
import MessagePanel from '@/components/Dashboard/Send/MessagePanel';
import Navbar from '@/components/Profile/Navbar';
import Sidebar from '@/components/Dashboard/Sidebar';
import LeadsSidebar from '@/components/Dashboard/Send/Campaign/LeadsSidebar';


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
    return (
        <div>
            {campaign && (
                <div className="text-white">
                    <div className="grid grid-cols-5 overflow-hidden">
                        <LeadsSidebar />
                        <div className="col-span-4 overflow-y-auto">
                            <MessagePanel />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CampaignPage;
