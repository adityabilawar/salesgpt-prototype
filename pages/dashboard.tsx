import Navbar from '../components/Profile/Navbar'
import RightBar from '../components/Profile/RightBar'
import Sidebar from '../components/Profile/Sidebar'
import Center from '@/components/Dashboard/Center'
import React from 'react'

const dashboard = () => {
    return (
        <div className="text-white">
            <div className="border-b-[1px] p-10">
                <Navbar />
            </div>
            <div className="grid grid-cols-5">
                <Sidebar />
                <div className="col-span-4"><Center /></div>
            </div>
        </div>
    )
}

export default dashboard