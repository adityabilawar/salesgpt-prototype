import React, { useEffect, useState } from 'react';
import { BsPlusLg, BsTelephone, BsThreeDots } from "react-icons/bs"
import { AiOutlineMail } from "react-icons/ai"
import { animated, useSpring } from 'react-spring';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, collection, DocumentSnapshot } from "firebase/firestore";

interface Social {
  icon: JSX.Element;
  text: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  linkedInProfile: string;
  companyInfo: string;
}

const socials: Social[] = [
  {
    icon: <BsPlusLg />,
    text: "Log"
  },
  {
    icon: <AiOutlineMail />,
    text: "Email"
  },
  {
    icon: <BsTelephone />,
    text: "Call"
  },
  {
    icon: <BsThreeDots />,
    text: "More"
  }
]

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'leads' | 'address'>('leads');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const springProps = useSpring({
    borderBottom: activeTab === 'leads' ? '2px solid white' : '2px solid white',
    left: activeTab === 'leads' ? '0%' : '50%',
    position: 'absolute',
    width: '50%',
    bottom: 0,
    config: { friction: 30, tension: 180 },
  });

  useEffect(() => {
    const userId = 'jOgfvrI7EfqjqcH2Gfeo'
    const storedProfileData = localStorage.getItem('about');
    if (storedProfileData) {
      const parsedProfileData: ProfileData = JSON.parse(storedProfileData);
      setProfileData(parsedProfileData);
    }

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(collection(db, 'users'), userId));
        if (userDoc.exists()) {
          const userData = userDoc.data() as ProfileData;
          setProfileData(userData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    }
    fetchUserData();
  }, []);


  return (
    <div className="border-r-[1px] h-screen flex flex-col">
      <div className="flex-grow">
        <div className="flex relative justify-center items-center flex-col p-10">
          <div className="rounded-full h-32 w-32 bg-white" />
          {profileData && <h1 className="text-2xl mt-5">{`${profileData.firstName} ${profileData.lastName}`}</h1>}
          {profileData && <p className="text-md text-gray-400 mt-2">{profileData.companyName}</p>}
          <div className="flex justify-center items-center space-x-4">
            {socials.map((social, i) => (
              <div className="mt-5 flex flex-col justify-center items-center space-x-2" key={i}>
                <div className="rounded-full border-[1px] h-12 w-12 flex justify-center items-center mb-2">
                  {social.icon}
                </div>
                <p>{social.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex justify-between mt-5">
          <button
            className={`w-full py-2 ${activeTab === 'leads' ? 'text-white' : 'text-gray-500'}`}
            onClick={() => setActiveTab('leads')}
          >
            Leads Info
          </button>
          <button
            className={`w-full py-2 ${activeTab === 'address' ? 'text-white' : 'text-gray-500'}`}
            onClick={() => setActiveTab('address')}
          >
            Company Info
          </button>
          {/* <animated.div style={springProps} /> */}
        </div>
        <div className="flex-grow-0 px-10 py-5 overflow-x-auto">
          {activeTab === 'leads' ? (
            <div className="flex-col space-y-5">
              <div>
                <h1 className="text-gray-400">Email</h1>
                <p style={{ wordWrap: 'break-word' }}>{profileData?.email}</p>
              </div>
              <div>
                <h1 className="text-gray-400">Phone</h1>
                <p style={{ wordWrap: 'break-word' }}>{profileData?.phoneNumber}</p>
              </div>
              <div>
                <h1 className="text-gray-400">Job Title</h1>
                <p style={{ wordWrap: 'break-word' }}>{profileData?.jobTitle}</p>
              </div>
              <div>
                <h1 className="text-gray-400">Linkedin</h1>
                <p style={{ wordWrap: 'break-word' }}>{profileData?.linkedInProfile}</p>
              </div>
            </div>
          ) : (
            <>
              <p>{profileData?.companyInfo}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile;
