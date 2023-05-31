import React, { useEffect, useState } from 'react';
import { BsPlusLg, BsTelephone, BsThreeDots } from "react-icons/bs"
import { AiOutlineMail } from "react-icons/ai"
import { useSelector } from 'react-redux';
import { RootState } from '@/components/store';
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

const LeadDetails = () => {
    const [activeTab, setActiveTab] = useState('leads');
    const selectedLead: any = useSelector((state: RootState) => state.leads.selectedLead);
    const getDetail = (value: string | null) => value ? value : <span className="text-gray-900">unknown</span>;
    const springProps = useSpring({
        borderBottom: activeTab === 'leads' ? '2px solid white' : '2px solid white',
        left: activeTab === 'leads' ? '0%' : '50%',
        position: 'absolute',
        width: '50%',
        bottom: 0,
        config: { friction: 30, tension: 180 },
    });

    return (
        <div className="border-r-[1px] h-screen flex flex-col">
            <div className="flex-grow">
                <div className="flex relative justify-center items-center flex-col p-10">
                    <div className="rounded-full h-32 w-32 bg-white" />
                    {selectedLead && <h1 className="text-2xl mt-5">{getDetail(selectedLead.firstName)} {getDetail(selectedLead.lastName)}</h1>}
                    {selectedLead && <p className="text-md text-gray-400 mt-2">{selectedLead.companyName}</p>}
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
                        className={`w-full py-2 ${activeTab === 'companyInfo' ? 'text-white' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('companyInfo')}
                    >
                        Company Info
                    </button>
                    <animated.div />
                    {/* <animated.div style={springProps} /> */}
                </div>
                <div className="flex-grow-0 px-10 py-5">
                    {activeTab === 'leads' ? (
                        <div className="flex-col space-y-5">
                            <div>
                                <h1 className="text-gray-400">Email</h1>
                                <p>{selectedLead?.email}</p>
                            </div>
                            <div>
                                <h1 className="text-gray-400">Phone</h1>
                                <p>{selectedLead?.phone}</p>
                            </div>
                            <div>
                                <h1 className="text-gray-400">Job Title</h1>
                                <p>Job Title: {selectedLead?.jobTitle}</p>
                            </div>
                            <div>
                                <h1 className="text-gray-400">Linkedin</h1>
                                <p>{selectedLead?.linkedIn}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {selectedLead && <p>{selectedLead.companyInfo}</p>}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LeadDetails
