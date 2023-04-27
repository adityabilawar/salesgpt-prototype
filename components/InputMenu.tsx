import { useRef, useState } from "react";
import importImg from '@/public/import.png';
import Image from 'next/image';

const InputMenu = (props: { processInput: (type: number, val: string, f: File | null) => void }) => {

	const [tab, setTab] = useState(1);
	const [inputVal, setInputVal] = useState('');
	const fileInput = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);

	const fileUpload = (target: EventTarget & HTMLInputElement) => {
		if(target.files === null) return;
		setFile(target.files[0]);
	}

	const importInput = () => props.processInput(tab, inputVal, file);

	return (
		<>
			<div className="w-2/3 h-3/5 shrink-0 mt-5 rounded-2xl self-center border-2 bg-[#2C2F48] border-solid border-[#586FD1] flex-col overflow-hidden">
				{/* <table className="table-fixed h-14 w-full text-center text-xl text-blue-100">
					<thead> */}
					<div className="w-full h-14 flex text-center text-xl text-blue-100 font-medium">
						<div className={`${(tab == 1) ? 'bg-[#383B59]' : ''} w-1/3 h-14 hover:bg-[#383B59] flex items-center justify-center cursor-pointer`} onClick={() => setTab(1)}>
							Linkedin URLs
						</div>
						<div className={`${(tab == 2) ? 'bg-[#383B59]' : ''} w-1/3 h-14 hover:bg-[#383B59] flex items-center justify-center cursor-pointer`} onClick={() => setTab(2)}>
							Social Links
						</div>
						<div className={`${(tab == 3) ? 'bg-[#383B59]' : ''} w-1/3 h-14 hover:bg-[#383B59] flex items-center justify-center cursor-pointer`} onClick={() => setTab(3)}>
							Import File
						</div>
					</div>
					{/* </thead>
				</table> */}
				<div className="bg-[#383B59] w-full h-1" />

				{(tab == 3) ?
					<div className="flex-col h-5/6 w-full">
						<div className="ml-5 mt-5 text-lg text-blue-200">
							Upload file here:
						</div>
						<div className="flex w-full h-2/3 justify-center items-center cursor-pointer" onClick={() => (fileInput.current) ? fileInput.current.click() : console.log('invalid ref')}>
							<Image src={importImg} className="w-40 h-40" alt="import icon" />
						</div>
						<div className="ml-10 mt-5 w-36 h-10 bg-[#383B59] text-blue-200 text-lg font-medium rounded-md flex justify-center items-center cursor-pointer" onClick={importInput}>Import</div>
						<input type="file" className="hidden" ref={fileInput} onChange={(e) => fileUpload(e.target)} />
					</div>
					:
					<div className="flex-col w-full h-5/6">
						<div className="ml-5 mt-5 text-lg text-blue-200">
							Paste URLs here:
						</div>
						<div className="ml-10 mt-5 w-full h-full">
							<textarea className="resize-none w-5/6 h-2/3 bg-[#383B59] text-blue-100 rounded-md focus:outline-none p-4 text-lg" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
							<div className="mt-5 w-36 h-10 bg-[#383B59] text-blue-200 text-lg font-medium rounded-md flex justify-center items-center cursor-pointer" onClick={importInput}>Import</div>
						</div>
					</div>
				}
			</div>
		</>
	)
}

export default InputMenu;