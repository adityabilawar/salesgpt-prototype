import axios from 'axios';
import { useEffect, useState } from 'react';
import importImg from '@/public/import.png';
import addImg from '@/public/circle-plus-solid.svg';
import settingsImg from '@/public/gear-solid.svg';
import Image from 'next/image';
import graphic from '@/public/graphic.png';
import { useRouter } from 'next/router';
import { MessageType, ResponseData } from '@/@types/Response';
import LeadMenu from '@/components/LeadMenu';
import InputMenu from '@/components/InputMenu';

const LeadsPage = () => {
	const [leadData, setLeadData] = useState<ResponseData[] | null>(null);
	const [about, setAbout] = useState<About | null>(null);
	const [status, setStatus] = useState('No leads');
	const [inpmode, addInput] = useState(false);
	const [leadSettings, setLeadSettings] = useState<{ messageType: MessageType[], prompts: any }>({messageType: ['Linkedin invite'], prompts: {}});

	const processLeads = (input: {type: number, val: string, f: File | null}, messageType: MessageType[], prompts: any) => {
		const authStorage = localStorage.getItem('auth');
		if(!authStorage) {
			router.push('/login');
			return;
		}
		const name = JSON.parse(authStorage).user;
		if((input.type === 3) && (input.f !== null)) {
			const file = input.f;
			console.log(file.type);

			if(file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') window.location.reload();

			const formData = new FormData();
			formData.append('file', file);
			formData.append('name', name);
			formData.append('type', JSON.stringify(messageType));
			formData.append('prompts', JSON.stringify(prompts));
			formData.append('storage', JSON.stringify(authStorage));
			formData.append('about', JSON.stringify(about));
			axios.post('/api/file', formData)
				.then(res => {
					console.log(res.data);
					setLeadData(res.data);
					setStatus('Complete');
				})
				.catch(err => {
					console.log(err);
					setStatus('Error while Uploading');
				});
			setStatus('Loading...');
		} else if (input.type !== 3) {
			axios.post('/api/input', {
				input: input.val,
				type: messageType,
				prompts,
				auth: JSON.parse(authStorage),
				name,
				about
				}).then(res => {
					console.log(res.data);
					setLeadData(res.data);
					setStatus('Complete');
				}).catch(err => {
					console.log(err);
					setStatus('Error while Uploading');
				});
			setStatus('Loading...');
		}
		setLeadSettings({messageType,prompts});
	}

	const processInput = (type: number, val: string, f: File | null) => {
		const authStorage = localStorage.getItem('auth');
		if(!authStorage) {
			router.push('/login');
			return;
		}
		const name = JSON.parse(authStorage).user;
		if((type === 3) && (f !== null)) {
			const file = f;
			console.log(file.type);

			if(file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') window.location.reload();

			const formData = new FormData();
			formData.append('file', file);
			formData.append('name', name);
			formData.append('type', JSON.stringify(leadSettings.messageType));
			formData.append('prompts', JSON.stringify(leadSettings.prompts));
			formData.append('storage', JSON.stringify(authStorage));
			formData.append('about', JSON.stringify(about));
			axios.post('/api/file', formData)
				.then(res => {
					console.log(res.data);
					if(leadData) setLeadData([...res.data, ...leadData]);
					else setLeadData(res.data);
					setStatus('Complete');
				})
				.catch(err => {
					console.log(err);
					setStatus('Error while Uploading');
				});
			setStatus('Loading...');
		} else if (type !== 3) {
			axios.post('/api/input', {
				input: val,
				type: leadSettings.messageType,
				prompts: leadSettings.prompts,
				auth: JSON.parse(authStorage),
				name,
				about
				}).then(res => {
					console.log(res.data);
					if(leadData) setLeadData([...res.data, ...leadData]);
					else setLeadData(res.data);
					setStatus('Complete');
				}).catch(err => {
					console.log(err);
					setStatus('Error while Uploading');
				});
			setStatus('Loading...');
		}
		addInput(false);
	}

	const router = useRouter();
	useEffect(() => {
		const authStorage = localStorage.getItem('auth');
		if(!authStorage) {
			router.push('/login');
			return;
		}

		const auth = JSON.parse(authStorage);
		axios.post('/api/login', {user: auth.user, pass: auth.pass}).catch(err => router.push('/login'));

		const aboutStorage = localStorage.getItem('about');
		if(!aboutStorage) {
			router.push('/about');
			return;
		}
		setAbout(JSON.parse(aboutStorage));
	}, []);

	return (
		<>
			<div className="leads-main flex w-full h-full">
				<div className="absolute w-full h-20">
					<div className="flex w-full h-full justify-end items-center">
						<Image src={settingsImg} className="w-10 h-10 mr-10 cursor-pointer" alt="settings icon" onClick={() => router.push('/about')} />
					</div>
				</div>
				{(inpmode) && 
				<div className="relative z-10" aria-labelledby="edit-modal" role="dialog" aria-modal="true" onClick={() => addInput(false)}>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
					<div className="fixed min-h-full inset-0 z-10 overflow-y-auto">
						<div className="flex justify-center p-4 sm:items-center sm:p-0 h-full w-full">
							{/* <div className="max-w-7xl"> */}
								<InputMenu processInput={processInput} widget />
							{/* </div> */}
						</div>
					</div>
				</div>
				}
				<div className={`leads-sidebar w-1/5 h-full min-h-full bg-[#2C2F48] flex flex-col justify-start ${(leadData === null) ? "gap-80" : "gap-5"}`}>
					<div className="flex self-center items-center justify-center">
						<div className="leads-title text-4xl font-semibold text-blue-200 mt-10 self-center">
							Leads
						</div>
						{(leadData !== null) &&
							<div className="self-center align-middle">
								<Image src={addImg} className="w-8 h-8 mt-9 ml-3 cursor-pointer" alt="add icon" onClick={() => addInput(true)} />
							</div>
						}
					</div>
					
					{(leadData !== null)
						? 
							<div className="overflow-y-auto w-full">
								<table className="leads-list table-auto border-collapse border-t-2 border-solid border-[#1D203E] w-full self-center overflow-y-scroll">
									<tbody>
										{leadData.map((res: any, ind: any) => (
											<tr className="lead-listing cursor-pointer hover:bg-[#393D5D] select-none" key={ind}>
												<td className="lead-listing-name text-xl text-blue-100 align-middle p-2 pl-5 overflow-scroll" key={`name-${ind}`}>
													{res.name}
												</td>
												<td className="lead-listing-info flex flex-col align-middle p-2" key={`info-${ind}`}>
													<div className="lead-listing-position text-lg text-blue-100" key={`pos-${ind}`}>{res.position}</div>
													<div className="lead-listing-company text-lg text-blue-100" key={`company-${ind}`}>{res.company}</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						:	
							<div className="leads-list flex flex-col items-center cursor-pointer select-none self-center">
								<Image src={importImg} className="w-20 h-20" alt="import icon" />
								<div className="text-blue-100 text-2xl">
									{status}
								</div>
							</div>
					}
					
				</div>
				<div className="leads-sec w-4/5 h-full flex flex-col overflow-y-auto">
					{(status !== 'Complete') ?
						<div style={{backgroundImage: `url(${graphic.src})`}} className="leads-banner w-3/5 h-56 shrink-0 mt-5 rounded-2xl self-center border-2 border-solid border-[#586FD1] flex items-center justify-center">
							<div className="banner-title text-2xl text-blue-200">
								Create your personalized message
							</div>
						</div>
						:
						<div className="ml-24 mt-10 text-3xl text-indigo-300">
							Results
						</div>
					}
					<LeadMenu processLeads={processLeads} leadData={leadData} status={status} />
				</div>
			</div>
		</>
	)
}

export default LeadsPage;