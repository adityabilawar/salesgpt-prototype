import { Fragment, useState } from "react";
import Profile from "@/components/Dashboard/SidebarContents/Profile";
import Plan from "@/components/Profile/Plan";
import { PaperClipIcon } from "@heroicons/react/outline";

const leadProfileArr = [
  {
    field: "First name",
    value: "newLead.firstName",
    type: "text",
  },
  {
    field: "Last name",
    value: "newLead.lastName",
    type: "text",
  },
  {
    field: "Job title",
    value: "newLead.jobTitle",
    type: "text",
  },
  {
    field: "Company name",
    value: "newLead.companyName",
    type: "text",
  },
  {
    field: "Email",
    value: "newLead.email",
    type: "email",
  },
  {
    field: "Phone number",
    value: "newLead.phone",
    type: "tel",
  },
  {
    field: "LinkedIn",
    value: "newLead.linkedIn",
    type: "url",
  },
];

export default function settings() {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [newLead, setNewLead] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    companyName: "",
    email: "",
    phone: "",
    linkedIn: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewLead(prevLead => ({ ...prevLead, [name]: value }));
  };

  const handleCreateLead = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    // if (userId) {
    //   console.log(userId);
    //   const leadsRef = collection(db, "users", userId, "leads");
    //   await addDoc(leadsRef, newLead);
    //   setNewLead({
    //     firstName: "",
    //     lastName: "",
    //     jobTitle: "",
    //     companyName: "",
    //     email: "",
    //     phone: "",
    //     linkedIn: "",
    //   });
    //   setCreateModalOpen(false);
    // } else {
    //   console.error("No user is signed in");
    // }
  };

  return (
    <>
      <div className="h-screen overflow-hidden">
        <main className="mx-auto pb-10 lg:py-12 lg:px-8 overflow-y-auto h-full">
          <div className="lg:gap-x-5">
            <div className="space-y-6 sm:px-6 lg:px-0">
              <h2 className="text-xl leading-6 font-medium text-gray-900">
                Profile
              </h2>
              <Profile />

              <div className="h-3" />
              <Plan />
            </div>
          </div>
        </main>
      </div>
    </>
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
}
