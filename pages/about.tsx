import { useEffect, useState } from "react";
import importImg from '@/public/import.png';
import Image from 'next/image';

const AboutPage = () => {

	const [aboutData, setAbout] = useState<About | null>(null);

	useEffect(() => {
		const aboutStorage = localStorage.getItem('about');
		
		if(!aboutStorage) setAbout({
			firstName: '',
			lastName: '',
			companyName: '',
			jobTitle: '',
			companyDetails: '',
			companyValue: '',
			specialOffers: ''
		}); else setAbout(JSON.parse(aboutStorage));
	});

	return (
		<>
			<div className="leads-main flex w-full h-full">
				<div className="leads-sidebar w-1/5 h-full min-h-full bg-[#2C2F48] flex flex-col justify-start">
					<div className="leads-title text-4xl font-semibold text-blue-200 mt-10 self-center">
						Leads
					</div>
					<div className="leads-list flex flex-col items-center cursor-pointer select-none self-center">
						<Image src={importImg} className="w-20 h-20" alt="import icon" />
						<div className="text-blue-100 text-2xl">
							Import leads
						</div>
					</div>
				</div>
				<div className="leads-sec w-4/5 h-full flex flex-col overflow-y-auto">
					Hi
				</div>
			</div>
		</>
	)
}

export default AboutPage;