import { useState, useEffect } from "react";
import { animated, useSpring } from "react-spring";
import {
  FiChevronDown,
  FiCircle,
  FiMail,
  FiSearch,
  FiEdit3,
  FiMoreHorizontal,
  FiUpload,
} from "react-icons/fi";
import Link from "next/link";
import { collection, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useSelector, useDispatch } from "react-redux";
import {
  addSelectedLead,
  clearSelectedLead,
  clearSelectedLeads,
} from "@/components/store/leadsSlice";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import EditCampaign from "./Campaign/EditCampaign";
import { RootState } from "@/components/store";
import { useRouter } from "next/router";
import { PlusIcon } from "@heroicons/react/solid";

interface Campaign {
  id: string;
  campaignTitle: string;
  // Add other campaign properties here
}

NProgress.configure({ showSpinner: false });

const CampaignsList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
  const [campaignHasDocuments, setCampaignHasDocuments] = useState(false);
  const [loading, setLoading] = useState(true);
  const selectedLeads = useSelector(
    (state: RootState) => state.leads.selectedLeads
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [campaignsWithLeads, setCampaignsWithLeads] = useState<
    Record<string, boolean>
  >({});


  const sendLeads = async (campaignId: string) => {
    try {
      if (!userId) {
        console.error("User ID is null");
        return;
      }
  
      const docRef = doc(db, "users", userId, "campaigns", campaignId);
      const docSnap = await getDoc(docRef);
  
      const existingLeads = docSnap.data()?.leads ?? [];
  
      const updatedLeads = [...existingLeads];
  
      for (const lead of selectedLeads) {
        // Check if the lead.id exists in the array of existing lead IDs
        if (!existingLeads.some(existingLead => existingLead.id === lead.id)) {
          updatedLeads.push(lead);
        }
      }
  
      await setDoc(docRef, { leads: updatedLeads }, { merge: true });
      dispatch(clearSelectedLeads());
    } catch (error) {
      console.error("Error sending leads:", error);
    }
  };
  
  
  useEffect(() => {
    NProgress.start();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
      NProgress.done();
    });
    return () => {
      NProgress.remove();
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    if (!userId) {
      setLoading(true);
      return;
    } else {
      setLoading(false);
    }
  
    const fetchCampaigns = () => {
      const campaignCollection = collection(db, "users", userId, "campaigns");
      const unsubscribe = onSnapshot(campaignCollection, campaignSnapshot => {
        const campaignsData: Campaign[] = campaignSnapshot.docs.map(
          doc => ({
            id: doc.id,
            ...doc.data(),
          } as Campaign)
        );
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
    setIsOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchLeadsForCampaigns = async () => {
      const updatedCampaignsWithLeads = { ...campaignsWithLeads };

      for (const campaign of campaigns) {
        const docRef = doc(
          db,
          "users",
          userId as string,
          "campaigns",
          campaign.id
        );
        const campaignDoc = await getDoc(docRef);

        updatedCampaignsWithLeads[campaign.id] = Boolean(
          campaignDoc.data()?.leads?.length
        );
      }

      setCampaignsWithLeads(updatedCampaignsWithLeads);
    };

    if (userId && campaigns.length) {
      fetchLeadsForCampaigns();
    }
  }, [campaigns, userId]);

  useEffect(() => {
    const fetchCampaignDocuments = async () => {
      for (const campaign of campaigns) {
        const campaignDocuments = await getDocs(
          collection(
            db,
            "users",
            userId as string,
            "campaigns",
            campaign.id,
            "leads"
          )
        );
        setCampaignHasDocuments(!campaignDocuments.empty);
      }
    };
    fetchCampaignDocuments();
  }, [campaigns, userId]);

  if (loading) {
    return null;
  }
  return (
    <div className="border-r-[1px] flex flex-col">
      <div>
        <div className="relative flex border-b-[1px] px-10 py-5 text-2xl">
          Campaigns
        </div>

        <div className="m-10 border rounded-md h-full overflow-auto">
          {!editingCampaign && (
            <div className="flex-grow-0 px-5 py-5 flex space-x-5 border-b flex items-center justify-between">
              {/* <div className="flex-grow" /> */}
              <h2 className="font-semibold text-sm">CAMPAIGN TITLE</h2>
              <Link href="/dashboard/create-campaign">
                <button className="border-[1px] px-6 py-3 rounded-md bg-emerald-600 text-white md:text-sm lg:text-md">
                  <div className="flex justify-center items-center gap-x-1">
                    <PlusIcon className="h-4 w-4"/>
                    <p className="text-sm">Add Campaign</p>
                  </div>
                </button>
              </Link>
            </div>
          )}

          {/* <p>yooo</p> */}
          {editingCampaign ? (
            <EditCampaign
              campaign={editingCampaign}
              onBack={() => setEditingCampaign(null)}
            />
          ) : (
            <div className="">
              {campaigns.length === 0 ? (
                <p className="flex justify-center p-10 text-gray-500">
                  No campaigns created currently
                </p>
              ) : (
                campaigns.map((campaign, i) => {
                  return (
                    <div className="flex flex-col border-b w-full" key={i}>
                      <div
                        className="flex justify-between items-center w-full"
                        onClick={() => toggleOpen(i)}
                      >
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
                              <p className="ml-2 md:text-sm lg:text-md ">
                                Edit
                              </p>
                            </button>
                            <button
                              className="flex bg-brand text-white items-center rounded-md px-6 py-2"
                              onClick={() => sendLeads(campaign.id)}
                            >
                              <FiUpload size={20} />
                              <p className="ml-2 md:text-sm lg:text-md">
                                Send Leads
                              </p>
                            </button>
                            <div className="group relative flex justify-center">
                              <button
                                disabled={!campaignsWithLeads[campaign.id]} // Disable the button if the campaign has no leads
                                className={`group relative flex bg-gray-800 ${
                                  !campaignsWithLeads[campaign.id] &&
                                  "bg-gray-600"
                                } text-white items-center rounded-md px-6 py-2 md:text-sm lg:text-md`}
                                onClick={() => {
                                  router.push(
                                    `/dashboard/generate/${campaign.id}`
                                  );
                                  dispatch(clearSelectedLead());
                                }}
                              >
                                View Campaign
                              </button>
                              {!campaignsWithLeads[campaign.id] && (
                                <span className="absolute -top-14 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                                  Upload leads before proceeding!
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignsList;
