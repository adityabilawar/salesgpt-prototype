import Sidebar from "@/components/Dashboard/Sidebar";
import Navbar from "../../components/Dashboard/Navbar";
import RightBar from "../../components/Profile/RightBar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setView } from "@/components/store/sidebarSlice";
import CampaignsList from "@/components/Dashboard/Send/CampaignsList";

const send = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setView("SELECTED_LEADS"));
  }, [dispatch]);
  return (
    <div>
      <div className="grid grid-cols-5">
        <Sidebar />
        <div className="col-span-4">
          <CampaignsList />
        </div>
      </div>
    </div>
  );
};

export default send;
