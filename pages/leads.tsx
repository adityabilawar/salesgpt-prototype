import axios from 'axios';
import { useEffect, useState } from 'react';
import importImg from '@/public/import.png';
import Image from 'next/image';
import graphic from '@/public/graphic.png';
import { useRouter } from 'next/router';
import { MessageType, ResponseData } from '@/@types/Response';
import LeadMenu from '@/components/LeadMenu';

const LeadsPage = () => {
	const [leadData, setLeadData] = useState<ResponseData[] | null>(null);
	const [status, setStatus] = useState('No leads');

	const processLeads = (file: File, messageType: MessageType, prompts: any) => {
		console.log(file.type)
		if(file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') window.location.reload();

		const formData = new FormData();
		formData.append('file', file);
		const name = localStorage.getItem('fullName') ? localStorage.getItem('fullName') as string : '';
		formData.append('name', name);
		formData.append('type', messageType);
		formData.append('prompts', JSON.stringify(prompts));
		axios.post('/api/file', formData)
			.then(res => {
				setLeadData(res.data);
				setStatus('Complete');
			})
			.catch(err => {
				console.log(err);
				setStatus('Error while Uploading');
			});
		setStatus('Loading...');
	}

	const router = useRouter();
	useEffect(() => {
		if(localStorage.getItem('auth') !== 'true') router.push('/login');
	});

	return (
		<>
			<div className="leads-main flex w-full h-full">
				<div className={`leads-sidebar w-1/5 h-full min-h-full bg-[#2C2F48] flex flex-col justify-start ${(leadData === null) ? "gap-80" : "gap-5"}`}>
					<div className="leads-title text-4xl font-semibold text-blue-200 mt-10 self-center">
						Leads
					</div>
					{(leadData !== null)
						? 
							<div className="overflow-y-auto w-full">
								<table className="leads-list table-auto border-collapse border-t-2 border-solid border-[#1D203E] w-full self-center overflow-y-scroll">
									<tbody>
										{leadData.map((res: any, ind: any) => (
											<tr className="lead-listing cursor-pointer hover:bg-[#393D5D] select-none" key={ind}>
												<td className="lead-listing-name text-xl text-blue-100 align-middle p-2 pl-5" key={`name-${ind}`}>
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
					<div style={{backgroundImage: `url(${graphic.src})`}} className="leads-banner w-3/5 h-48 shrink-0 mt-5 rounded-2xl bg-center bg-no-repeat self-center border-2 border-solid border-[#586FD1] flex items-center justify-center">
						<div className="banner-title text-2xl text-blue-200">
							Create your personalized message
						</div>
					</div>
					<LeadMenu processLeads={processLeads} leadData={leadData} status={status} />
				</div>
			</div>
		</>
	)
}

export default LeadsPage;