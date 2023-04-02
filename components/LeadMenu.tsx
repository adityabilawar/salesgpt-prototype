import { MessageType, ResponseData } from "@/@types/Response";
import importImg from '@/public/import.png';
import Image from 'next/image';
import { useRef, useState } from "react";

const LeadMenu = (props: { fileUpload: (t: EventTarget & HTMLInputElement, messageType: MessageType) => void, leadData: (ResponseData[] | null) }) => {
	const fileInput = useRef<HTMLInputElement>(null);
	const [messageType, setMessageType] = useState<MessageType | null>(null)

	return (
		<>
			{(props.leadData !== null) ? 
					<div className="leads-options flex flex-wrap gap-10 mt-10 ml-20">
						{props.leadData.map((res: any, ind: any) => (
							<div className="leads-option w-96 max-w-96 h-72 max-h-72 bg-[#2C2F48] flex justify-center p-5 rounded-xl flex-col" key={`option-${ind}`}>
								
								<div className="text-blue-200 text-2xl">{res.type} for {res.name}</div>
								<div className="text-blue-100 text-sm overflow-y-scroll">
									{res.res.split('\n').map((str: any, i: any) => <p key={i}>{str}</p>)}
								</div>
							</div>
						))}
					</div>
				:
					<>
						{(messageType !== null) ? 
								<div 
									className="leads-import w-96 h-72 border-[1px] border-solid border-[#6E5ED4] bg-[#2C2F48] self-center mt-24 rounded-3xl flex flex-col justify-center items-center gap-5 cursor-pointer"
									onClick={() => (fileInput.current) ? fileInput.current.click() : console.log('invalid ref')}
								>
									<Image src={importImg} className="w-32 h-32" alt="import icon" />
									<div className="import-title text-2xl text-blue-100 font-medium">Import a .XLSX file (Excel)</div>
									<input type="file" className="hidden" ref={fileInput} onChange={(e) => props.fileUpload(e.target, messageType)} />
								</div>
							:
								<div className="flex flex-col gap-16 self-center mt-24">
									<div className="flex gap-32 self-center">
										<div className="w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl cursor-pointer flex flex-col justify-end borderTransition bgTransition hover:border-[#586FD1] hover:bg-[#303450]" onClick={() => setMessageType('Linkedin invite')}>
											<div className="mb-5 ml-5 w-5/6">
												<div className="text-2xl text-blue-100 font-medium">Linkedin Invite</div>
												<div className="text-base text-blue-200">Craft a custom linkedin invite for each lead</div>
											</div>
										</div>
										<div className="w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl cursor-pointer flex flex-col justify-end borderTransition bgTransition hover:border-[#586FD1] hover:bg-[#303450]" onClick={() => setMessageType('Intro Email')}>
											<div className="mb-5 ml-5 w-5/6">
												<div className="text-2xl text-blue-100 font-medium">Introduction Email</div>
												<div className="text-base text-blue-200">Write a custom introduction email for each lead</div>
											</div>
										</div>
									</div>
									<div className="flex gap-32 self-center">
										<div className="w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl self-center cursor-pointer flex flex-col justify-end borderTransition bgTransition hover:border-[#586FD1] hover:bg-[#303450]" onClick={() => setMessageType('Coffee Chat')}>
											<div className="mb-5 ml-5">
												<div className="text-2xl text-blue-100 font-medium">Coffee Chat Questions</div>
												<div className="text-base text-blue-200 w-5/6">Write personalized coffee chat questions for each lead</div>
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
	)
}

export default LeadMenu