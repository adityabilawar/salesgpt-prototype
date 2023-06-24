import Center from "../components/Profile/Center";
import Navbar from "../components/Dashboard/Navbar";
import RightBar from "../components/Profile/RightBar";
import Sidebar from "../components/Sidebar";
import React from "react";

const profile = () => {
  return (
    <div className="text-black">
      <div className="border-b-[1px] p-10">
        <Navbar />
      </div>
      <div className="grid grid-cols-5">
        <Sidebar />
        <div className="col-span-3">
          <Center />
        </div>
        <div>
          {/* <RightBar /> */}
          Test
        </div>
      </div>
    </div>
  );
};

export default profile;
