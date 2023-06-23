import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateUserData } from "@/components/redux/userSlice";
import { AppDispatch, RootState } from "@/components/store";
import { collection, addDoc, Firestore } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

const index = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.user);
  const [prompt, setPrompt] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
        dispatch(fetchUserData(user.uid));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleGoBack = () => {
    router.back();
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(updateUserData({ userId: userId ?? "", updatedData: userData }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateUserData({
        userId: userId ?? "",
        updatedData: { ...userData, [event.target.name]: event.target.value },
      })
    );
  };

  const saveCampaign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const campaignTitle = form.elements.namedItem(
      "campaignTitle"
    ) as HTMLInputElement;
    const platform = form.elements.namedItem("platform") as HTMLInputElement;
    const callToAction = form.elements.namedItem(
      "callToAction"
    ) as HTMLInputElement;
    const toneOfVoice = form.elements.namedItem(
      "toneOfVoice"
    ) as HTMLInputElement;
    const purpose = form.elements.namedItem("purpose") as HTMLInputElement;
    const wordLimit = form.elements.namedItem("wordLimit") as HTMLInputElement;

    const generatedPrompt = generatePrompt(
      campaignTitle.value,
      platform.value,
      callToAction.value,
      toneOfVoice.value,
      purpose.value,
      wordLimit.value
    );
    setPrompt(generatedPrompt);

    try {
      await addDoc(
        collection(db as Firestore, "users", userId ?? "", "campaigns"),
        {
          campaignTitle: campaignTitle.value,
          platform: platform.value,
          callToAction: callToAction.value,
          toneOfVoice: toneOfVoice.value,
          purpose: purpose.value,
          generatedPrompt: generatedPrompt,
          wordLimit: wordLimit.value,
        }
      );

      console.log("Campaign saved successfully");
    } catch (error) {
      console.error("Error saving campaign:", error);
    }
  };

  const generatePrompt = (
    campaignTitle: string = "",
    platform: string = "",
    callToAction: string = "",
    toneOfVoice: string = "",
    purpose: string = "",
    wordLimit: string = "500"
  ) => {
    const generatedPrompt = `Craft a ${campaignTitle} for ${platform} in a maximum of ${wordLimit} words. The message should include a call to action for ${callToAction} and should be written in a ${toneOfVoice} tone. The purpose of this message is ${purpose}`;
    return generatedPrompt;
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(
      updateUserData({
        userId: userId ?? "",
        updatedData: { ...userData, [event.target.name]: event.target.value },
      })
    );
  };

  return (
    <div className=" text-black h-full min-h-screen">
      <nav className="px-6 py-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={handleGoBack} className="-full p-2">
            <FiArrowLeft size={24} />
          </button>
          <span className="text-2xl">Create Campaign</span>
        </div>
      </nav>
      <div className="grid grid-cols-5 gap-6 px-6 ">
        <div className="col-span-2">
          <h2 className="text-2xl mb-4">User Information</h2>
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label htmlFor="first-name" className="block text-sm ">
                First Name
              </label>
              <input
                id="first-name"
                name="firstName"
                value={userData.firstName}
                onChange={handleChange}
                className="w-full p-2 border-[2px] mt-1 focus:border-brand"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="last-name" className="block text-sm">
                Last Name
              </label>
              <input
                id="last-name"
                name="lastName"
                value={userData.lastName}
                onChange={handleChange}
                className="w-full p-2 border-[2px] mt-1 focus:border-brand"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="company-name" className="block text-sm">
                Company Name
              </label>
              <input
                id="company-name"
                name="companyName"
                value={userData.companyName}
                onChange={handleChange}
                className="w-full p-2 border-[2px] mt-1 focus:border-brand"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="job-title" className="block text-sm">
                Job Title
              </label>
              <input
                id="job-title"
                name="jobTitle"
                value={userData.jobTitle}
                onChange={handleChange}
                className="w-full p-2 border-[2px] mt-1 focus:border-brand"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="company-description" className="block text-sm">
                Company Description
              </label>
              <textarea
                id="company-description"
                name="companyInfo"
                value={userData.companyInfo}
                onChange={handleTextareaChange}
                className="w-full p-2 border-[2px] mt-1 focus:border-brand border-gray-200"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="company-values" className="block text-sm">
                Company Values
              </label>
              <textarea
                id="company-values"
                name="companyValues"
                value={userData.companyValues}
                onChange={handleTextareaChange}
                className="w-full p-2 border-[2px] mt-1 focus:border-brand border-gray-200"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="problem" className="block text-sm">
                Problem Being Solved
              </label>
              <textarea
                id="problem"
                name="problem"
                value={userData.problem}
                onChange={handleTextareaChange}
                className="w-full p-2 border-[2px] mt-1 focus:border-brand border-gray-200"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-brand text-white rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
        <div className="col-span-3">
          <h2 className="text-2xl mb-4">Campaign Details</h2>
          <form onSubmit={saveCampaign}>
            <div className="mb-4">
              <label htmlFor="campaign-title" className="block text-sm">
                Campaign Title
              </label>
              <input
                required
                placeholder="Cold Messaging"
                id="campaign-title"
                name="campaignTitle"
                className="w-full p-2 border-[2px] mt-1 focus:border-brand"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="platform" className="block text-sm">
                Platform
              </label>
              <input
                required
                placeholder="LinkedIn"
                id="platform"
                name="platform"
                className="w-full p-2 border-[2px] mt-1 focus:border-brand"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="call-to-action" className="block text-sm">
                Call To Action
              </label>
              <input
                required
                placeholder="More follow up calls"
                id="call-to-action"
                name="callToAction"
                className="w-full p-2 border-[2px] mt-1 focus:border-brand"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="tone-of-voice" className="block text-sm">
                Tone of Voice
              </label>
              <input
                required
                placeholder="Humorous"
                id="tone-of-voice"
                name="toneOfVoice"
                className="w-full p-2 border-[2px] mt-1 focus:border-brand"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="purpose" className="block text-sm">
                Purpose/goal for message
              </label>
              <input
                required
                placeholder="To introduce our services to potential clients"
                id="purpose"
                name="purpose"
                className="w-full p-2 border-[2px] mt-1 focus:border-brand"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="word-limit" className="block text-sm">
                Word Limit
              </label>
              <input
                required
                placeholder="150"
                name="wordLimit"
                className="w-full p-2 border-[2px] mt-1 focus:border-brand"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="border-[1px] px-4 py-2 bg-gradient-to-br from-[#01B7C5] to-[#C417E0] text-white rounded-md"
              >
                Generate Prompt
              </button>
            </div>
          </form>
        </div>

      </div>
      {promptSection()}
    </div>
  );

  function promptSection() {
    return (
      <div className="mx-24 my-12">
        <hr className="my-4" />
        <h2 className="text-2xl mb-4">Prompt</h2>
        <textarea
          value={prompt}
          className="w-full p-2 h-64 border-[1px] text-black mb-4 border-gray-300"
        ></textarea>
        <div className="flex items-center justify-end space-x-4">
          <Link href="/dashboard/send">
            <button className="border-[1px] px-4 py-2 bg-brand text-white rounded-md">Save</button>
          </Link>
        </div>
      </div>
    );
  }
};

export default index;
