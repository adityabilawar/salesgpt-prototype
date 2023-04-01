import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoginPage from './login'

export default function Home() {

	const router = useRouter();
	useEffect(() => {
		if(localStorage.getItem('auth') === 'true') router.push('/leads');
    else router.push('/login');
	});

  return (
    <>
    </>
  )
}
