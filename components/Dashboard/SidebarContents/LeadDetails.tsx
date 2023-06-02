import React, { useEffect, useState } from 'react';
import { BsPlusLg, BsTelephone, BsThreeDots } from "react-icons/bs"
import { AiOutlineMail } from "react-icons/ai"
import { useSelector } from 'react-redux';
import { RootState } from '@/components/store';
import { animated, useSpring } from 'react-spring';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { FiEdit3, FiSave } from 'react-icons/fi';

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
    const [isEditing, setIsEditing] = useState(false);
    const [editLeadData, setEditLeadData] = useState<any | null>(null);
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

    useEffect(() => {
        setEditLeadData(selectedLead);
    }, [selectedLead]);

    const handleSave = async () => {
        if (editLeadData) {
            try {
                await setDoc(doc(collection(db, 'leads'), "leadId"), editLeadData);
                setIsEditing(false);
            } catch (error) {
                console.error("Error updating lead data: ", error);
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
                                className="text-md text-black"
                                value={editLeadData?.firstName}
                                onChange={(e) => editLeadData && setEditLeadData({ ...editLeadData, firstName: e.target.value })}
                            />
                            <input
                                type="text"
                                className="text-md text-black"
                                value={editLeadData?.lastName}
                                onChange={(e) => editLeadData && setEditLeadData({ ...editLeadData, lastName: e.target.value })}
                            />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl mt-5">{getDetail(selectedLead.firstName)} {getDetail(selectedLead.lastName)}</h1>
                        </>
                    )}
                    {isEditing ? (
                        <input
                            type="text"
                            className="text-md text-black"
                            value={editLeadData?.companyName}
                            onChange={(e) => editLeadData && setEditLeadData({ ...editLeadData, companyName: e.target.value })}
                        />
                    ) : <p className="text-md text-gray-400 mt-2">{selectedLead.companyName}</p>}
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
                <div className="relative flex justify-start mt-5">
                    <button
                        className={`w-full py-2 ${activeTab === 'leads' ? 'text-white' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('leads')}
                    >
                        Leads Info
                    </button>
                    <animated.div />
                    {/* <animated.div style={springProps} /> */}
                </div>
                <div className="flex-grow-0 px-10 py-5">
                    <div className="flex-col space-y-5">
                        <div>
                            <h1 className="text-gray-400">Email</h1>
                            {isEditing ? (
                                <input type="text" className="text-black" value={editLeadData?.email} onChange={(e) => editLeadData && setEditLeadData({ ...editLeadData, email: e.target.value })} />
                            ) : (
                                <p style={{ wordWrap: 'break-word' }}>{selectedLead?.email}</p>
                            )}
                        </div>
                        <div>
                            <h1 className="text-gray-400">Phone</h1>
                            {isEditing ? (
                                <input type="text" className="text-black" value={editLeadData?.phone} onChange={(e) => editLeadData && setEditLeadData({ ...editLeadData, phone: e.target.value })} />
                            ) : (
                                <p style={{ wordWrap: 'break-word' }}>{selectedLead?.phone}</p>
                            )}
                        </div>
                        <div>
                            <h1 className="text-gray-400">Job Title</h1>
                            {isEditing ? (
                                <input type="text" className="text-black" value={editLeadData?.jobTitle} onChange={(e) => editLeadData && setEditLeadData({ ...editLeadData, jobTitle: e.target.value })} />
                            ) : (
                                <p style={{ wordWrap: 'break-word' }}>{selectedLead?.jobTitle}</p>
                            )}
                        </div>
                        <div>
                            <h1 className="text-gray-400">Linkedin</h1>
                            {isEditing ? (
                                <input type="text" className="text-black" value={editLeadData?.linkedIn} onChange={(e) => editLeadData && setEditLeadData({ ...editLeadData, linkedIn: e.target.value })} />
                            ) : (
                                <p style={{ wordWrap: 'break-word' }}>{selectedLead?.linkedIn}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeadDetails
