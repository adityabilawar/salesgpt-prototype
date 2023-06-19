import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import { RootState } from '../store';
import { fetchLeads, addSelectedLead, setSelectedLead, clearSelectedLeads, removeLead, updateLeads, toggleLeadSelection, updateSelectedLead } from '@/components/store/leadsSlice';
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
  const [userId, setUserId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('linkedin');
  const [linkedinInput, setLinkedinInput] = useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const selectedLeadsCount = useSelector((state: RootState) => state.leads.selectedLeads.length);


  const [newLead, setNewLead] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    companyName: '',
    email: '',
    phone: '',
    linkedIn: '',
  });

  const onRowClick = (lead: Lead) => {
    dispatch(toggleLeadSelection(lead));
  };

  const toggleOpen = (id: string) => {
    setIsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const handleRowClick = (index: number, id: string, lead: Lead, event: React.MouseEvent) => {
    let updatedIsSelected = { ...isSelected };
  
    if (event.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(index, lastSelectedIndex);
      const end = Math.max(index, lastSelectedIndex);
  
      for (let i = start; i <= end; i++) {
        const leadId = leads[i].id;
        updatedIsSelected[leadId] = true;
        dispatch(addSelectedLead(leads[i]));
      }
    } else if (event.ctrlKey) {
      updatedIsSelected[id] = !isSelected[id];
      updatedIsSelected[id] ? dispatch(addSelectedLead(lead)) : dispatch(removeLead(lead));
    } else {
      if (isSelected[id]) {
        updatedIsSelected[id] = false;
        dispatch(removeLead(lead));
      } else {
        updatedIsSelected[id] = true;
        dispatch(addSelectedLead(lead));
      }
    }
  
    setIsSelected(updatedIsSelected);
    setLastSelectedIndex(index);
  };
  


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewLead((prevLead) => ({ ...prevLead, [name]: value }));
  };

  const handleCreateLead = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (userId) {
      console.log(userId);
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
    } else {
      console.error("No user is signed in");
    }
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
    if (!userId) {
      console.error("No user is signed in");
      return;
    }

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
    if (!userId) {
      console.error("No user is signed in");
      return;
    }

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
  }, [dispatch, userId]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId) {
      console.error("No user is signed in");
      return;
    }

    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      Papa.parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (let i = 0; i < results.data.length; i += 500) {
            const batch = results.data.slice(i, i + 500);
            const batchPromises = batch.map(async (lead) => {
              try {
                const userRef = doc(db, 'users', userId);
                const userSnapshot = await getDoc(userRef);
                if (userSnapshot.exists()) {
                  const leadsRef = collection(db, 'users', userId, 'leads');
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

  const handleDeleteLead = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete the selected lead(s)?");
    if (!confirmDelete) {
      return;
    }
  
    if (!userId) {
      console.error("No user is signed in");
      return;
    }
  
    const selectedLeadIds = Object.keys(isSelected);
  
    for (const leadId of selectedLeadIds) {
      if (!isSelected[leadId]) continue;
  
      const leadToDelete = leads.find((lead: Lead) => lead.id === leadId);
      if (leadToDelete) {
        dispatch(removeLead(leadToDelete));
      }
  
      try {
        const leadRef = doc(db, 'users', userId, 'leads', leadId);
        await deleteDoc(leadRef);
      } catch (error) {
        console.error('Error removing lead: ', error);
      }
    }
    setIsSelected({});
    dispatch(clearSelectedLeads());
  
    console.log('Selected lead(s) removed from Firebase');
  };



  const handleSelectAll = () => {
    const allSelected = Object.keys(isSelected).length === leads.length && !Object.values(isSelected).includes(false);

    // If all leads are already selected, unselect them. Otherwise, select all.
    if (allSelected) {
      dispatch(clearSelectedLeads());
      setIsSelected({});
    } else {
      const newSelected: Record<string, boolean> = {}; // Define the type for newSelected
      leads.forEach((lead) => {
        newSelected[lead.id] = true;
        dispatch(addSelectedLead(lead));
      });
      dispatch(updateSelectedLead(leads[leads.length - 1])); // Update the selected lead state
      setIsSelected(newSelected);
    }
  };

  return (
    <div className="border-r-[1px] flex flex-col h-full">
      {/* {selectedLeadsCount > 0 && (
        <div className="top-0 fixed w-full bg-gray-200 py-1 px-5">
          {selectedLeadsCount} lead(s) selected
        </div>
      )} */}
      <div className="flex-grow">
        <div className="flex flex-col border-b-[1px] px-10 py-5 sticky top-0">
          <h1 className="text-2xl">Leads</h1>
          <div className="flex-grow-0 py-5 flex space-x-5">
            <div className="bg-brand text-white rounded-md text-white text-sm px-5 flex justify-center items-center cursor-pointer" onClick={() => setModalOpen(true)}>
              Upload Leads
            </div>
            <div className="bg-brand text-white rounded-md text-white text-sm px-5 flex justify-center items-center cursor-pointer" onClick={() => setCreateModalOpen(true)}>
              Create Lead
            </div>
            <div className="relative border border-gray-200 border-md flex justify-center items-center space-x-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch size={24} />
              </div>
              <input
                className="py-2 pl-10 pr-4 w-full  rounded-md bg-transparent focus:outline-none"
                placeholder="Search..."
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="p-10 space-y-4 overflow-y-auto">
          <div className="h-full space-y-4 border rounded-md">
            <div>
              <div className="p-4 border-b">
                <Link href="/dashboard/send">
                  <button className="border-[1px] rounded-md px-6 py-3 bg-brand text-white text-white text-sm" onClick={handleContactAll}>
                    Send selected leads to campaign
                  </button>
                </Link>
              </div>
              <div>
                <div className="flex flex-col">
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <div
                                  className={`h-5 w-5 border-2 ml-3 rounded-md cursor-pointer ${Object.keys(isSelected).length === leads.length && !Object.values(isSelected).includes(false) ? 'bg-brand' : ''}`}
                                  onClick={handleSelectAll}
                                ></div>
                              </th>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                LEAD NAME
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                COMPANY INFO
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                PERSONAL INFO
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                LINKEDIN
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Edit</span>
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Delete</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {isLoading ? (
                              <div className="animate-pulse flex space-x-4 w-full">
                                <div className="flex-1 space-y-6 py-1">
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-7 gap-4">
                                      <div className="h-2 bg-slate-700 rounded w-1/8"></div>
                                      <div className="h-2 bg-slate-700 rounded w-2/8"></div>
                                      <div className="h-2 bg-slate-700 rounded w-1/8"></div>
                                      <div className="h-2 bg-slate-700 rounded w-1/8"></div>
                                      <div className="h-2 bg-slate-700 rounded w-1/8"></div>
                                      <div className="h-2 bg-slate-700 rounded w-1/8"></div>
                                      <div className="h-2 bg-slate-700 rounded w-1/8"></div>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              leads
                                .filter((lead: Lead) => {
                                  const searchString = `${lead.firstName} ${lead.lastName} ${lead.companyName}`.toLowerCase();
                                  return searchString.includes(searchTerm.toLowerCase());
                                })
                                .map((lead: Lead, index: number) => {
                                  const id = lead.id;

                                  return (
                                    <tr
                                      key={lead.id}
                                      className={`${isSelected[id] ? 'bg-gray-100' : ''}`}
                                      onClick={(event) => handleRowClick(index, id, lead, event)}
                                    >
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="flex items-center space-x-3">
                                          <div
                                            className={`h-5 w-5 border-2 rounded-md cursor-pointer ${isSelected[id] ? 'bg-brand' : ''}`}
                                          ></div>
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="flex items-center">
                                          <div>
                                            <div className="font-medium select-none text-gray-900">{lead.firstName} {lead.lastName}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap select-none px-3 py-4 text-sm text-gray-500">
                                        <div className="text-gray-900">{lead.jobTitle}</div>
                                        <div className="text-gray-500">{lead.companyName}</div>
                                      </td>
                                      <td className="whitespace-nowrap px-3 select-none py-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                          <div className="text-gray-500">{lead.email}</div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                          <div className="text-gray-900">{lead.phone}</div>
                                        </div>

                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lead.linkedIn}</td>
                                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <a
                                          href="#"
                                          className="text-indigo-600 select-none hover:text-indigo-900"
                                          onClick={(event) => event.stopPropagation()}
                                        >
                                          Edit
                                        </a>
                                      </td>
                                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <FiTrash
                                          size={20}
                                          className="text-red-500 cursor-pointer"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleDeleteLead(id);
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  );
                                }))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-60 z-10 flex justify-center items-center">
          <div className="bg-white rounded-lg w-2/3 p-8">
            <h2 className="text-2xl  mb-8">Upload Leads</h2>
            <div className="flex">
              <div
                className={`cursor-pointer rounded-t-md py-2 border px-4 ${activeTab === 'linkedin' ? 'bg-white' : ''}`}
                onClick={() => setActiveTab('linkedin')}
              >
                LinkedIn URLs
              </div>
              <div
                className={`cursor-pointer rounded-t-md py-2 border px-4 ${activeTab === 'csv' ? 'bg-white' : ''}`}
                onClick={() => setActiveTab('csv')}
              >
                CSV File
              </div>
            </div>
            {activeTab === 'linkedin' && (
              <div>
                <textarea
                  className="mt-8 w-full h-48 bg-white  p-2 rounded-md"
                  placeholder="Paste LinkedIn URLs here..."
                  value={linkedinInput}
                  onChange={(e) => setLinkedinInput(e.target.value)}
                />
                <button className="mt-4 bg-brand rounded-md text-white py-2 px-4 rounded-md" onClick={handleLinkedInInput}>
                  Import
                </button>
              </div>
            )}
            {activeTab === 'csv' && (
              <div className="py-5 ">
                CSV files must be formatted as firstName,lastName,jobTitle,companyName,email,phone,linkedIn
                <div className="mt-8 flex flex-col items-center justify-center h-48 bg-white border rounded-md">
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
              <button className="" onClick={() => setModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {createModalOpen && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-60 z-10 flex justify-center items-center">
          <div className="bg-white rounded-lg w-2/3 p-8">
            <h2 className="text-2xl  mb-8">Create Lead</h2>
            <form className="flex flex-col ">
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
              <button type="button" className="mt-4 bg-white  py-2 px-4 rounded-md" onClick={handleCreateLead}>
                Create
              </button>
            </form>
            <div className="mt-8 text-right">
              <button className="" onClick={() => setCreateModalOpen(false)}>
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
