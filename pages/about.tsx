import { useEffect, useState } from "react";
import importImg from '@/public/import.png';
import Image from 'next/image';
import { useRouter } from "next/router";

const AboutPage = () => {

	const [aboutData, setAbout] = useState<About | null>(null);
	const [status, setStatus] = useState('Import leads');
	const router = useRouter();

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
	}, []);

	const saveAbout = () => {
		if(!aboutData) return;
		if(!aboutData.firstName || !aboutData.lastName) {
			setStatus('Need names!');
			return;
		}
		localStorage.setItem('about', JSON.stringify(aboutData));
		setStatus('Saved');
	}

	if(!aboutData) return <></>;

	return (
		<>
			<div className="leads-main flex w-full h-full">
				<div className="leads-sidebar w-1/5 h-full min-h-full bg-[#2C2F48] flex flex-col justify-start">
					<div className="leads-title text-4xl font-semibold text-blue-200 mt-10 h-1/3 self-center">
						Leads
					</div>
					<div className="leads-list flex flex-col items-center justify-center select-none cursor-pointer self-center" onClick={() => router.push('/leads')}>
						<Image src={importImg} className="w-20 h-20" alt="import icon" />
						<div className="text-blue-100 text-2xl">
							{status}
						</div>
					</div>
				</div>
				<div className="leads-sec w-4/5 h-full flex flex-col overflow-y-auto">
					<div className="leads-banner w-3/5 h-1/5 shrink-0 mt-5 rounded-2xl self-center border-2 border-solid border-[#586FD1] flex items-center justify-center">
						<div className="banner-title text-2xl text-blue-200">
							Create your personalized message
						</div>
					</div>

					<div className="about-sec flex flex-col items-center w-full h-full">
						<div className="mt-5 text-3xl text-blue-200 font-semibold">Tell us About Yourself</div>
						<div className="first-sec flex flex-col w-full mt-5">
							<div className="flex flex-col w-full gap-5">
								<div className="flex w-full justify-between">
									<div className="flex justify-center gap-6 ml-[15%]">
										<div className="text-lg text-blue-200 font-medium">First Name</div>
										<input type="text" className="bg-[#383B59] p-2 w-48 h-8 text-blue-100 text-center" value={aboutData.firstName} onChange={(e) => setAbout({...aboutData, firstName: e.target.value})} />
									</div>
									<div className="flex justify-center gap-6 mr-[15%]">
										<div className="text-lg text-blue-200 font-medium">Company Name</div>
										<input type="text" className="bg-[#383B59] p-2 w-48 h-8 text-blue-100 text-center" value={aboutData.companyName} onChange={(e) => setAbout({...aboutData, companyName: e.target.value})} />
									</div>
								</div>
								<div className="flex w-full justify-between">
									<div className="flex justify-center gap-6 ml-[15%]">
										<div className="text-lg text-blue-200 font-medium">Last Name</div>
										<input type="text" className="bg-[#383B59] p-2 w-48 h-8 text-blue-100 text-center" value={aboutData.lastName} onChange={(e) => setAbout({...aboutData, lastName: e.target.value})} />
									</div>
									<div className="flex justify-center gap-6 mr-[15%]">
										<div className="text-lg text-blue-200 font-medium">Job Title</div>
										<input type="text" className="bg-[#383B59] p-2 w-48 h-8 text-blue-100 text-center" value={aboutData.jobTitle} onChange={(e) => setAbout({...aboutData, jobTitle: e.target.value})} />
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-3 mt-3 text-center items-center">
								<div className="text-xl text-blue-200 font-medium">Explain your company in detail</div>
								<textarea value={aboutData.companyDetails} className='text-xl p-2 w-2/3 h-32 resize-none text-[#f1f5f9] bg-[#383B59] rounded-lg focus:outline-none text-center' onChange={e => setAbout({...aboutData, companyDetails: e.target.value})}/>
								<div className="text-xl text-blue-200 font-medium">What value does your company (or you as an individual) bring to the table?</div>
								<textarea value={aboutData.companyValue} className='text-xl p-2 w-2/3 h-32 resize-none text-[#f1f5f9] bg-[#383B59] rounded-lg focus:outline-none text-center' onChange={e => setAbout({...aboutData, companyValue: e.target.value})}/>
								<div className="text-xl text-blue-200 font-medium">List out special offers or campaign offerings that you are running currently:</div>
								<textarea value={aboutData.specialOffers} className='text-xl p-2 w-2/3 h-32 resize-none text-[#f1f5f9] bg-[#383B59] rounded-lg focus:outline-none text-center' onChange={e => setAbout({...aboutData, specialOffers: e.target.value})}/>
							</div>
							
						</div>

						<div className='self-center BTN p-3 text-2xl text-indigo-200 rounded-2xl font-semibold cursor-pointer select-none w-50 text-center mt-2 mb-5' onClick={saveAbout}>
							SAVE
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default AboutPage;