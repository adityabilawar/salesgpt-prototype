import React, { useEffect, useState } from 'react';
import { BsPlusLg, BsTelephone, BsThreeDots } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { FiEdit3, FiSave } from 'react-icons/fi';
import { animated, useSpring } from 'react-spring';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, collection, DocumentSnapshot, setDoc } from "firebase/firestore";

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
];

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
        const userId = 'jOgfvrI7EfqjqcH2Gfeo';
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
    };
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
    <div className="border-[1px] p-8 rounded-lg grid grid-cols-2 space-y-4 m-20">
      <div className="">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">My Profile</h1>
          {!isEditing ? (
            <button
              className="flex items-center space-x-1 text-blue-500"
              onClick={() => setIsEditing(true)}
            >
              <FiEdit3 size={18} />
              <span>Edit</span>
            </button>
          ) : (
            <button
              className="flex items-center space-x-1 text-sm text-blue-500"
              onClick={handleSave}
            >
              <FiSave size={18} />
              <span>Save</span>
            </button>
          )}
        </div>
        <div className="flex">
          <div className="w-2/3 space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-400">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.firstName}
                  onChange={(e) => editData && setEditData({ ...editData, firstName: e.target.value })}
                  className="text-md text-black"
                />
              ) : (
                <p className="text-md">{profileData?.firstName}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-gray-400">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.lastName}
                  onChange={(e) => editData && setEditData({ ...editData, lastName: e.target.value })}
                  className="text-md text-black"
                />
              ) : (
                <p className="text-md">{profileData?.lastName}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-gray-400">Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.phoneNumber}
                  onChange={(e) => editData && setEditData({ ...editData, phoneNumber: e.target.value })}
                  className="text-md text-black"
                />
              ) : (
                <p className="text-md">{profileData?.phoneNumber}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-gray-400">Email</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.email}
                  onChange={(e) => editData && setEditData({ ...editData, email: e.target.value })}
                  className="text-md text-black"
                />
              ) : (
                <p className="text-md">{profileData?.email}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-gray-400">LinkedIn Profile</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.linkedInProfile}
                  onChange={(e) => editData && setEditData({ ...editData, linkedInProfile: e.target.value })}
                  className="text-md text-black"
                />
              ) : (
                <p className="text-md">{profileData?.linkedInProfile}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="black">
        <div className="flex">
          <div className="w-1/2 pr-4">
            <button
              className={`w-full py-2 ${activeTab === 'leads' ? 'text-black' : 'text-gray-500'}`}
              onClick={() => setActiveTab('leads')}
            >
              Leads Info
            </button>
          </div>
          <div className="w-1/2 pl-4">
            <button
              className={`w-full py-2 ${activeTab === 'address' ? 'text-black' : 'text-gray-500'}`}
              onClick={() => setActiveTab('address')}
            >
              Company Info
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {activeTab === 'leads' ? (
            <div className="px-2 py-4">
              <div>
                <h1 className="text-gray-400">Email</h1>
                {isEditing ? (
                  <input
                    type="text"
                    className="text-black w-full"
                    value={editData?.email}
                    onChange={(e) => editData && setEditData({ ...editData, email: e.target.value })}
                  />
                ) : (
                  <p className="break-words">{profileData?.email}</p>
                )}
              </div>
              <div>
                <h1 className="text-gray-400">Phone</h1>
                {isEditing ? (
                  <input
                    type="text"
                    className="text-black w-full"
                    value={editData?.phoneNumber}
                    onChange={(e) => editData && setEditData({ ...editData, phoneNumber: e.target.value })}
                  />
                ) : (
                  <p className="break-words">{profileData?.phoneNumber}</p>
                )}
              </div>
              <div>
                <h1 className="text-gray-400">Job Title</h1>
                {isEditing ? (
                  <input
                    type="text"
                    className="text-black w-full"
                    value={editData?.jobTitle}
                    onChange={(e) => editData && setEditData({ ...editData, jobTitle: e.target.value })}
                  />
                ) : (
                  <p className="break-words">{profileData?.jobTitle}</p>
                )}
              </div>
              <div>
                <h1 className="text-gray-400">LinkedIn</h1>
                {isEditing ? (
                  <input
                    type="text"
                    className="text-black w-full"
                    value={editData?.linkedInProfile}
                    onChange={(e) => editData && setEditData({ ...editData, linkedInProfile: e.target.value })}
                  />
                ) : (
                  <p className="break-words">{profileData?.linkedInProfile}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="px-2 py-4">
              <div>
                <h1 className="text-gray-400">Company Information</h1>
                {isEditing ? (
                  <textarea
                    className="text-black w-full"
                    value={editData?.companyDetails}
                    onChange={(e) => editData && setEditData({ ...editData, companyDetails: e.target.value })}
                  />
                ) : (
                  <p className="break-words">{profileData?.companyDetails}</p>
                )}
              </div>
              <div>
                <h1 className="text-gray-400">Value You Provide</h1>
                {isEditing ? (
                  <textarea
                    className="text-black w-full"
                    value={editData?.companyValue}
                    onChange={(e) => editData && setEditData({ ...editData, companyValue: e.target.value })}
                  />
                ) : (
                  <p className="break-words">{profileData?.companyValue}</p>
                )}
              </div>
              <div>
                <h1 className="text-gray-400">Problem You Solve</h1>
                {isEditing ? (
                  <textarea
                    className="text-black w-full"
                    value={editData?.problem}
                    onChange={(e) => editData && setEditData({ ...editData, problem: e.target.value })}
                  />
                ) : (
                  <p className="break-words">{profileData?.problem}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
