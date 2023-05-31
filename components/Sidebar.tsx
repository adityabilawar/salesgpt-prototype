import React, { useState } from 'react';
import { FiGrid, FiMail, FiLayers } from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const [activeIcon, setActiveIcon] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleIconMouseEnter = (icon: string, event: React.MouseEvent<SVGElement, MouseEvent>) => {
    setActiveIcon(icon);
    const { top, height } = event.currentTarget.getBoundingClientRect();
    const tooltipTop = top - height ;
    const tooltipLeft = event.currentTarget.parentElement?.offsetWidth || 0;
    setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
  };

  const handleIconMouseLeave = () => {
    setActiveIcon('');
  };

  const renderTooltip = () => {
    if (activeIcon === 'dashboard') {
      return <span>Dashboard</span>;
    } else if (activeIcon === 'mail') {
      return <span>Mail</span>;
    } else if (activeIcon === 'campaigns') {
      return <span>Campaigns</span>;
    }
    return null;
  };

  return (
    <div className="flex flex-col relative h-screen w-32 border-r-[1px]">
      <div className="flex flex-col items-center mt-4">
        <div
          className={`p-4 rounded-full cursor-pointer ${
            activeIcon === 'dashboard' ? 'bg-white' : ''
          }`}
          onMouseEnter={(event) => handleIconMouseEnter('dashboard', event)}
          onMouseLeave={handleIconMouseLeave}
        >
          <FiGrid
            className={`${activeIcon === 'dashboard' ? 'text-black' : 'text-white'}`}
            size={32}
          />
        </div>
        <div
          className={`p-4 rounded-full cursor-pointer ${
            activeIcon === 'mail' ? 'bg-white' : ''
          }`}
          onMouseEnter={(event) => handleIconMouseEnter('mail', event)}
          onMouseLeave={handleIconMouseLeave}
        >
          <FiMail className={`${activeIcon === 'mail' ? 'text-black' : 'text-white'}`} size={32} />
        </div>
        <div
          className={`p-4 rounded-full cursor-pointer ${
            activeIcon === 'campaigns' ? 'bg-white' : ''
          }`}
          onMouseEnter={(event) => handleIconMouseEnter('campaigns', event)}
          onMouseLeave={handleIconMouseLeave}
        >
          <FiLayers
            className={`${activeIcon === 'campaigns' ? 'text-black' : 'text-white'}`}
            size={32}
          />
        </div>
      </div>
      {activeIcon && (
        <div
          className="absolute bg-white px-5 py-2 ml-2 text-black rounded-md"
          style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
        >
          {renderTooltip()}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
