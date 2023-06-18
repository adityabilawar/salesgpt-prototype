import { useState } from "react";
import styles from "@/styles/Login.module.css";
import graphic from "@/public/graphic.png";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "@/lib/firebaseClient";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const submitRegistration = async () => {
    try {
      await createUserWithEmailAndPassword(
        email,
        password,
        firstName,
        lastName
      );
      router.push("/leads");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* <div className="login-main flex w-full h-full">
				<div style={{ backgroundImage: `url(${graphic.src})` }} className="w-2/5 h-full min-h-full bg-center bg-no-repeat bg-cover relative">
				</div>
				<div className="login-sec w-3/5 h-full flex justify-center">
					<div className={`${styles.loginContainer} self-center w-3/5 h-4/5 bg-[#2C2F48] flex flex-col items-center justify-evenly`}>
						<div className="login-title font-semibold text-slate-200 text-6xl">
							Register
						</div>
						<div className="login-form flex flex-col gap-5">
							<input
								type="text"
								placeholder="First Name"
								onChange={e => setFirstName(e.target.value)}
								value={firstName}
								className='borderTransition p-2 pr-24 text-xl text-black border-b-2 border-solid border-[#e0f2fe] focus:border-[#818cf8]'
							/>
							<input
								type="text"
								placeholder="Last Name"
								onChange={e => setLastName(e.target.value)}
								value={lastName}
								className='borderTransition p-2 pr-24 text-xl text-black border-b-2 border-solid border-[#e0f2fe] focus:border-[#818cf8]'
							/>
							<input
								type="email"
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
						<div className={`${styles.loginBTN} p-5 text-2xl text-indigo-200 rounded-3xl font-semibold cursor-pointer select-none`} onClick={submitRegistration}>
							REGISTER
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
            <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
              Sign up for Pipeline
            </h2>
            <p className="mt-2 text-center text-sm text-gray-50">
              Or{" "}
              <a
                href="/login"
                className="font-medium text-indigo-300 hover:text-indigo-200"
              >
                sign in now
              </a>
            </p>
          </div>
          <form
            className="mt-8 space-y-6"
            action=""
            method="POST"
            onSubmit={submitRegistration}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>

              <div>
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </div>
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

            <div>
              <button
                onClick={() => {
                  submitRegistration();
                  router.push("/leads");
                }}
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
