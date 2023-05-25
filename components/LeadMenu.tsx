import { MessageType, ResponseData } from "@/@types/Response";
import penImg from '@/public/square-pen-solid.svg';
import copyImg from '@/public/copy-solid.svg';
import Image from 'next/image';
import { useEffect, useState } from "react";
import EditModal from '@/components/EditModal';
import InputMenu from "./InputMenu";

const LeadMenu = (props: { processLeads: (inp: {type: number, val: string, f: File | null}, messageType: MessageType[], p: any) => void, leadData: (ResponseData[] | null), status: string }) => {
	const [input, setInput] = useState<{type: number, val: string, f: File | null} | null>(null);
	const [prompts, setPrompts] = useState<any>(null);
	const [selected, setSelected] = useState<MessageType[]>([]);

	const [modalDisplay, setModalDisplay] = useState({
		display: false,
		type: '',
		message: '',
		customTitle: ''
	});

	const processInput = (type: number, val: string, f: File | null) => setInput({type,val,f});

	useEffect(() => {
		const localPrompts = localStorage.getItem('prompts');
		const initPrompts = {
			'Linkedin invite': 'Make a brief 200 word linkedin invite message for this potential customer. Make sure this message is personalized for the customer and include light bits of humor.',
			'Intro Email': 'Make a brief 200 word introduction email for this potential customer. Make sure this message is personalized for the customer and include light bits of humor.',
			'Coffee Chat': 'List out 5 coffee chat questions you can have with this person. Make the questions personalized and add light bits of humor.',
			'Custom Prompt': {
				title: 'Custom Prompt',
				prompt: 'Say "You have not made a custom prompt in the editor yet!"'
			}
		}
		if((!localPrompts) || (localStorage.getItem('u-key') !== process.env.NEXT_PUBLIC_UPDATEKEY)) {
			localStorage.setItem('prompts', JSON.stringify(initPrompts));
			localStorage.setItem('u-key', JSON.stringify(process.env.NEXT_PUBLIC_UPDATEKEY));
			setPrompts(initPrompts);
		} else if(!JSON.parse(localPrompts)['Custom Prompt'].title) {
			const newPrompts = JSON.parse(localPrompts);
			newPrompts['Custom Prompt'] = {title: 'Custom Prompt', prompt: newPrompts['Custom Prompt']};
			localStorage.setItem('prompts', JSON.stringify(newPrompts));
			setPrompts(newPrompts);
		} else if(!prompts) setPrompts(JSON.parse(localPrompts));
	}, []);

	const savePrompt = (newPrompt: string, newTitle: string) => {
		const type = modalDisplay.type;
		setModalDisplay({ display: false, type: '', message: '', customTitle: '' });
		const currPrompts = prompts;
		if(type === 'Custom Prompt') currPrompts[type] = {title: newTitle, prompt: newPrompt};
		else currPrompts[type] = newPrompt;
		localStorage.setItem('prompts', JSON.stringify(currPrompts));
		setPrompts(currPrompts);
	}

	return (
		<>
			<EditModal display={modalDisplay.display} type={modalDisplay.type} message={modalDisplay.message} customTitle={modalDisplay.customTitle} hideDisplay={() => setModalDisplay({display: false, type: '', message: '', customTitle: ''})} savePrompt={savePrompt} />
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
							<div className="leads-options flex flex-wrap gap-10 mt-5 ml-20 mb-8">
								{props.leadData.map((res: any, ind: any) => (
									<div className="leads-option w-96 max-w-96 h-72 max-h-72 bg-[#2C2F48] flex justify-start p-5 rounded-xl flex-col" key={`option-${ind}`}>
										
										<div className="mt-4 flex justify-between">
											<div className="text-blue-200 text-2xl overflowbreak">{res.type} for {res.name}</div>
											<Image src={copyImg} className="w-5 h-5  mt-1 cursor-pointer" alt="copy icon" onClick={() => navigator.clipboard.writeText(res.res)} />
											{/* <div className="text-blue-200 text-lg">Copy</div> */}
										</div>
										<div className="text-blue-100 text-sm overflow-y-auto mt-2">
											{res.res.split('\n').map((str: any, i: any) => <p key={i}>{str}</p>)}
										</div>
									</div>
								))}
							</div>
						:
							<>
								{(input === null) ? 
										<InputMenu processInput={processInput} />
									:
										<>
										<div className="flex flex-col gap-16 self-center mt-24">
											<div className="flex gap-32 self-center">
												<div className={`w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl cursor-pointer borderTransition bgTransition flex flex-col hover:border-[#586FD1] hover:bg-[#303450] ${(selected.includes('Linkedin invite')) ? 'selected' : ''}`} onClick={() => { (selected.includes('Linkedin invite')) ? setSelected(selected.filter(i => i !== 'Linkedin invite')) : setSelected([...selected, 'Linkedin invite']) }}>
													<Image src={penImg} alt="pencil" className="w-8 h-8 relative self-end mr-5 mt-5" onClick={(e) => { e.stopPropagation(); setModalDisplay({display: true, type: 'Linkedin invite', message: prompts['Linkedin invite'], customTitle: ''}) }} />
													<div className="flex flex-col justify-end w-full h-full">
														<div className="mb-5 ml-5 w-5/6">
															<div className="text-2xl text-blue-100 font-medium">Linkedin Invite</div>
															<div className="text-base text-blue-200">Craft a custom linkedin invite for each lead</div>
														</div>
													</div>
												</div>
												<div className={`w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl cursor-pointer borderTransition bgTransition flex flex-col hover:border-[#586FD1] hover:bg-[#303450] ${(selected.includes('Intro Email')) ? 'selected' : ''}`} onClick={() => { (selected.includes('Intro Email')) ? setSelected(selected.filter(i => i !== 'Intro Email')) : setSelected([...selected, 'Intro Email']) }}>
													<Image src={penImg} alt="pencil" className="w-8 h-8 relative self-end mr-5 mt-5" onClick={(e) => { e.stopPropagation(); setModalDisplay({display: true, type: 'Intro Email', message: prompts['Intro Email'], customTitle: ''}) }} />
													<div className="flex flex-col justify-end w-full h-full">
														<div className="mb-5 ml-5 w-5/6">
															<div className="text-2xl text-blue-100 font-medium">Introduction Email</div>
															<div className="text-base text-blue-200">Write a custom introduction email for each lead</div>
														</div>
													</div>
												</div>
											</div>	
											<div className="flex gap-32 self-center">
												<div className={`w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl cursor-pointer borderTransition bgTransition flex flex-col hover:border-[#586FD1] hover:bg-[#303450] ${(selected.includes('Coffee Chat')) ? 'selected' : ''}`} onClick={() => { (selected.includes('Coffee Chat')) ? setSelected(selected.filter(i => i !== 'Coffee Chat')) : setSelected([...selected, 'Coffee Chat']) }}>
													<Image src={penImg} alt="pencil" className="w-8 h-8 relative self-end mr-5 mt-5" onClick={(e) => { e.stopPropagation(); setModalDisplay({display: true, type: 'Coffee Chat', message: prompts['Coffee Chat'], customTitle: ''}) }} />
													<div className="flex flex-col justify-end w-full h-full">
														<div className="mb-5 ml-5 w-5/6">
															<div className="text-2xl text-blue-100 font-medium">Coffee Chat Questions</div>
															<div className="text-base text-blue-200">Write personalized coffee chat questions for each lead</div>
														</div>
													</div>
												</div>
												<div className={`w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl cursor-pointer borderTransition bgTransition flex flex-col hover:border-[#586FD1] hover:bg-[#303450] ${(selected.includes('Custom Prompt')) ? 'selected' : ''}`} onClick={() => { (selected.includes('Custom Prompt')) ? setSelected(selected.filter(i => i !== 'Custom Prompt')) : setSelected([...selected, 'Custom Prompt']) }}>
													<Image src={penImg} alt="pencil" className="w-8 h-8 relative self-end mr-5 mt-5" onClick={(e) => { e.stopPropagation(); setModalDisplay({display: true, type: 'Custom Prompt', message: prompts['Custom Prompt'].prompt, customTitle: prompts['Custom Prompt'].title}); console.log(prompts['Custom Prompt'].title); }} />
													<div className="flex flex-col justify-end w-full h-full">
														<div className="mb-5 ml-5 w-5/6">
															<div className="text-2xl text-blue-100 font-medium">{prompts['Custom Prompt'].title}</div>
															<div className="text-base text-blue-200">Create your own custom prompt</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className='self-center BTN p-3 text-2xl text-indigo-200 rounded-3xl font-semibold cursor-pointer select-none w-50 text-center mt-5 mb-5' onClick={() => props.processLeads(input, selected, prompts)}>
											SUBMIT
										</div>
										</>
								}
							</>
						}
					</>
			}
		</>
	)
}

export default LeadMenu