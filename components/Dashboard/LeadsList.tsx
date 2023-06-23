import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { RootState } from "../store";
import {
  fetchLeads,
  addSelectedLead,
  setSelectedLead,
  clearSelectedLeads,
  removeLead,
  updateLeads,
  toggleLeadSelection,
  updateSelectedLead,
} from "@/components/store/leadsSlice";
import { setView } from "@/components/store/sidebarSlice";
import {
  FiChevronDown,
  FiCircle,
  FiMail,
  FiSearch,
  FiEdit3,
  FiMoreHorizontal,
  FiTrash,
  FiUpload,
} from "react-icons/fi";
import Link from "next/link";
import NProgress from "nprogress";
import Papa from "papaparse";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { animated, useSpring, useSprings } from "react-spring";
import axios from "axios";
import {
  CheckCircleIcon,
  MailIcon,
  PencilAltIcon,
  PhoneIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import { CheckIcon, PaperClipIcon } from "@heroicons/react/solid";

NProgress.configure({ showSpinner: false });

const LeadsList = () => {
  const dispatch = useDispatch();
  const leads = useSelector((state: RootState) => state.leads.leads) || [];
  const sidebarView = useSelector((state: RootState) => state.sidebar.view);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
  const [isSelected, setIsSelected] = useState<Record<string, boolean>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("linkedin");
  const [linkedinInput, setLinkedinInput] = useState<string>("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedLeadsCount, setSelectedLeadsCount] = useState<number>(0);
  const [editingLead, setEditingLead] = useState<{
    id?: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    companyName: string;
    email: string;
    phone: string;
    linkedIn: string;
  }>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    companyName: "",
    email: "",
    phone: "",
    linkedIn: "",
  });

  const handleSaveLead = async (id: string) => {
    setIsEditing(false);
    if (userId) {
      const docRef = doc(db, "users", userId, "leads", id);
      await setDoc(docRef, editingLead, { merge: true });
    } else {
      console.error("No user is signed in");
    }
  };

  const handleEditClick = (id: string, lead: Lead) => {
    setEditingLead({ id, ...lead });
    setIsEditing(true);
  };

  const [newLead, setNewLead] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    companyName: "",
    email: "",
    phone: "",
    linkedIn: "",
  });

  const onRowClick = (lead: Lead) => {
    dispatch(toggleLeadSelection(lead));
  };

  const toggleOpen = (id: string) => {
    setIsOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRowClick = (
    index: number,
    id: string,
    lead: Lead,
    event: React.MouseEvent
  ) => {
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
      updatedIsSelected[id]
        ? dispatch(addSelectedLead(lead))
        : dispatch(removeLead(lead));
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

    const selectedCount = Object.values(updatedIsSelected).filter(
      value => value
    ).length;
    console.log(selectedLeadsCount);
    setSelectedLeadsCount(selectedCount);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewLead(prevLead => ({ ...prevLead, [name]: value }));
  };

  const handleCreateLead = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (userId) {
      console.log(userId);
      const leadsRef = collection(db, "users", userId, "leads");
      await addDoc(leadsRef, newLead);
      setNewLead({
        firstName: "",
        lastName: "",
        jobTitle: "",
        companyName: "",
        email: "",
        phone: "",
        linkedIn: "",
      });
      setCreateModalOpen(false);
    } else {
      console.error("No user is signed in");
    }
  };

  const handleLinkedInInput = async () => {
    if (!userId) {
      console.error("No user is signed in");
      return;
    }
    const userData = await axios.post("/api/user", { urlInput: linkedinInput });
    const leads = userData.data;
    const leadsRef = collection(db, "users", userId, "leads");
    for (const lead of leads) {
      await addDoc(leadsRef, lead);
    }
    setLinkedinInput("");
    setModalOpen(false);
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
    dispatch(setView("SELECTED_LEADS"));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    NProgress.start();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
      NProgress.done();

      if (user) {
        const leadsRef = collection(db, "users", user.uid, "leads");
        const unsubscribeLeads = onSnapshot(leadsRef, snapshot => {
          const updatedLeads: Lead[] = [];
          snapshot.forEach(doc => {
            updatedLeads.push({ id: doc.id, ...doc.data() } as Lead);
          });
          dispatch(updateLeads(updatedLeads));
          setIsLoading(false);
        });

        return () => {
          unsubscribeLeads();
        };
      }
    });

    return () => {
      NProgress.remove();
      unsubscribe();
    };
  }, [dispatch]);

  if (loading) {
    return null;
  }

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
            const batchPromises = batch.map(async lead => {
              try {
                const userRef = doc(db, "users", userId);
                const userSnapshot = await getDoc(userRef);
                if (userSnapshot.exists()) {
                  const leadsRef = collection(db, "users", userId, "leads");
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected lead(s)?"
    );
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
        const leadRef = doc(db, "users", userId, "leads", leadId);
        await deleteDoc(leadRef);
      } catch (error) {
        console.error("Error removing lead: ", error);
      }
    }
    setIsSelected({});
    dispatch(clearSelectedLeads());

    console.log("Selected lead(s) removed from Firebase");
  };

  const handleSelectAll = () => {
    const allSelected =
      Object.keys(isSelected).length === leads.length &&
      !Object.values(isSelected).includes(false);

    // If all leads are already selected, unselect them. Otherwise, select all.
    if (allSelected) {
      dispatch(clearSelectedLeads());
      setIsSelected({});
    } else {
      const newSelected: Record<string, boolean> = {}; // Define the type for newSelected
      leads.forEach(lead => {
        newSelected[lead.id] = true;
        dispatch(addSelectedLead(lead));
      });
      dispatch(updateSelectedLead(leads[leads.length - 1])); // Update the selected lead state
      setIsSelected(newSelected);
    }
  };

  const leadProfileArr = [
    {
      field: "First name",
      value: newLead.firstName,
      type: "text",
    },
    {
      field: "Last name",
      value: newLead.lastName,
      type: "text",
    },
    {
      field: "Job title",
      value: newLead.jobTitle,
      type: "text",
    },
    {
      field: "Company name",
      value: newLead.companyName,
      type: "text",
    },
    {
      field: "Email",
      value: newLead.email,
      type: "email",
    },
    {
      field: "Phone number",
      value: newLead.phone,
      type: "tel",
    },
    {
      field: "LinkedIn",
      value: newLead.linkedIn,
      type: "url",
    },
  ];

  return (
    <div className="border-r-[1px] flex flex-col h-full py-6">
      <div className="flex-grow">
        <div className="flex flex-col border-b-[1px] px-10  sticky top-0">
          <h1 className="text-2xl">Leads</h1>

          <div className="flex py-5">
            <div className="relative flex items-center flex-grow">
              <input
                className="py-3 pl-12 pr-4 w-full rounded-md bg-transparent focus:outline-none border-gray-300 focus:border-brand"
                type="text"
                placeholder="Search..."
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 overflow-y-auto">
          <div className="flex justify-start ">
            <div className="space-x-5 my-5">
              <button
                className="border-[1px] rounded-md px-4 py-3 bg-brand text-white text-white text-xs"
                onClick={() => setModalOpen(true)}
              >
                Upload leads
              </button>
              <button
                className="border-[1px] rounded-md px-4 py-3 bg-brand text-white text-white text-xs"
                onClick={() => setCreateModalOpen(true)}
              >
                Create lead
              </button>
              <Link href="/dashboard/send">
                <button
                  className={`border-[1px] rounded-md px-4 py-3 bg-brand text-white text-white text-xs ${
                    selectedLeadsCount > 0
                      ? ""
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={handleContactAll}
                  disabled={selectedLeadsCount === 0}
                >
                  Send selected leads to campaign
                </button>
              </Link>
            </div>
          </div>
          
          <div className="h-full space-y-4 border rounded-md">
            {leads.length === 0 ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-xl text-gray-500">
                  Upload leads to send to campaign
                </p>
              </div>
            ) : (
              <div>
                <div>
                  <div>
                    <div className="flex flex-col">
                      <div className="overflow-x-auto">
                        <div className="inline-block min-w-full">
                          <div className="overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                  >
                                    <CheckIcon
                                      className={`ml-3 h-6 w-6 ${
                                        Object.keys(isSelected).length ===
                                          leads.length &&
                                        !Object.values(isSelected).includes(
                                          false
                                        )
                                          ? "text-brand"
                                          : "text-gray-400"
                                      }`}
                                      onClick={handleSelectAll}
                                    />
                                  </th>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                  >
                                    LEAD NAME
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    COMPANY INFO
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    PERSONAL INFO
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    LINKEDIN
                                  </th>
                                  <th
                                    scope="col"
                                    className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                  >
                                    <span className="sr-only">Edit</span>
                                  </th>
                                  <th
                                    scope="col"
                                    className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                  >
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
                                      const searchString =
                                        `${lead.firstName} ${lead.lastName} ${lead.companyName}`.toLowerCase();
                                      return searchString.includes(
                                        searchTerm.toLowerCase()
                                      );
                                    })
                                    .map((lead: Lead, index: number) => {
                                      const id = lead.id;

                                      return (
                                        <tr
                                          key={lead.id}
                                          className={`${
                                            isSelected[id] ? "bg-gray-100" : ""
                                          }`}
                                          onClick={event =>
                                            handleRowClick(
                                              index,
                                              id,
                                              lead,
                                              event
                                            )
                                          }
                                        >
                                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                            <div className="flex items-center space-x-3">
                                              {isSelected[id] ? (
                                                <CheckIcon className="h-5 w-5 text-brand" />
                                              ) : (
                                                <div className="h-5 w-5 border-2 rounded-md cursor-pointer"></div>
                                              )}
                                            </div>
                                          </td>
                                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                            {isEditing &&
                                            editingLead.id === lead.id ? (
                                              <div className="flex flex-col space-y-2">
                                                <input
                                                  className="border-b border-gray-300 px-2 py-1"
                                                  placeholder="First name"
                                                  value={editingLead.firstName}
                                                  onChange={e =>
                                                    setEditingLead({
                                                      ...editingLead,
                                                      firstName: e.target.value,
                                                    })
                                                  }
                                                />
                                                <input
                                                  className="border-b border-gray-300 px-2 py-1"
                                                  placeholder="Last name"
                                                  value={editingLead.lastName}
                                                  onChange={e =>
                                                    setEditingLead({
                                                      ...editingLead,
                                                      lastName: e.target.value,
                                                    })
                                                  }
                                                />
                                              </div>
                                            ) : (
                                              <div className="font-medium select-none text-gray-900">
                                                {lead.firstName} {lead.lastName}
                                              </div>
                                            )}
                                          </td>

                                          <td className="whitespace-nowrap select-none px-3 py-4 text-sm">
                                            {isEditing &&
                                            editingLead.id === lead.id ? (
                                              <div className="flex flex-col space-y-2">
                                                <input
                                                  className="border-b border-gray-300 px-2 py-1"
                                                  placeholder="Job Title"
                                                  value={editingLead.jobTitle}
                                                  onChange={e =>
                                                    setEditingLead({
                                                      ...editingLead,
                                                      jobTitle: e.target.value,
                                                    })
                                                  }
                                                />
                                                <input
                                                  className="border-b border-gray-300 px-2 py-1"
                                                  placeholder="Company"
                                                  value={
                                                    editingLead.companyName
                                                  }
                                                  onChange={e =>
                                                    setEditingLead({
                                                      ...editingLead,
                                                      companyName:
                                                        e.target.value,
                                                    })
                                                  }
                                                />
                                              </div>
                                            ) : (
                                              <>
                                                <div className="text-gray-900">
                                                  {lead.jobTitle}
                                                </div>
                                                <div className="text-gray-500">
                                                  {lead.companyName}
                                                </div>
                                              </>
                                            )}
                                          </td>
                                          <td className="whitespace-nowrap select-none px-3 py-4 text-sm">
                                            {isEditing &&
                                            editingLead.id === lead.id ? (
                                              <div className="flex flex-col space-y-2">
                                                <input
                                                  className="border-b border-gray-300 px-2 py-1"
                                                  placeholder="Email"
                                                  value={editingLead.email}
                                                  onChange={e =>
                                                    setEditingLead({
                                                      ...editingLead,
                                                      email: e.target.value,
                                                    })
                                                  }
                                                />
                                                <input
                                                  className="border-b border-gray-300 px-2 py-1"
                                                  placeholder="Phone Number"
                                                  value={editingLead.phone}
                                                  onChange={e =>
                                                    setEditingLead({
                                                      ...editingLead,
                                                      phone: e.target.value,
                                                    })
                                                  }
                                                />
                                              </div>
                                            ) : (
                                              <>
                                                <div className="flex items-center space-x-2">
                                                  {/* <MailIcon className="text-gray-500 h-5 w-5"/>  */}
                                                  <div className="text-gray-500">
                                                    {lead.email}
                                                  </div>
                                                </div>
                                                <div className="flex items-center space-x-2 mt-1">
                                                  {/* <PhoneIcon className="text-gray-500 h-5 w-5"/>  */}
                                                  <div className="text-gray-500">
                                                    {lead.phone}
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                          </td>
                                          <td className="whitespace-nowrap select-none px-3 py-4 text-sm">
                                            {isEditing &&
                                            editingLead.id === lead.id ? (
                                              <div>
                                                <input
                                                  className="border-b border-gray-300 px-2 py-1"
                                                  placeholder="LinkedIn URL"
                                                  value={editingLead.linkedIn}
                                                  onChange={e =>
                                                    setEditingLead({
                                                      ...editingLead,
                                                      linkedIn: e.target.value,
                                                    })
                                                  }
                                                />
                                              </div>
                                            ) : (
                                              <td className="whitespace-nowrap py-4 text-sm text-blue-600">
                                                <a
                                                  href={lead.linkedIn}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                >
                                                  {lead.linkedIn}
                                                </a>
                                              </td>
                                            )}
                                          </td>

                                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            {isEditing &&
                                            editingLead.id === lead.id ? (
                                              <div className="flex gap-x-3">
                                                <a
                                                  href="#"
                                                  className="select-none hover:text-indigo-900"
                                                  onClick={event => {
                                                    event.stopPropagation();
                                                    handleSaveLead(lead.id);
                                                  }}
                                                >
                                                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                                </a>

                                                <a
                                                  href="#"
                                                  className="mr-5 select-none hover:text-indigo-900"
                                                  onClick={event => {
                                                    event.stopPropagation();
                                                    setIsEditing(false);
                                                  }}
                                                >
                                                  <XIcon className="h-5 w-5 text-red-600" />
                                                </a>
                                              </div>
                                            ) : (
                                              <a
                                                href="#"
                                                className="text-indigo-600 select-none hover:text-indigo-900"
                                                onClick={event => {
                                                  event.stopPropagation();
                                                  handleEditClick(
                                                    lead.id,
                                                    lead
                                                  );
                                                }}
                                              >
                                                {/* Edit */}
                                                <PencilAltIcon className="h-5 w-5" />
                                              </a>
                                            )}
                                          </td>
                                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <TrashIcon
                                              className="text-red-500 cursor-pointer h-5 w-5"
                                              onClick={event => {
                                                event.stopPropagation();
                                                handleDeleteLead();
                                              }}
                                            />
                                          </td>
                                        </tr>
                                      );
                                    })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-60 z-10 flex justify-center items-center">
          <div className="bg-white rounded-lg w-2/3 p-8">
            <h2 className="text-2xl  mb-8">Upload Leads</h2>
            <div className="flex">
              <div
                className={`cursor-pointer rounded-t-md py-2 border px-4 ${
                  activeTab === "linkedin" ? "bg-gray-100" : ""
                }`}
                onClick={() => setActiveTab("linkedin")}
              >
                LinkedIn URLs
              </div>
              <div
                className={`cursor-pointer rounded-t-md py-2 border px-4 ${
                  activeTab === "csv" ? "bg-gray-100" : ""
                }`}
                onClick={() => setActiveTab("csv")}
              >
                CSV File
              </div>
            </div>
            {activeTab === "linkedin" && (
              <div>
                <textarea
                  className="mt-8 w-full h-48 bg-white  p-2 rounded-md"
                  placeholder="Paste LinkedIn Usernames here..."
                  value={linkedinInput}
                  onChange={e => setLinkedinInput(e.target.value)}
                />
              </div>
            )}
            {activeTab === "csv" && (
              <div className="py-5">
                CSV files must be formatted as{" "}
                <span className="font-semibold">
                  firstName,lastName,jobTitle,companyName,email,phone,linkedIn
                </span>
                <div className="mt-8 flex flex-col items-center justify-center h-48 bg-white border rounded-md">
                  <label
                    htmlFor="upload-button"
                    className="cursor-pointer flex items-center space-x-2"
                  >
                    <FiUpload size={24} />
                    <span>
                      {file
                        ? `Uploaded ${file.name}`
                        : "Click here to upload a file"}
                    </span>
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
            <div className="mt-8 text-right flex justify-end items-center gap-x-6">
              {activeTab === "linkedin" && (
                <button
                  className="bg-brand rounded-md text-white py-2 px-4 rounded-md"
                  onClick={handleLinkedInInput}
                >
                  Import
                </button>
              )}
              <button className="" onClick={() => setModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {createModalOpen && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-60 z-10 flex justify-center items-center">
          {/* <div className="bg-white rounded-lg w-2/3 p-8">
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
            </form>
            <div className="mt-2 text-right">
              <button
                type="button"
                className="mt-4 py-2 px-4 rounded-md bg-brand text-white mr-6"
                onClick={handleCreateLead}
              >
                Create
              </button>
              <button className="" onClick={() => setCreateModalOpen(false)}>
                Close
              </button>
            </div>
          </div> */}
          <LeadProfile />
        </div>
      )}
    </div>
  );

  function LeadProfile() {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg w-2/3 h-5/6 p-8 overflow-y-auto">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Lead Information
          </h3>
          {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p> */}
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {leadProfileArr.map((item, index) => {
              return (
                <div
                  key={index}
                  className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex items-center"
                >
                  <dt className="text-sm font-medium text-gray-500">
                    {item.field}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type={item.type}
                      name={item.field}
                      placeholder={item.field}
                      value={item.value}
                      onChange={handleInputChange}
                      className="border-b border-gray-300"
                    />
                  </dd>
                </div>
              );
            })}

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">About</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
                consequat sint. Sit id mollit nulla mollit nostrud in ea officia
                proident. Irure nostrud pariatur mollit ad adipisicing
                reprehenderit deserunt qui eu.
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Attachments</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul
                  role="list"
                  className="border border-gray-200 rounded-md divide-y divide-gray-200"
                >
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <PaperClipIcon
                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 flex-1 w-0 truncate">
                        resume_back_end_developer.pdf
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <PaperClipIcon
                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 flex-1 w-0 truncate">
                        coverletter_back_end_developer.pdf
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
        <div className="mt-2 text-right">
          <button
            type="button"
            className="mt-4 py-2 px-4 rounded-md bg-brand text-white mr-6"
            onClick={handleCreateLead}
          >
            Create
          </button>
          <button className="" onClick={() => setCreateModalOpen(false)}>
            Close
          </button>
        </div>
      </div>
    );
  }
};

export default LeadsList;
