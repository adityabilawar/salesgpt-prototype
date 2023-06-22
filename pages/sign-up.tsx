import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "@/lib/firebaseClient";
import Snackbar from "@/components/Snackbar";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [termsOfService, setTermsOfService] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);

  const submitRegistration = async () => {
    try {
      await createUserWithEmailAndPassword(
        email,
        password,
        firstName,
        lastName
      );
      router.push("/onboarding");
    } catch (error) {
      console.error(error);
    }

    setShowNotif(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setShowNotif(false), 5000);
  };


  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {showNotif && termsOfService && (
          <Snackbar message="Wrong email or password." color="red" />
        )}
        <div className="max-w-xl w-full space-y-8 loginContainer p-8 py-16">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={"/templogo.svg"}
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
              Create a new account
            </h2>

            <a
              href="/login"
              className="font-medium text-indigo-700 hover:text-indigo-800 flex justify-center"
            >
              Or sign in now
            </a>
          </div>
          <form
            className="mt-8 space-y-6"
            action="#"
            method="POST"
            onSubmit={submitRegistration}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md -space-y-px">
              <div className="flex gap-x-8 w-full">
                <div className="w-1/2">
                  <label htmlFor="email-address" className="sr-only">
                    First name
                  </label>
                  <input
                    placeholder="First name"
                    onChange={e => {
                      setFirstName(e.target.value);
                    }}
                    value={firstName}
                    name="first-name"
                    type="text"
                    autoComplete="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>

                <div className="w-1/2">
                  <label htmlFor="Last name" className="sr-only">
                    Last name
                  </label>
                  <input
                    placeholder="Last name"
                    onChange={e => {
                      setLastName(e.target.value);
                    }}
                    value={lastName}
                    name="last-name"
                    type="text"
                    autoComplete="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>

              <div className="h-5" />

              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  placeholder="Email"
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>

              <div className="h-5" />

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>

              <div className="h-5" />

              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={termsOfService}
                    onChange={() => {
                      setTermsOfService(!termsOfService);
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="terms-checkbox" className="text-sm">
                    I agree to the Pipeline{" "}
                    <span className="text-blue-500">
                      <a href="/terms-of-service">Terms of Service</a>
                    </span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="privacy-checkbox"
                    checked={privacyPolicy}
                    onChange={() => {
                      setPrivacyPolicy(!privacyPolicy);
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="privacy-checkbox" className="text-sm">
                    I agree to the Pipeline{" "}
                    <span className="text-blue-500">
                      <a href="/privacy-policy">Privacy Policy</a>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="text-white group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>

            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;