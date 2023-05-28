import { useState, useEffect } from 'react';
import { animated, useSpring, useSprings } from 'react-spring';
import { FiChevronDown, FiCircle, FiMail, FiSearch, FiEdit3, FiMoreHorizontal } from 'react-icons/fi';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addSelectedLead, setSelectedLead, clearSelectedLeads, removeLead } from '@/pages/store/leadsSlice';
import { setView } from '@/pages/store/sidebarSlice';

const leads: any = [
    {
        id: '1',
        leadName: "Tony Stark",
        email: "tonystark@example.com",
        phoneNumber: "123-456-7890",
        jobTitle: "CEO",
        linkedInProfile: "https://linkedin.com/in/tonystark",
        address: "10880 Malibu Point, Malibu, California",
        companyName: "Stark Industries"
    },
    {
        id: '2',
        leadName: "Iron Man",
        email: "ironman@example.com",
        phoneNumber: "098-765-4321",
        jobTitle: "Superhero",
        linkedInProfile: "https://linkedin.com/in/ironman",
        address: "10880 Malibu Point, Malibu, California",
        companyName: "Avengers"
    },
    {
        id: '3',
        leadName: "Captain America",
        email: "captainamerica@example.com",
        phoneNumber: "321-654-0987",
        jobTitle: "Leader",
        linkedInProfile: "https://linkedin.com/in/captainamerica",
        address: "Brooklyn, New York City, New York",
        companyName: "Avengers"
    },
]


const Center = () => {
    const dispatch = useDispatch();
    const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
    const [isSelected, setIsSelected] = useState<Record<string, boolean>>({});

    const toggleOpen = (id: string) => {
        setIsOpen(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCircleClick = (id: string, lead: any) => {
        setIsSelected(prev => {
            const updatedIsSelected = { ...prev, [id]: !prev[id] };
            if (updatedIsSelected[id]) {
                dispatch(addSelectedLead(lead));
            } else {
                dispatch(removeLead(lead));
            }
            return updatedIsSelected;
        });
    };


    const handleContactAll = () => {
        dispatch(clearSelectedLeads());
        Object.keys(isSelected).forEach((id: any) => {
            isSelected[id] && dispatch(addSelectedLead(leads.find((lead: any) => lead.id === id)));
        });
        dispatch(setView('SELECTED_LEADS'));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const springs: any = useSprings(leads.length, leads.map((_: any, index: any) => ({
        transform: isOpen[index.toString()] ? 'rotate(0deg)' : 'rotate(180deg)',
    })));;

    return (
        <div className="border-r-[1px] h-screen flex flex-col">
            <div className="flex-grow">
                <div className="relative flex border-b-[1px] px-10 py-5 text-2xl">
                    Leads
                </div>
                <div className="flex-grow-0 px-10 py-5 flex space-x-5">
                    <button className="border-[1px] px-6 py-3">Import Leads</button>
                    <div className="relative border border-white flex justify-center items-center space-x-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch size={24} />
                        </div>
                        <input
                            className="py-2 pl-10 pr-4 w-full text-white rounded-md bg-transparent focus:outline-none"
                            placeholder="Search..."
                            onChange={handleSearchChange}
                        />
                    </div>
                    <Link href="/dashboard/send">
                        <button className="border-[1px] px-6 py-3" onClick={handleContactAll}>Contact All</button>
                    </Link>
                </div>
                <div className="p-10 space-y-4">
                    {leads
                        .filter((lead: any) => lead.leadName.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((lead: any) => {
                            const id = lead.id.toString();

                            return (
                                <div className="flex flex-col border border-white w-full select-none" key={id}>
                                    <div className="grid grid-cols-5 items-center cursor-pointer">
                                        <div className="flex items-center p-4 col-span-1" onClick={() => handleCircleClick(id, lead)}>
                                            <FiCircle
                                                size={24}
                                                className={isSelected[id] ? 'fill-current text-white' : ''}
                                            />
                                            <p className="ml-2">{lead.leadName}, {lead.jobTitle}, {lead.companyName}</p>
                                        </div>
                                        <div className="flex items-end justify-end p-4 col-span-4" onClick={() => toggleOpen(id)}>
                                            {isSelected[id] && <p className="text-gray-500 mr-2">Selected</p>}
                                            <animated.div style={springs[parseInt(lead.id)]}>
                                                <FiChevronDown size={24} />
                                            </animated.div>
                                        </div>
                                    </div>
                                    {isOpen[id] && (
                                        <div className="flex space-x-6 items-center p-4 border-t border-white">
                                            <button className="flex items-center border-[1px] px-6 py-2">
                                                <FiEdit3 size={24} />
                                                <p className="ml-2">Edit</p>
                                            </button>
                                            <button
                                                className={`flex items-center border-[1px] px-6 py-2 ${selectedDetail === id ? 'bg-white text-black' : ''}`}
                                                onClick={() => {
                                                    setSelectedDetail(id);
                                                    dispatch(setSelectedLead(leads[parseInt(id)]));
                                                    dispatch(setView('LEAD_DETAILS'));
                                                }}
                                            >
                                                <FiMoreHorizontal size={24} />
                                                <p className="ml-2">Details</p>
                                            </button>
                                            <button className="flex items-center border-[1px] px-6 py-2">
                                                <FiMail size={24} />
                                                <p className="ml-2">Contact</p>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}


export default Center;