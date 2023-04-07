import { MessageType, ResponseData } from "@/@types/Response";
import importImg from '@/public/import.png';
import penImg from '@/public/square-pen-solid.svg';
import Image from 'next/image';
import { useRef, useState } from "react";
import EditModal from '@/components/EditModal';

const LeadMenu = (props: { processLeads: (f: File, messageType: MessageType) => void, leadData: (ResponseData[] | null), status: string }) => {
	const fileInput = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);

	const [modalDisplay, setModalDisplay] = useState({
		display: false,
		type: '',
		message: ''
	});

	const fileUpload = (target: EventTarget & HTMLInputElement) => {
		if(target.files === null) return;
		setFile(target.files[0]);
	}

	return (
		<>
			<EditModal display={modalDisplay.display} type={modalDisplay.type} message={modalDisplay.message} />
			{(props.status === 'Loading...') ? 
				<div className="self-center mt-64">
					<svg className="animate-spin h-24 w-24 text-white" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
				</div>
				:
				<>
					{(props.leadData !== null) ? 
							<div className="leads-options flex flex-wrap gap-10 mt-10 ml-20 mb-8">
								{props.leadData.map((res: any, ind: any) => (
									<div className="leads-option w-96 max-w-96 h-72 max-h-72 bg-[#2C2F48] flex justify-start p-5 rounded-xl flex-col" key={`option-${ind}`}>
										
										<div className="text-blue-200 text-2xl mt-4">{res.type} for {res.name}</div>
										<div className="text-blue-100 text-sm overflow-y-auto mt-2">
											{res.res.split('\n').map((str: any, i: any) => <p key={i}>{str}</p>)}
										</div>
									</div>
								))}
							</div>
						:
							<>
								{(file === null) ? 
										<div 
											className="leads-import w-96 h-72 border-[1px] border-solid border-[#6E5ED4] bg-[#2C2F48] self-center mt-24 rounded-3xl flex flex-col justify-center items-center gap-5 cursor-pointer"
											onClick={() => (fileInput.current) ? fileInput.current.click() : console.log('invalid ref')}
										>
											<Image src={importImg} className="w-32 h-32" alt="import icon" />
											<div className="import-title text-2xl text-blue-100 font-medium">Import a .XLSX file (Excel)</div>
											<input type="file" className="hidden" ref={fileInput} onChange={(e) => fileUpload(e.target)} />
										</div>
									:
										<div className="flex flex-col gap-16 self-center mt-24">
											<div className="flex gap-32 self-center">
												<div className="w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl cursor-pointer borderTransition bgTransition flex flex-col hover:border-[#586FD1] hover:bg-[#303450]" onClick={(e) => { e.stopPropagation(); props.processLeads(file, 'Linkedin invite') }}>
													<Image src={penImg} alt="pencil" className="w-8 h-8 fixed self-end mr-5 mt-5" onClick={() => setModalDisplay({display: true, type: 'Linkedin', message: 'Linkedin prompt'})} />
													<div className="flex flex-col justify-end w-full h-full">
														<div className="mb-5 ml-5 w-5/6">
															<div className="text-2xl text-blue-100 font-medium">Linkedin Invite</div>
															<div className="text-base text-blue-200">Craft a custom linkedin invite for each lead</div>
														</div>
													</div>
												</div>
												<div className="w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl cursor-pointer borderTransition bgTransition flex flex-col hover:border-[#586FD1] hover:bg-[#303450]" onClick={(e) => { e.stopPropagation(); props.processLeads(file, 'Intro Email') }}>
													<Image src={penImg} alt="pencil" className="w-8 h-8 fixed self-end mr-5 mt-5" onClick={() => setModalDisplay({display: true, type: 'Email', message: 'Email prompt'})} />
													<div className="flex flex-col justify-end w-full h-full">
														<div className="mb-5 ml-5 w-5/6">
															<div className="text-2xl text-blue-100 font-medium">Introduction Email</div>
															<div className="text-base text-blue-200">Write a custom introduction email for each lead</div>
														</div>
													</div>
												</div>
											</div>	
											<div className="flex gap-32 self-center">
												<div className="w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl cursor-pointer borderTransition bgTransition flex flex-col hover:border-[#586FD1] hover:bg-[#303450]" onClick={() => (!modalDisplay.display) ? props.processLeads(file, 'Coffee Chat') : {}}>
													<Image src={penImg} alt="pencil" className="w-8 h-8 fixed self-end mr-5 mt-5" onClick={() => setModalDisplay({display: true, type: 'Coffee Chat', message: 'Coffee Chat prompt'})} />
													<div className="flex flex-col justify-end w-full h-full">
														<div className="mb-5 ml-5 w-5/6">
															<div className="text-2xl text-blue-100 font-medium">Coffee Chat Questions</div>
															<div className="text-base text-blue-200">Write personalized coffee chat questions for each lead</div>
														</div>
													</div>
												</div>
												<div className="w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl self-center cursor-pointer flex flex-col justify-end borderTransition bgTransition hover:border-[#586FD1] hover:bg-[#303450]">
													<div className="mb-5 ml-5 w-5/6">
														<div className="text-2xl text-blue-100 font-medium">Custom Prompt</div>
														<div className="text-base text-blue-200">Create your own custom prompt</div>
													</div>
												</div>
											</div>
										</div>
								}
							</>
						}
					</>
			}
		</>
	)
}

export default LeadMenu