import Sidebar from "@/components/Dashboard/Sidebar";
import Navbar from "../components/Dashboard/Navbar";
import LeadsList from "@/components/Dashboard/LeadsList";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setView } from "@/components/store/sidebarSlice";
import Profile from "@/components/Dashboard/SidebarContents/Profile";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setView("PROFILE"));
  }, [dispatch]);



  return (
    <div className="text-black h-screen flex flex-col overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="flex flex-col">
          <Navbar />
          <div className="overflow-auto">
            <LeadsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
