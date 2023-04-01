import { useEffect, useState } from "react";
import styles from '@/styles/Login.module.css';
import graphic from '@/public/graphic.png';
import { useRouter } from "next/router";

const LoginPage = () => {

	const router = useRouter();
	const [name, setName] = useState('');
	const [pass, setPass] = useState('');
  
	const submitLogin = () => {
	  console.log(name, pass);
	  localStorage.setItem('auth', 'true');
	  localStorage.setItem('fullName', name);
	  router.push('/leads');
	}

	useEffect(() => {
		if(localStorage.getItem('auth') === 'true') router.push('/leads');
	});
  
	return (
	  <>
		<div className="login-main flex w-full h-full">
		  <div style={{backgroundImage: `url(${graphic.src})`}} className="w-2/5 h-full min-h-full bg-center bg-no-repeat bg-cover relative">
		  </div>
		  <div className="login-sec w-3/5 h-full flex justify-center">
			<div className={`${styles.loginContainer} self-center w-3/5 h-4/5 bg-[#2C2F48] flex flex-col items-center justify-evenly`}>
			  <div className="login-title font-semibold text-slate-200 text-6xl">
				Log In
			  </div>
			  <div className="login-form flex flex-col gap-5">
				<input 
				  type="text"
				  placeholder="Full Name"
				  onChange={e => setName(e.target.value)}
				  value={name}
				  className={`${styles.loginInput} p-2 pr-24 text-xl text-[#f1f5f9] border-b-2 border-solid border-[#e0f2fe] focus:border-[#818cf8]`}
				/>
				<input 
				  type="password"
				  placeholder="Password"
				  onChange={e => setPass(e.target.value)}
				  value={pass}
				  className={`${styles.loginInput} p-2 pr-24 text-xl text-[#f1f5f9] border-b-2 border-solid border-[#e0f2fe] focus:border-[#818cf8]`}
				/>
			  </div>
			  <div className={`${styles.loginBTN} p-5 text-2xl text-indigo-200 rounded-3xl font-semibold cursor-pointer select-none`} onClick={submitLogin}>
				SUBMIT
			  </div>
			</div>
		  </div>
		</div>
	  </>
	);
  }
  
  export default LoginPage;