import { MessageType, ResponseData } from "@/@types/Response";
import importImg from '@/public/import.png';
import Image from 'next/image';
import { useRef, useState } from "react";

const LeadMenu = (props: { fileUpload: (t: EventTarget & HTMLInputElement) => void, leadData: (ResponseData[] | null) }) => {
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
									<input type="file" className="hidden" ref={fileInput} onChange={(e) => props.fileUpload(e.target)} />
								</div>
							:
								<div className="flex flex-wrap gap-5 self-center mt-32">
									<div className="w-72 h-60 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl self-center cursor-pointer flex flex-col justify-end borderTransition bgTransition hover:border-[#586FD1] hover:bg-[#303450]">
										<div className="mb-3 ml-3 w-64">
											<div className="text-2xl text-blue-100 font-medium">Linkedin Invite</div>
											<div className="text-base text-blue-200">Craft a custom linkedin invite for each lead</div>
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