import React, { useEffect, useState } from 'react';
import { BsPlusLg, BsTelephone, BsThreeDots } from "react-icons/bs"
import { AiOutlineMail } from "react-icons/ai"
import { animated, useSpring } from 'react-spring';

const socials = [
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
    const [activeTab, setActiveTab] = useState('leads');
    const [profileData, setProfileData] = useState(null);
    const springProps = useSpring({
        borderBottom: activeTab === 'leads' ? '2px solid white' : '2px solid white',
        left: activeTab === 'leads' ? '0%' : '50%',
        position: 'absolute',
        width: '50%',
        bottom: 0,
        config: { friction: 30, tension: 180 },
    });

    useEffect(() => {
        const storedProfileData = localStorage.getItem('about');
        if (storedProfileData) {
          const parsedProfileData = JSON.parse(storedProfileData);
          setProfileData(parsedProfileData);
        }
      }, []);

    return (
        <div className="border-r-[1px] h-screen flex flex-col">
            <div className="flex-grow">
                <div className="flex relative justify-center items-center flex-col p-10">
                    <div className="rounded-full h-32 w-32 bg-white" />
                    {profileData && <h1 className="text-2xl mt-5">Tony Stark</h1>}
                    {profileData && <p className="text-md text-gray-400 mt-2">Stark Industries</p>}
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
                        Address Info
                    </button>
                    <animated.div />
                    {/* <animated.div style={springProps} /> */}
                </div>
                <div className="flex-grow-0 px-10 py-5">
                {activeTab === 'leads' ? (
                    <>
                        <p>Email: example@example.com</p>
                        <p>Phone: 123-456-7890</p>
                        <p>Job Title: Job Title</p>
                        <p>LinkedIn: LinkedIn Profile</p>
                    </>
                ) : (
                    <>
                        <p>Address: 123 Main St, City, State, Country</p>
                    </>
                )}
            </div>
            </div>
        </div>
    )
}

export default Profile
