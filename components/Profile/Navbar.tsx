import Link from 'next/link'
import React from 'react'
import { RxCaretLeft, RxDotsVertical } from "react-icons/rx"

const Navbar = () => {
    return (
        <div className="flex justify-between items-center">
            <Link href="/about">
                <div className="flex justify-center items-center space-x-2">
                    {/* <div className="bg-white text-black flex justify-center items-center rounded-full h-8 w-8">
                        <RxCaretLeft />
                    </div> */}
                    <div>
                        User
                    </div>
                </div>
            </Link>
            <div className="">
                <RxDotsVertical />
            </div>
        </div>
    )
}

export default Navbar