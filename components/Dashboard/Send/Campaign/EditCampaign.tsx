import React, { useState, useEffect } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { RootState } from '@/components/store';
import { onAuthStateChanged } from 'firebase/auth';

interface EditCampaignProps {
    campaign: Campaign;
    onBack: () => void;
}

const EditCampaign: React.FC<EditCampaignProps> = ({ campaign, onBack }) => {
    const [editedCampaign, setEditedCampaign] = useState<Campaign>(campaign);
    const [userId, setUserId] = useState<string | null>(null);

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedCampaign = { ...editedCampaign, [event.target.name]: event.target.value };
        setEditedCampaign(updatedCampaign);
    };

    const handleGeneratePrompt = () => {
        const generatedPrompt = generatePrompt(editedCampaign);
        setEditedCampaign({ ...editedCampaign, generatedPrompt });
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const docRef = doc(db, 'users', userId as string, 'campaigns', campaign.id);
            await setDoc(docRef, editedCampaign, { merge: true });
            console.log('Campaign updated successfully');
            onBack();
        } catch (error) {
            console.error('Error updating campaign:', error);
        }
    };

    const deleteCampaign = async (campaignId: string) => {
        if (window.confirm("Are you sure you want to delete this campaign?")) {
            try {
                const docRef = doc(db, 'users', userId as string, 'campaigns', campaignId);
                await deleteDoc(docRef);
                console.log('Campaign deleted successfully');
                onBack();
            } catch (error) {
                console.error('Error deleting campaign:', error);
            }
        }
    };


    const generatePrompt = (campaign: Campaign) => {
        const generatedPrompt = `Craft a ${campaign.campaignTitle} for ${campaign.platform} with a maximum of ${campaign.wordLimit} words. The message should include a call to action for ${campaign.callToAction} and should be written in a ${campaign.toneOfVoice} tone. The purpose of this message is ${campaign.purpose}`;
        return generatedPrompt;
    };

    return (
        <div className=" text-black overflow-auto mb-5">
            <nav className="px-6 py-5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="-full p-2">
                        <FiArrowLeft size={24} />
                    </button>
                    <span className="text-xl">Edit Campaign</span>
                    <button className="flex items-center" onClick={() => deleteCampaign(campaign.id)}>
                        <FiTrash2 size={24} />
                    </button>
                </div>
            </nav>
            <div className="px-6 h-full">
                <div className="overflow-y-auto grid grid-cols-2 gap-10 w-full">
                    <div>
                        <h2 className="text-2xl mb-4">Campaign Details</h2>
                        <form onSubmit={handleSave} className="overflow-y-auto">
                            <div className="mb-4">
                                <label htmlFor="campaign-title" className="block text-sm">Campaign Title</label>
                                <input id="campaign-title" name="campaignTitle" value={editedCampaign.campaignTitle} onChange={handleChange} className="rounded-md w-full p-2 border-[1px]" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="platform" className="block text-sm">Platform</label>
                                <input id="platform" name="platform" value={editedCampaign.platform} onChange={handleChange} className="rounded-md w-full p-2 border-[1px]" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="call-to-action" className="block text-sm">Call To Action</label>
                                <input id="call-to-action" name="callToAction" value={editedCampaign.callToAction} onChange={handleChange} className="rounded-md w-full p-2 border-[1px]" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tone-of-voice" className="block text-sm">Tone of Voice</label>
                                <input id="tone-of-voice" name="toneOfVoice" value={editedCampaign.toneOfVoice} onChange={handleChange} className="rounded-md w-full p-2 border-[1px]" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="purpose" className="block text-sm">Purpose/goal for message</label>
                                <input id="purpose" name="purpose" value={editedCampaign.purpose} onChange={handleChange} className="rounded-md w-full p-2 border-[1px]" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="word-limit" className="block text-sm">Word Limit</label>
                                <input id="word-limit" placeholder="150" value={editedCampaign.wordLimit} onChange={handleChange} name="wordLimit" className="rounded-md w-full p-2 border-[1px]" />
                            </div>
                            <button type="button" onClick={handleGeneratePrompt} className="border-[1px] rounded-md bg-brand text-white mr-5 px-4 py-2">Generate Prompt</button>
                            <button type="submit" className="border-[1px] rounded-md bg-brand text-white px-4 py-2">Save</button>
                        </form>
                    </div>
                    <div>
                        <h2 className="text-2xl mb-4">Prompt</h2>
                        <textarea value={editedCampaign.generatedPrompt} className="rounded-md w-full p-2 h-64 border-[1px] text-black mb-4" readOnly></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCampaign;
