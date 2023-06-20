import { textArea, textBox } from "@/components/FormComponents";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { BadgeCheckIcon } from "@heroicons/react/solid";

export default function onboarding() {
  const router = useRouter();
  const [onboarding, setOnboarding] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [companyInformation, setCompanyInformation] = useState("");
  const [valueProvide, setValueProvide] = useState("");
  const [problemSolve, setProblemSolve] = useState("");

  const handleSubmit = e => {
    setOnboarding(true);

    router.push("/login");
  };

  return onboarding ? (
    <Confirmation />
  ) : (
    <div className="py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Set up your account to start increasing your sales.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <form
            className="px-6 pb-4 space-y-6 divide-y divide-gray-200"
            onSubmit={handleSubmit}
          >
            <div className="py-6 space-y-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Personal Information
              </h3>
              <div>
                {textBox(
                  "First name",
                  "text",
                  "first-name",
                  "",
                  setFirstName,
                  false
                )}
                {textBox(
                  "Last name",
                  "text",
                  "last-name",
                  "",
                  setLastName,
                  false
                )}
                {textBox("Email", "email", "email", "", setEmail, false)}
                {textBox(
                  "Phone number",
                  "tel",
                  "phone-number",
                  "",
                  setPhoneNumber,
                  false
                )}
                {textBox(
                  "LinkedIn URL",
                  "url",
                  "linkedin",
                  "",
                  setLinkedIn,
                  false
                )}

                <div className="mt-6">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Photo
                  </label>
                  <div className="flex items-center mt-2">
                    <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    <button
                      type="button"
                      className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <hr className="mt-6"/>

                <div className="py-6 space-y-6"></div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Company Information
                </h3>
                <div className="py-3"></div>

                {textArea(
                  "Company information",
                  "company-information",
                  setCompanyInformation
                )}

                {textArea(
                  "Value you provide",
                  "value-you-provide",
                  setValueProvide
                )}

                {textArea(
                  "Problems you solve",
                  "problems-you-solve",
                  setProblemSolve
                )}
              </div>
            </div>
            <div className="pt-8">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Notifications
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  We'll always let you know about important changes, but you
                  pick what else you want to hear about.
                </p>
              </div>
              <div className="mt-6 space-y-6 divide-y divide-gray-200">
                <div className="pt-6">
                  <div role="group" aria-labelledby="label-email">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
                      <div>
                        <div
                          className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                          id="label-email"
                        >
                          By Email
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg space-y-4">
                          <div className="relative flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="comments"
                                name="comments"
                                type="checkbox"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="comments"
                                className="font-medium text-gray-700"
                              >
                                Comments
                              </label>
                              <p className="text-gray-500">
                                Get notified when someone posts a comment on a
                                posting.
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="relative flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="candidates"
                                  name="candidates"
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="candidates"
                                  className="font-medium text-gray-700"
                                >
                                  Candidates
                                </label>
                                <p className="text-gray-500">
                                  Get notified when a candidate applies for a
                                  job.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="relative flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="offers"
                                  name="offers"
                                  type="checkbox"
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor="offers"
                                  className="font-medium text-gray-700"
                                >
                                  Offers
                                </label>
                                <p className="text-gray-500">
                                  Get notified when a candidate accepts or
                                  rejects an offer.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-5">
              <button
                type="button"
                className="mr-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Confirmation() {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push("/login");
    }, 5000); // After 5 seconds, push to login page

    return () => clearTimeout(timeoutId); // Clean up on component unmount
  }, [router]); // Depend on router

  return (
    <>
      <div className="min-h-screen pt-24 pb-12 flex flex-col bg-white">
        <main className="flex-grow flex justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-center">
              <BadgeCheckIcon className="h-24 w-24 text-green-600" />
            </div>
            <div className="text-center">
              <h1 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
                You have successfully signed up for Pipeline.
              </h1>
              <p className="mt-4 text-base text-gray-500">
                Check your inbox for a confirmation email. Redirecting to login
                page in 5 seconds...
              </p>
              <div className="mt-6">
                <Link href="/">
                  <div className="text-base font-medium text-blue-600 hover:text-blue-500 hover:cursor-pointer">
                    Go back home
                    <span aria-hidden="true"> &rarr;</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
