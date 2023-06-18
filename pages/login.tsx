import { useEffect, useState } from "react";
import styles from "@/styles/Login.module.css";
import graphic from "@/public/graphic.png";
import { useRouter } from "next/router";
import { onAuthStateChanged, User } from "firebase/auth";
import { signInWithEmailAndPassword, auth } from "@/lib/firebaseClient";
import { LockClosedIcon } from "@heroicons/react/solid";
import { FormEvent } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();
    const { user, error } = await signInWithEmailAndPassword(email, password);
    if (user) {
      router.push("/dashboard");
    } else {
      setError(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <>
      {/* <div className="login-main flex w-full h-full">
				<div style={{ backgroundImage: `url(${graphic.src})` }} className="w-2/5 h-full min-h-full bg-center bg-no-repeat bg-cover relative">
				</div>
				<div className="login-sec w-3/5 h-full flex justify-center">
					<div className={`${styles.loginContainer} self-center w-3/5 h-4/5 bg-[#2C2F48] flex flex-col items-center justify-evenly`}>
						<div className="login-title font-semibold text-slate-200 text-6xl">
							Log In
						</div>
						<div className="login-form flex flex-col gap-5">
							<input
								type="text"
								placeholder="Email"
								onChange={e => setEmail(e.target.value)}
								value={email}
								className='borderTransition p-2 pr-24 text-xl text-black border-b-2 border-solid border-[#e0f2fe] focus:border-[#818cf8]'
							/>
							<input
								type="password"
								placeholder="Password"
								onChange={e => setPassword(e.target.value)}
								value={password}
								className='borderTransition p-2 pr-24 text-xl text-black border-b-2 border-solid border-[#e0f2fe] focus:border-[#818cf8]'
							/>
						</div>
						<div className={`${styles.loginBTN} p-5 text-2xl text-indigo-200 rounded-3xl font-semibold cursor-pointer select-none`} onClick={submitLogin}>
							LOG IN
						</div>
					</div>
				</div>
			</div> */}

      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 loginContainer p-12">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={"/templogo.svg"}
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Sign in to Pipeline
            </h2>
            <p className="mt-2 text-center text-sm text-gray-50">
              Or{" "}
              <a
                href="/sign-up"
                className="font-medium text-indigo-300 hover:text-indigo-200"
              >
                sign up now
              </a>
            </p>
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
                  className="ml-2 block text-sm text-white"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-300 hover:text-indigo-200"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200"
                    aria-hidden="true"
                  />
                </span>
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
