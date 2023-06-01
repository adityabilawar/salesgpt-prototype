import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchLeads, addSelectedLead, setSelectedLead, clearSelectedLeads, removeLead } from '@/components/store/leadsSlice';
import { setView } from '@/components/store/sidebarSlice';
import { FiChevronDown, FiCircle, FiMail, FiSearch, FiEdit3, FiMoreHorizontal, FiTrash } from 'react-icons/fi';
import Link from 'next/link';
import Papa from "papaparse";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { animated, useSpring, useSprings } from 'react-spring';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  companyName: string;
  email: string;
  phone: string;
  linkedIn: string;
}

const Center = () => {
  const dispatch = useDispatch();
  const leads = useSelector((state: RootState) => state.leads.leads) || [];
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
  const [isSelected, setIsSelected] = useState<Record<string, boolean>>({});
  const [file, setFile] = useState<File | null>(null);

  const toggleOpen = (id: string) => {
    setIsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCircleClick = (id: string, lead: Lead) => {
    setIsSelected((prev) => {
      const updatedIsSelected = { ...prev, [id]: !prev[id] };
      if (updatedIsSelected[id]) {
        dispatch(addSelectedLead(lead));
      } else {
        dispatch(removeLead(lead));
      }
      return updatedIsSelected;
    });
  };

  const handleContactAll = () => {
    dispatch(clearSelectedLeads());
    Object.keys(isSelected).forEach((id: string) => {
      if (isSelected[id]) {
        const foundLead = leads.find((lead: Lead) => lead.id === id);
        if (foundLead) {
          dispatch(addSelectedLead(foundLead));
        }
      }
    });
    dispatch(setView('SELECTED_LEADS'));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const springs = useSprings(
    leads.length,
    leads.map((_: any, index: number) => ({
      transform: isOpen[index.toString()] ? 'rotate(0deg)' : 'rotate(180deg)',
    }))
  );

  useEffect(() => {
    const userId = 'jOgfvrI7EfqjqcH2Gfeo'; 
    const leadsRef = collection(db, 'users', userId, 'leads');
    const unsubscribe = onSnapshot(leadsRef, (snapshot) => {
      const updatedLeads: Lead[] = [];
      snapshot.forEach((doc) => {
        updatedLeads.push({ id: doc.id, ...doc.data() } as Lead);
      });
      dispatch(fetchLeads(updatedLeads));
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      Papa.parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          results.data.forEach(async (lead) => {
            try {
              const userRef = doc(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo');
              const userSnapshot = await getDoc(userRef);
              if (userSnapshot.exists()) {
                const leadsRef = collection(db, 'users', 'jOgfvrI7EfqjqcH2Gfeo', 'leads');
                await addDoc(leadsRef, lead);
              }
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          });
        },
      });
    }
  };

  const handleDeleteLead = async (id: string) => {
    const leadToDelete = leads.find((lead: Lead) => lead.id === id);
    if (leadToDelete) {
      dispatch(removeLead(leadToDelete));
    }
    try {
      const userId = 'jOgfvrI7EfqjqcH2Gfeo';
      const leadRef = doc(db, 'users', userId, 'leads', id);
      await deleteDoc(leadRef);
      console.log('Lead removed from Firebase');
    } catch (error) {
      console.error('Error removing lead: ', error);
    }
  };

  return (
    <div className="border-r-[1px] flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex flex-col border-b-[1px] px-10 py-5 sticky top-0 bg-[#1D203E]">
          <h1 className="text-2xl">Leads</h1>
          <div className="flex-grow-0 py-5 flex space-x-5 bg-[#1D203E]">
          <div className="bg-white text-black px-5 flex justify-center items-center cursor-pointer">
            <label htmlFor="upload-button">
              {file ? `Uploaded ${file.name}` : 'Upload Leads'}
            </label>
            <input
              id="upload-button"
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
          </div>
          <div className="relative border border-white flex justify-center items-center space-x-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch size={24} />
            </div>
            <input
              className="py-2 pl-10 pr-4 w-full text-white rounded-md bg-transparent focus:outline-none"
              placeholder="Search..."
              onChange={handleSearchChange}
            />
          </div>
          <Link href="/dashboard/send">
            <button className="border-[1px] px-6 py-3" onClick={handleContactAll}>
              Contact All
            </button>
          </Link>
        </div>
        </div>
        <div className="p-10 space-y-4 overflow-y-auto">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          ) : (leads
            .filter((lead: Lead) => (lead.firstName + ' ' + lead.lastName).toLowerCase().includes(searchTerm.toLowerCase()))
            .map((lead: Lead) => {
              const id = lead.id;

              return (
                <div className="flex flex-col border border-white w-full select-none" key={id}>
                  <div className="grid grid-cols-5 items-center cursor-pointer">
                    <div className="flex items-center p-4 col-span-1" onClick={() => handleCircleClick(id, lead)}>
                      <FiCircle
                        size={24}
                        className={isSelected[id] ? 'fill-current text-white' : ''}
                      />
                      <p className="ml-2">{lead.firstName} {lead.lastName}, {lead.companyName}</p>
                    </div>
                    <div className="flex items-end justify-end p-4 col-span-4" onClick={() => toggleOpen(id)}>
                      {isSelected[id] && <p className="text-gray-500 mr-2">Selected</p>}
                      <animated.div style={springs[parseInt(lead.id)]}>
                        <FiChevronDown size={24} />
                      </animated.div>
                    </div>
                  </div>
                  {isOpen[id] && (
                    <div className="flex space-x-6 items-center p-4 border-t border-white">
                      <button className="flex items-center border-[1px] px-6 py-2">
                        <FiEdit3 size={24} />
                        <p className="ml-2">Edit</p>
                      </button>
                      <button
                        className={`flex items-center border-[1px] px-6 py-2 ${selectedDetail === id ? 'bg-white text-black' : ''}`}
                        onClick={() => {
                          setSelectedDetail(id);
                          const foundLead = leads.find((lead: Lead) => lead.id === id);
                          if (foundLead) {
                            dispatch(setSelectedLead(foundLead));
                          }
                          dispatch(setView('LEAD_DETAILS'));
                        }}
                      >
                        <FiMoreHorizontal size={24} />
                        <p className="ml-2">Details</p>
                      </button>
                      <button className="flex items-center border-[1px] px-6 py-2">
                        <FiMail size={24} />
                        <p className="ml-2">Contact</p>
                      </button>
                      <button className="flex items-center" onClick={() => handleDeleteLead(id)}>
                        <FiTrash size={24} />
                      </button>
                    </div>
                  )}
                </div>
              );
            }))}
        </div>
      </div>
    </div>
  );
};

export default Center;
