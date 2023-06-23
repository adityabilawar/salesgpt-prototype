import { textArea, textBox } from "@/components/FormComponents";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, updateUserProfile } from "@/lib/firebaseClient";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

export default function onboarding() {
  const router = useRouter();
  const [onboarding, setOnboarding] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyInformation, setCompanyInformation] = useState("");
  const [valueProvide, setValueProvide] = useState("");
  const [problemSolve, setProblemSolve] = useState("");

  const handleSubmitOnboarding = async event => {
    event.preventDefault(); 
    if (
      phoneNumber &&
      linkedIn &&
      jobTitle &&
      companyInformation &&
      valueProvide &&
      problemSolve
    ) {
      try {
        await updateUserProfile(
          phoneNumber,
          linkedIn,
          jobTitle,
          companyInformation,
          valueProvide,
          problemSolve
        );
        router.push("/login");
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please fill all the fields before proceeding.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        setUserId(user.uid);
  
        const userDoc = doc(collection(db, "users"), user.uid);
        const userData = await getDoc(userDoc);
        
        if (userData.exists()) {
          const {
            phoneNumber,
            linkedInProfile,
            jobTitle,
            companyInformation,
            companyValue,
            problem,
          } = userData.data();
  
          if (phoneNumber || linkedInProfile || jobTitle || companyInformation || companyValue || problem) {
            router.push('/dashboard');
          }
        }
      } else {
        setUserId(null);
        router.push('/login');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
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

  const handleSubmit = async e => {
    e.preventDefault();
    if (
      phoneNumber &&
      linkedIn &&
      jobTitle &&
      companyInformation &&
      valueProvide &&
      problemSolve
    ) {
      setOnboarding(true);
      if (userId) {
        const userData = {
          phoneNumber,
          linkedInProfile: linkedIn,
          jobTitle: jobTitle,
          companyInformation,
          companyValue: valueProvide,
          problem: problemSolve,
        };
        try {
          await setDoc(doc(collection(db, "users"), userId), userData);
          router.push("/login");
        } catch (error) {
          console.error("Error saving user data: ", error);
        }
      }
    } else {
      alert("Please fill all the fields before proceeding.");
    }
  };

  return onboarding ? (
    <Confirmation />
  ) : (
    <div>
      <div className="flex-shrink-0 flex items-center px-4 pt-5">
        <img className="h-8 w-auto" src="/templogo.svg" alt="Pipeline AI" />
        <span className="ml-3 text-gray-900 text-2xl font-semibold">
          Pipeline AI
        </span>
      </div>
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
                    "Phone number",
                    "tel",
                    "phone-number",
                    "",
                    setPhoneNumber,
                    false
                  )}
                  {textBox(
                    "Phone number",
                    "tel",
                    "phone-number",
                    "",
                    setPhoneNumber,
                    false
                  )}
                  {textBox(
                    "LinkedIn username",
                    "text",
                    "linkedin",
                    "",
                    setLinkedIn,
                    false
                  )}
                  {textBox(
                    "Job title",
                    "text",
                    "job-title",
                    "",
                    setJobTitle,
                    false
                  )}
                  {/* 
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
                </div> */}

                  <hr className="mt-6" />

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
              <div className="flex justify-end pt-5">
                <button
                  onClick={handleSubmitOnboarding}
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
      <div className="flex-shrink-0 flex items-center px-4 py-5">
        <img className="h-8 w-auto" src="/templogo.svg" alt="Pipeline AI" />
        <span className="ml-3 text-gray-900 text-2xl font-semibold">
          Pipeline AI
        </span>
      </div>
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
