import { useEffect, useState } from "react";
import { PlusIcon } from '@heroicons/react/solid';
import EditModal from "./EditModal";
import { CustomPrompt } from "@/@types/Prompt";
import penImg from '@/public/square-pen-solid.svg';
import trashImg from '@/public/square-trash.svg';
import Image from 'next/image';

const PromptMenu = (props: { p: any, saveCustomPrompt: (i: number, p: CustomPrompt) => void, deletePrompt: (i: number) => void, selectPrompt: (p: string) => void }) => {
	const [currIndex, setCurrIndex] = useState(-1);
	const [prompts, setPrompts] = useState(props.p['Custom Prompt']);

	useEffect(() => {
		setPrompts(props.p['Custom Prompt']);
	}, [props.p]);

	return (
		<>
			<EditModal display={(currIndex !== -1)} type='Custom Prompt' message={(currIndex !== -1 && currIndex !== prompts.length) ? prompts[currIndex].prompt : ''} customTitle={(currIndex !== -1 && currIndex !== prompts.length) ? prompts[currIndex].title : ''} hideDisplay={() => setCurrIndex(-1)} savePrompt={(p, t) => { props.saveCustomPrompt(currIndex, { title: t, prompt: p }); setCurrIndex(-1); }} />
			<div className="self-center flex flex-wrap w-[72rem] mt-24 gap-16">
				{prompts.map((data: CustomPrompt, i: number) => (
					<div className={`w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl cursor-pointer borderTransition bgTransition flex flex-col hover:border-[#586FD1] hover:bg-[#303450]`} onClick={() => props.selectPrompt(prompts[i])}>
						<Image src={penImg} alt="pencil" className="w-8 h-8 relative self-end mr-5 mt-5" onClick={(e) => { e.stopPropagation(); setCurrIndex(i); }} />
						<Image src={trashImg} alt="trash" className="w-8 h-8 relative self-end mr-5 mt-5" onClick={(e) => { e.stopPropagation(); props.deletePrompt(i); }} />
						<div className="flex flex-col justify-end w-full h-full">
							<div className="mb-5 ml-5 w-5/6">
								<div className="text-2xl text-blue-100 font-medium">{data.title}</div>
							</div>
						</div>
					</div>
				))}
				<div className='w-80 h-64 border-[2px] border-solid border-[#6E5ED4] bg-[#2C2F48] rounded-3xl cursor-pointer borderTransition bgTransition flex flex-col hover:border-[#586FD1] hover:bg-[#303450] items-center' onClick={() => setCurrIndex(prompts.length)}>
					<PlusIcon className='h-48 w-48 text-[#a5b4fc] mt-10' />
					<div className="text-2xl text-indigo-400 font-medium mb-5">Add Custom Prompt</div>
					{/* <div className="flex flex-col justify-end w-full h-full">
						<div className="mb-5 ml-5 w-5/6">
							<div className="text-2xl text-blue-100 font-medium">Linkedin Invite</div>
							<div className="text-base text-blue-200">Craft a custom linkedin invite for each lead</div>
						</div>
					</div> */}
				</div>
			</div>
		</>
	)
}

export default PromptMenu;