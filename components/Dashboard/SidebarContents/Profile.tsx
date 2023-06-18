import React, { useEffect, useState } from 'react';
import { BsPlusLg, BsTelephone, BsThreeDots } from "react-icons/bs"
import { AiOutlineMail } from "react-icons/ai"
import { animated, useSpring } from 'react-spring';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, collection, DocumentSnapshot } from "firebase/firestore";
import { FiEdit3, FiSave } from 'react-icons/fi';
import { setDoc } from 'firebase/firestore';

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
  companyDetails: string;
  companyValue: string;
  problem: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState<ProfileData | null>(null);
  const springProps = useSpring({
    borderBottom: activeTab === 'leads' ? '2px solid white' : '2px solid white',
    left: activeTab === 'leads' ? '0%' : '50%',
    position: 'absolute',
    width: '50%',
    bottom: 0,
    config: { friction: 30, tension: 180 },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = 'jOgfvrI7EfqjqcH2Gfeo'
        const userDoc = await getDoc(doc(collection(db, 'users'), userId));
        if (userDoc.exists()) {
          const userData = userDoc.data() as ProfileData;
          setProfileData(userData);
          setEditData(userData); // set editData here directly
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
      setLoading(false);
    }
    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (editData) {
      try {
        await setDoc(doc(collection(db, 'users'), "jOgfvrI7EfqjqcH2Gfeo"), editData);
        setProfileData(editData);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating user data: ", error);
      }
    }
  };


  return (
    <div className="border-r-[1px] h-screen flex flex-col">
      <div className="flex-grow relative">
        {isEditing ? (
          <button className="flex absolute right-5 cursor-pointer z-10 top-5 items-center border-[1px] px-6 py-2" onClick={handleSave}>
            <FiSave size={24} />
            <p className="ml-2">Save</p>
          </button>
        ) : (
          <button className="flex absolute right-5 cursor-pointer z-10 top-5 items-center border-[1px] px-6 py-2" onClick={() => setIsEditing(true)}>
            <FiEdit3 size={24} />
            <p className="ml-2">Edit</p>
          </button>
        )}
        <div className="flex relative justify-center items-center flex-col p-10">
          <div className="rounded-full h-32 w-32 bg-white" />
          {isEditing ? (
            <div className="grid grid-cols-2 w-full mt-5">
              <input
                type="text"
                value={editData?.firstName}
                onChange={(e) => editData && setEditData({ ...editData, firstName: e.target.value })}
                className="text-md text-black"
              />
              <input
                type="text"
                value={editData?.lastName}
                onChange={(e) => editData && setEditData({ ...editData, lastName: e.target.value })}
                className="text-md text-black"
              />
            </div>
          ) : (
            <h1 className="text-2xl mt-5">{`${profileData?.firstName} ${profileData?.lastName}`}</h1>
          )}
          {isEditing ? (
            <input
              type="text"
              value={editData?.companyName}
              onChange={(e) => editData && setEditData({ ...editData, companyName: e.target.value })}
              className="text-md text-black mt-2"
            />
          ) : (
            <p className="text-md text-gray-400 mt-2">{profileData?.companyName}</p>
          )}
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
            className={`w-full py-2 ${activeTab === 'leads' ? 'text-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('leads')}
          >
            Leads Info
          </button>
          <button
            className={`w-full py-2 ${activeTab === 'address' ? 'text-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('address')}
          >
            Company Info
          </button>
          {/* <animated.div style={springProps} /> */}
        </div>
        <div className="scroll-section flex-grow-0 px-10 py-5 overflow-y-auto">
          {activeTab === 'leads' ? (
            <div className="flex-col space-y-5">
              <div>
                <h1 className="text-gray-400">Email</h1>
                {isEditing ? (
                  <input type="text" className="text-black" value={editData?.email} onChange={(e) => editData && setEditData({ ...editData, email: e.target.value })} />
                ) : (
                    <p className="break-words">{profileData?.email}</p>
                )}
              </div>
              <div>
                <h1 className="text-gray-400">Phone</h1>
                {isEditing ? (
                  <input type="text" className="text-black" value={editData?.phoneNumber} onChange={(e) => editData && setEditData({ ...editData, phoneNumber: e.target.value })} />
                ) : (
                    <p className="break-words">{profileData?.phoneNumber}</p>
                )}
              </div>
              <div>
                <h1 className="text-gray-400">Job Title</h1>
                {isEditing ? (
                  <input type="text" className="text-black" value={editData?.jobTitle} onChange={(e) => editData && setEditData({ ...editData, jobTitle: e.target.value })} />
                ) : (
                    <p className="break-words">{profileData?.jobTitle}</p>
                )}
              </div>
              <div>
                <h1 className="text-gray-400">Linkedin</h1>
                {isEditing ? (
                  <input type="text" className="text-black" value={editData?.linkedInProfile} onChange={(e) => editData && setEditData({ ...editData, linkedInProfile: e.target.value })} />
                ) : (
                    <p className="break-words">{profileData?.linkedInProfile}</p>
                )}
              </div>
            </div>
          ) : (
              <div className="flex flex-col space-y-5 overflow-y-auto">
              <div>
                <h1 className="text-gray-400">Company Information</h1>
                {isEditing ? (
                  <textarea className="text-black w-full" value={editData?.companyDetails} onChange={(e) => editData && setEditData({ ...editData, companyDetails: e.target.value })} />
                ) : (
                      <p className="break-words">{profileData?.companyDetails}</p>
                )}
              </div>
              <div>
                <h1 className="text-gray-400">Value You Provide</h1>
                {isEditing ? (
                  <textarea className="text-black w-full" value={editData?.companyValue} onChange={(e) => editData && setEditData({ ...editData, companyValue: e.target.value })} />
                ) : (
                    <p className="break-words">{profileData?.companyValue}</p>
                  )}
                </div>
                <div>
                  <h1 className="text-gray-400">Problem You Solve</h1>
                  {isEditing ? (
                    <textarea className="text-black w-full" value={editData?.problem} onChange={(e) => editData && setEditData({ ...editData, problem: e.target.value })} />
                  ) : (
                    <p className="break-words">{profileData?.problem}</p>
                  )}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile;
