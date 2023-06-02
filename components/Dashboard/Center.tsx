import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchLeads, addSelectedLead, setSelectedLead, clearSelectedLeads, removeLead, updateLeads } from '@/components/store/leadsSlice';
import { setView } from '@/components/store/sidebarSlice';
import { FiChevronDown, FiCircle, FiMail, FiSearch, FiEdit3, FiMoreHorizontal, FiTrash, FiUpload } from 'react-icons/fi';
import Link from 'next/link';
import Papa from "papaparse";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { animated, useSpring, useSprings } from 'react-spring';
import axios from 'axios';

const Center = () => {
  const dispatch = useDispatch();
  const leads = useSelector((state: RootState) => state.leads.leads) || [];
  const sidebarView = useSelector((state: RootState) => state.sidebar.view);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
  const [isSelected, setIsSelected] = useState<Record<string, boolean>>({});
  const [file, setFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('linkedin');
  const [linkedinInput, setLinkedinInput] = useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [newLead, setNewLead] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    companyName: '',
    email: '',
    phone: '',
    linkedIn: '',
  });

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewLead((prevLead) => ({ ...prevLead, [name]: value }));
  };

  const handleCreateLead = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const userId = 'jOgfvrI7EfqjqcH2Gfeo';
    const leadsRef = collection(db, 'users', userId, 'leads');
    await addDoc(leadsRef, newLead);
    setNewLead({
      firstName: '',
      lastName: '',
      jobTitle: '',
      companyName: '',
      email: '',
      phone: '',
      linkedIn: '',
    });
    setCreateModalOpen(false);
  };



  const fetchLinkedInData = async (url: string) => {
    const key = process.env.NEXT_PUBLIC_DIFFBOT_KEY;
    console.log("Diffbot key is: ", key);
    const options = {
      method: 'GET',
      url: `https://kg.diffbot.com/kg/v3/enhance?type=Person&url=${encodeURIComponent(url)}&size=1&refresh=false&search=false&nonCanonicalFacts=false&useCache=false&jsonmode=%20&token=${key}`,
      headers: { accept: 'application/json' }
    };

    const diffreq = (await axios.request(options)).data;
    console.log(diffreq);
    return (url && diffreq.data.length !== 0) ? diffreq.data[0].entity.description : '';
  };


  const handleLinkedInInput = async () => {
    const linkedInUrls = linkedinInput.split('\n');

    for (let url of linkedInUrls) {
      const data = await fetchLinkedInData(url);

      if (data && data.name) {
        const lead = {
          firstName: data.name.givenName,
          lastName: data.name.familyName,
          jobTitle: data.title,
          companyName: data.employer,
          email: data.email,
          phone: data.phoneNumbers?.[0].number,
          linkedIn: url,
        };

        const userId = 'jOgfvrI7EfqjqcH2Gfeo';
        const leadsRef = collection(db, 'users', userId, 'leads');
        await addDoc(leadsRef, lead);
      }
    }
    setLinkedinInput('');
  }
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
      dispatch(updateLeads(updatedLeads));
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
          // Create batches of 500 items to conform with Firebase's limit
          for (let i = 0; i < results.data.length; i += 500) {
            const batch = results.data.slice(i, i + 500);
            const batchPromises = batch.map(async (lead) => {
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

            // Wait for all items in the batch to upload
            await Promise.all(batchPromises);
          }
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
            <div className="bg-white text-black px-5 flex justify-center items-center cursor-pointer" onClick={() => setModalOpen(true)}>
              Upload Leads
            </div>
            <div className="bg-white text-black px-5 flex justify-center items-center cursor-pointer" onClick={() => setCreateModalOpen(true)}>
              Create Lead
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
            .filter((lead: Lead) => {
              const searchString = `${lead.firstName} ${lead.lastName} ${lead.companyName}`.toLowerCase();
              return searchString.includes(searchTerm.toLowerCase());
            })
            .map((lead: Lead) => {
              const id = lead.id;

              return (
                <div className="flex flex-col border border-white w-full select-none" key={id}>
                  <div className="grid grid-cols-3 items-center cursor-pointer">
                    <div className="flex items-center p-4 col-span-1" onClick={() => handleCircleClick(id, lead)}>
                      <FiCircle
                        size={24}
                        className={isSelected[id] ? 'fill-current text-white' : ''}
                      />
                      <p className="ml-2">{lead.firstName} {lead.lastName}, {lead.companyName}</p>
                    </div>
                    <div className="flex items-end justify-end p-4 col-span-2" onClick={() => toggleOpen(id)}>
                      {isSelected[id] && <p className="text-gray-500 mr-2">Selected</p>}
                      <animated.div style={springs[parseInt(lead.id)]}>
                        <FiChevronDown size={24} />
                      </animated.div>
                    </div>
                  </div>
                  {isOpen[id] && (
                    <div className="flex space-x-6 items-center p-4 border-t border-white">
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
      {modalOpen && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-60 z-10 flex justify-center items-center">
          <div className="bg-[#2C2F48] rounded-lg w-2/3 p-8">
            <h2 className="text-2xl text-white mb-8">Upload Leads</h2>
            <div className="flex">
              <div
                className={`cursor-pointer rounded-t-md py-2 px-4 ${activeTab === 'linkedin' ? 'bg-[#383B59]' : ''}`}
                onClick={() => setActiveTab('linkedin')}
              >
                LinkedIn URLs
              </div>
              <div
                className={`cursor-pointer rounded-t-md py-2 px-4 ${activeTab === 'csv' ? 'bg-[#383B59]' : ''}`}
                onClick={() => setActiveTab('csv')}
              >
                CSV File
              </div>
            </div>
            {activeTab === 'linkedin' && (
              <div>
                <textarea
                  className="mt-8 w-full h-48 bg-[#383B59] text-white p-2 rounded-md"
                  placeholder="Paste LinkedIn URLs here..."
                  value={linkedinInput}
                  onChange={(e) => setLinkedinInput(e.target.value)}
                />
                <button className="mt-4 bg-[#383B59] text-white py-2 px-4 rounded-md" onClick={handleLinkedInInput}>
                  Import
                </button>
              </div>
            )}
            {activeTab === 'csv' && (
              <div className="py-5">
                CSV files must be formatted as firstName,lastName,jobTitle,companyName,email,phone,linkedIn
                <div className="mt-8 flex flex-col items-center justify-center h-48 bg-[#383B59] rounded-md">
                  <label htmlFor="upload-button" className="cursor-pointer flex items-center space-x-2">
                    <FiUpload size={24} />
                    <span>{file ? `Uploaded ${file.name}` : 'Click here to upload a file'}</span>
                  </label>
                  <input
                    id="upload-button"
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={handleUpload}
                    ref={fileInput}
                  />
                </div>
              </div>
            )}
            <div className="mt-8 text-right">
              <button className="text-white" onClick={() => setModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {createModalOpen && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-60 z-10 flex justify-center items-center">
          <div className="bg-[#2C2F48] rounded-lg w-2/3 p-8">
            <h2 className="text-2xl text-white mb-8">Create Lead</h2>
            <form className="flex flex-col text-black">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newLead.firstName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newLead.lastName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="jobTitle"
                placeholder="Job Title"
                value={newLead.jobTitle}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={newLead.companyName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={newLead.email}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newLead.phone}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="linkedIn"
                placeholder="LinkedIn"
                value={newLead.linkedIn}
                onChange={handleInputChange}
              />
              <button type="button" className="mt-4 bg-[#383B59] text-white py-2 px-4 rounded-md" onClick={handleCreateLead}>
                Create
              </button>
            </form>
            <div className="mt-8 text-right">
              <button className="text-white" onClick={() => setCreateModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Center;
