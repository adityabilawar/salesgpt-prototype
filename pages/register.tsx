import { useState } from "react";
import styles from '@/styles/Login.module.css';
import graphic from '@/public/graphic.png';
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "@/lib/firebaseClient";

const RegisterPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

	const submitRegistration = async () => {
		try {
			await createUserWithEmailAndPassword(email, password, firstName, lastName);
			router.push('/leads');
		} catch (error) {
			console.error(error);
		}
	}


	return (
		<>
			<div className="login-main flex w-full h-full">
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
			</div>
		</>
	);
}

export default RegisterPage;
