<<<<<<< HEAD
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
=======
// import Profile from "@/components/Dashboard/SidebarContents/Profile";

// export default function settings() {
//   return (
//     <>
//       <h1 className="text-3xl font-bold mx-10 mt-10">My Profile</h1>
//       <div className="h-5" />
//       <Profile />
//     </>
//   );
// }
import { Fragment, useState } from "react";
import {
  Disclosure,
  Menu,
  RadioGroup,
  Switch,
  Transition,
} from "@headlessui/react";
import {
  PaperClipIcon,
  QuestionMarkCircleIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import {
  BellIcon,
  CogIcon,
  CreditCardIcon,
  KeyIcon,
  MenuIcon,
  UserCircleIcon,
  ViewGridAddIcon,
  XIcon,
} from "@heroicons/react/outline";
import Profile from "@/components/Dashboard/SidebarContents/Profile";

const plans = [
  {
    name: "Startup",
    priceMonthly: 29,
    priceYearly: 290,
    limit: "Up to 5 active job postings",
  },
  {
    name: "Business",
    priceMonthly: 99,
    priceYearly: 990,
    limit: "Up to 25 active job postings",
  },
  {
    name: "Enterprise",
    priceMonthly: 249,
    priceYearly: 2490,
    limit: "Unlimited active job postings",
  },
];
const payments = [
  {
    id: 1,
    date: "1/1/2020",
    datetime: "2020-01-01",
    description: "Business Plan - Annual Billing",
    amount: "CA$109.00",
    href: "#",
  },
  // More payments...
];

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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function settings() {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [annualBillingEnabled, setAnnualBillingEnabled] = useState(true);
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
              {/* <LeadProfile/> */}
              {/* Plan */}

              <div className="h-3" />
              <h2 className="text-xl leading-6 font-medium text-gray-900">
                Plan
              </h2>
              <section aria-labelledby="plan-heading">
                <form action="#" method="POST">
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                      <RadioGroup
                        value={selectedPlan}
                        onChange={setSelectedPlan}
                      >
                        <RadioGroup.Label className="sr-only">
                          Pricing plans
                        </RadioGroup.Label>
                        <div className="relative bg-white rounded-md -space-y-px">
                          {plans.map((plan, planIdx) => (
                            <RadioGroup.Option
                              key={plan.name}
                              value={plan}
                              className={({ checked }) =>
                                classNames(
                                  planIdx === 0
                                    ? "rounded-tl-md rounded-tr-md"
                                    : "",
                                  planIdx === plans.length - 1
                                    ? "rounded-bl-md rounded-br-md"
                                    : "",
                                  checked
                                    ? "bg-indigo-50 border-indigo-200 z-10"
                                    : "border-gray-200",
                                  "relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3 focus:outline-none"
                                )
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <div className="flex items-center text-sm">
                                    <span
                                      className={classNames(
                                        checked
                                          ? "bg-indigo-500 border-transparent"
                                          : "bg-white border-gray-300",
                                        active
                                          ? "ring-2 ring-offset-2 ring-gray-900"
                                          : "",
                                        "h-4 w-4 rounded-full border flex items-center justify-center"
                                      )}
                                      aria-hidden="true"
                                    >
                                      <span className="rounded-full bg-white w-1.5 h-1.5" />
                                    </span>
                                    <RadioGroup.Label
                                      as="span"
                                      className="ml-3 font-medium text-gray-900"
                                    >
                                      {plan.name}
                                    </RadioGroup.Label>
                                  </div>
                                  <RadioGroup.Description className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center">
                                    <span
                                      className={classNames(
                                        checked
                                          ? "text-indigo-900"
                                          : "text-gray-900",
                                        "font-medium"
                                      )}
                                    >
                                      ${plan.priceMonthly} / mo
                                    </span>{" "}
                                    <span
                                      className={
                                        checked
                                          ? "text-indigo-700"
                                          : "text-gray-500"
                                      }
                                    >
                                      (${plan.priceYearly} / yr)
                                    </span>
                                  </RadioGroup.Description>
                                  <RadioGroup.Description
                                    className={classNames(
                                      checked
                                        ? "text-indigo-700"
                                        : "text-gray-500",
                                      "ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right"
                                    )}
                                  >
                                    {plan.limit}
                                  </RadioGroup.Description>
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>

                      <Switch.Group as="div" className="flex items-center">
                        <Switch
                          checked={annualBillingEnabled}
                          onChange={setAnnualBillingEnabled}
                          className={classNames(
                            annualBillingEnabled
                              ? "bg-indigo-500"
                              : "bg-gray-200",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors ease-in-out duration-200"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              annualBillingEnabled
                                ? "translate-x-5"
                                : "translate-x-0",
                              "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                            )}
                          />
                        </Switch>
                        <Switch.Label as="span" className="ml-3">
                          <span className="text-sm font-medium text-gray-900">
                            Annual billing{" "}
                          </span>
                          <span className="text-sm text-gray-500">
                            (Save 10%)
                          </span>
                        </Switch.Label>
                      </Switch.Group>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <button
                        type="submit"
                        className="bg-gray-800 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </section>
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
>>>>>>> 9d47f26280e8492ababdfcc5f4d120166d396aa2
