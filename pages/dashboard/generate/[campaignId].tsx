import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import Content from '@/components/Dashboard/Send/Campaign/Content';
import MessagePanel from '@/components/Dashboard/Send/MessagePanel';
import Navbar from '@/components/Profile/Navbar';
import Sidebar from '@/components/Dashboard/Sidebar';
import LeadsSidebar from '@/components/Dashboard/Send/Campaign/LeadsSidebar';
import { onAuthStateChanged } from 'firebase/auth';


const CampaignPage = () => {
    const router = useRouter();
    const { campaignId } = router.query;
    const [userId, setUserId] = useState<string | null>(null);
    const [campaign, setCampaign] = useState<Campaign | null>(null);

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

    useEffect(() => {
        const fetchCampaign = async () => {
            if (userId && campaignId) { // Check if both userId and campaignId have valid values
                const docRef = doc(db, 'users', userId as string, 'campaigns', campaignId as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCampaign({ id: docSnap.id, ...docSnap.data() } as Campaign);
                } else {
                    console.log("document doesn't exist");
                }
            }
        };

        fetchCampaign(); // Call the fetchCampaign function directly since it doesn't depend on campaignId in the dependency array
    }, [userId, campaignId]);

    return (
        <div>
            {campaign && (
                <div className="text-black">
                    <div className="grid grid-cols-5 overflow-hidden">
                        <LeadsSidebar userId={userId} campaignId={campaignId} />
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
