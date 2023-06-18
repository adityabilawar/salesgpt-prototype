import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';

const sections = [
    { title: 'Company', content: 'Company content' },
    { title: 'Deals', content: 'Deals content' },
    { title: 'Tickets', content: 'Tickets content' },
]

const RightColumn = () => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        'Company': false,
        'Deals': false,
        'Tickets': false,
    });

    const toggleSection = (sectionTitle: string) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionTitle]: !prev[sectionTitle],
        }));
    };

    return (
        <div className="border-l-[1px] h-screen flex flex-col p-5">
            {sections.map((section, i) => {
                const isOpen = openSections[section.title];
                const animationProps = useSpring({
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                    overflow: 'hidden',
                });

                return (
                    <div key={i}>
                        <button 
                            className="flex justify-between items-center w-full py-2 text-black"
                            onClick={() => toggleSection(section.title)}
                        >
                            <span>{section.title}</span>
                            {isOpen ? <BsChevronDown /> : <BsChevronRight />}
                        </button>
                        <animated.div style={animationProps}>
                            <p className="py-5">{section.content}</p>
                        </animated.div>
                    </div>
                );
            })}
        </div>
    )
}

export default RightColumn;
