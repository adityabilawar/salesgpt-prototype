import { FiArrowLeftCircle } from 'react-icons/fi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, updateUserData } from '@/components/redux/userSlice';
import { RootState } from '@/components/store';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';


const index = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user);
    const [prompt, setPrompt] = useState<string>('');

    useEffect(() => {
        dispatch(fetchUserData('jOgfvrI7EfqjqcH2Gfeo')); 
    }, [dispatch]);

    const handleGoBack = () => {
        router.back();
    };

    const handleSave = (event) => {
        event.preventDefault();
        dispatch(updateUserData({ userId: 'jOgfvrI7EfqjqcH2Gfeo', updatedData: userData })); 
    };

    const handleChange = (event) => {
        dispatch(updateUserData({ userId: 'jOgfvrI7EfqjqcH2Gfeo', updatedData: { ...userData, [event.target.name]: event.target.value } })); 
    };

    const saveCampaign = async (event) => {
        event.preventDefault();
        const campaignTitle = event.target.elements.campaignTitle.value;
        const platform = event.target.elements.platform.value;
        const callToAction = event.target.elements.callToAction.value;
        const toneOfVoice = event.target.elements.toneOfVoice.value;
        const purpose = event.target.elements.purpose.value;

        const generatedPrompt = generatePrompt(campaignTitle, platform, callToAction, toneOfVoice, purpose);
        setPrompt(generatedPrompt);

        try {
            await addDoc(collection(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'campaigns'), {
                campaignTitle: campaignTitle,
                platform: platform,
                callToAction: callToAction,
                toneOfVoice: toneOfVoice,
                purpose: purpose,
                generatedPrompt: generatedPrompt,
            });

            console.log('Campaign saved successfully');
        } catch (error) {
            console.error('Error saving campaign:', error);
        }
    };


    const generatePrompt = (campaignTitle: string = '', platform: string = '', callToAction: string = '', toneOfVoice: string = '', purpose: string = '') => {
        const generatedPrompt = `Craft a ${campaignTitle} for ${platform}. The message should include a call to action for ${callToAction} and should be written in a ${toneOfVoice} tone. The purpose of this message is ${purpose}`;
        return generatedPrompt;
    };


    return (
        <div className=" text-white h-full min-h-screen">
            <nav className="px-6 py-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={handleGoBack} className="-full p-2">
                        <FiArrowLeftCircle size={42} />
                    </button>
                    <span className="text-2xl">Create Campaign</span>
                </div>
            </nav>
            <div className="grid grid-cols-5 gap-6 p-6">
                <div className="col-span-2">
                    <h2 className="text-2xl mb-4">User Information</h2>
                    <form onSubmit={handleSave}>
                        <div className="mb-4">
                            <label htmlFor="first-name" className="block text-sm">First Name</label>
                            <input id="first-name" name="firstName" value={userData.firstName} onChange={handleChange} className="w-full p-2 border-[1px] " />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="last-name" className="block text-sm">Last Name</label>
                            <input id="last-name" name="lastName" value={userData.lastName} onChange={handleChange} className="w-full p-2 border-[1px] " />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="company-name" className="block text-sm">Company Name</label>
                            <input id="company-name" name="companyName" value={userData.companyName} onChange={handleChange} className="w-full p-2 border-[1px] " />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="job-title" className="block text-sm">Job Title</label>
                            <input id="job-title" name="jobTitle" value={userData.jobTitle} onChange={handleChange} className="w-full p-2 border-[1px] " />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="company-description" className="block text-sm">Company Description</label>
                            <textarea id="company-description" name="companyInfo" value={userData.companyInfo} onChange={handleChange} className="bg-transparent w-full p-2 border-[1px] border-white" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="company-values" className="block text-sm">Company Values</label>
                            <textarea id="company-values" name="companyValues" value={userData.companyValues} onChange={handleChange} className="bg-transparent w-full p-2 border-[1px] border-white" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="problem" className="block text-sm">Problem Being Solved</label>
                            <textarea id="problem" name="problem" value={userData.problem} onChange={handleChange} className="bg-transparent w-full p-2 border-[1px] border-white" />
                        </div>
                        <button type="submit">Save</button>
                    </form>
                </div>
                <div className="col-span-3">
                    <h2 className="text-2xl mb-4">Campaign Details</h2>
                    <form onSubmit={saveCampaign}>
                        <div className="mb-4">
                            <label htmlFor="campaign-title" className="block text-sm">Campaign Title</label>
                            <input required placeholder="Cold Messaging" id="campaign-title" name="campaignTitle" className="w-full p-2 border-[1px]" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="platform" className="block text-sm">Platform</label>
                            <input required placeholder="LinkedIn" id="platform" name="platform" className="w-full p-2 border-[1px]" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="call-to-action" className="block text-sm">Call To Action</label>
                            <input required placeholder="More follow up calls" id="call-to-action" name="callToAction" className="w-full p-2 border-[1px]" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="tone-of-voice" className="block text-sm">Tone of Voice</label>
                            <input required placeholder="Humorous" id="tone-of-voice" name="toneOfVoice" className="w-full p-2 border-[1px]" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="purpose" className="block text-sm">Purpose/goal for message</label>
                            <input required placeholder="To introduce our services to potential clients" id="purpose" name="purpose" className="w-full p-2 border-[1px]" />
                        </div>
                        <button type="submit" onClick={generatePrompt} className="border-[1px] px-4 py-2">Save and Generate Prompt</button>
                    </form>

                    <hr className="my-4" />
                    <h2 className="text-2xl mb-4">Prompt</h2>
                    <textarea value={prompt} className="w-full p-2 h-64 border-[1px] text-black mb-4"></textarea>
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard/send">
                            <button className="border-[1px] px-4 py-2 ">Save</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default index;
