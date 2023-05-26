import { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { FiChevronDown, FiCircle, FiMail, FiSearch, FiEdit3, FiMoreHorizontal } from 'react-icons/fi';

const leads = [
    {
        leadName: "Tony Stark",
    },
    {
        leadName: "Iron Man",
    },
    {
        leadName: "Captain America",
    },
]

const Center = () => {
    const [isOpen, setIsOpen] = useState(new Array(leads.length).fill(false));
    const [isSelected, setIsSelected] = useState(new Array(leads.length).fill(false));

    const toggleOpen = (index: number) => {
        const newIsOpen = [...isOpen];
        newIsOpen[index] = !newIsOpen[index];
        setIsOpen(newIsOpen);
    };

    const handleCircleClick = (index: number) => {
        const newIsSelected = [...isSelected];
        newIsSelected[index] = !newIsSelected[index];
        setIsSelected(newIsSelected);
    };

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
                            className="py-2 pl-10 pr-4 w-full text-black rounded-md bg-transparent focus:outline-none"
                            placeholder="Search..."
                        />
                    </div>
                    <button className="border-[1px] px-6 py-3">Contact All</button>
                </div>
                <div className="p-10 space-y-4">
                    {leads.map((lead, i) => {
                        const animation = useSpring({
                            transform: isOpen[i] ? 'rotate(0deg)' : 'rotate(180deg)',
                        });

                        return (
                            <div className="flex flex-col border border-white w-full select-none" key={i}>
                                <div className="grid grid-cols-4 items-center cursor-pointer">
                                    <div className="flex items-center p-4 col-span-1" onClick={() => handleCircleClick(i)}>
                                        <FiCircle
                                            size={24}
                                            className={isSelected[i] ? 'fill-current text-white' : ''}
                                        />
                                        <p className="ml-2">{lead.leadName}</p>
                                    </div>
                                    <div className="flex items-end justify-end p-4 col-span-3" onClick={() => toggleOpen(i)}>
                                        {isSelected[i] && <p className="text-gray-500 mr-2">Selected</p>}
                                        <animated.div style={animation}>
                                            <FiChevronDown size={24} />
                                        </animated.div>
                                    </div>
                                </div>
                                {isOpen[i] && (
                                    <div className="flex space-x-6 items-center p-4 border-t border-white">
                                        <button className="flex items-center border-[1px] px-6 py-2">
                                            <FiEdit3 size={24} />
                                            <p className="ml-2">Edit</p>
                                        </button>
                                        <button className="flex items-center border-[1px] px-6 py-2">
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

export default Center
