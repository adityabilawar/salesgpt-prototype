import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import Emails from './Emails';

const tabs = [
    'Activity', 'Emails'
]

const Center = () => {
    const [activeTab, setActiveTab] = useState('Activity');
    const springProps = useSpring({
        left: `${tabs.indexOf(activeTab) * 50}%`,
        config: { friction: 30, tension: 180 },
    });
    
    const borderBottomSpring = useSpring({
        borderBottomWidth: 2,
        borderBottomStyle: "solid",
        borderBottomColor: "white",
        config: { friction: 30, tension: 180 },
    });

    return (
        <div className="border-r-[1px] h-screen flex flex-col">
            <div className="flex-grow">
                <div className="relative flex mt-5 border-b-[1px]">
                    {tabs.map((tab, i) => (
                        <button 
                            className={`w-full py-2 ${activeTab === tab ? 'text-white' : 'text-gray-500'}`}
                            onClick={() => setActiveTab(tab)}
                            key={i}
                        >
                            {tab}
                        </button>
                    ))}
                    <animated.div />
                </div>
                <div className="flex-grow-0 px-10 py-5">
                    {activeTab === 'Activity' && <p>Activity content</p>}
                    {activeTab === 'Emails' && <Emails />}
                </div>
            </div>
        </div>
    )
}

export default Center
