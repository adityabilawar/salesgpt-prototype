import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col flex-grow">
            <Navbar />
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
