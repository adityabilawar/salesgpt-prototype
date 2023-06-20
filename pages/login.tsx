import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Login.module.css";
import graphic from "@/public/graphic.png";
import { useRouter } from "next/router";
import { onAuthStateChanged, User } from "firebase/auth";
import { signInWithEmailAndPassword, auth } from "@/lib/firebaseClient";
import { LockClosedIcon } from "@heroicons/react/solid";
import { FormEvent } from "react";
import Link from "next/link";
import Snackbar from "@/components/Snackbar";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [showNotif, setShowNotif] = useState(false);
  const timeoutRef = useRef(null);

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();
    const { user, error } = await signInWithEmailAndPassword(email, password);
    if (user) {
      router.push("/dashboard");
    } else {
      setError(error);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 5000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return unsubscribe;
  }, []);

  return (
    <>
    {showNotif && error && <Snackbar message="Wrong email or password." color="red" />}
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 loginContainer p-12">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={"/templogo.svg"}
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
              Sign in to Pipeline
            </h2>

            <Link
              href="/sign-up"
              className="font-medium text-indigo-700 hover:text-indigo-800 flex justify-center"
            >
              or sign up now
            </Link>
          </div>
          <form
            className="mt-8 space-y-6"
            action=""
            method="POST"
            onSubmit={submitLogin}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-black"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-800 hover:text-indigo-700"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* {error && <p className="text-red-500">{error}</p>} */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
