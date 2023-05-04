import { useEffect, useState } from "react";

const EditModal = (props: { display: boolean, type: string, message: string, customTitle: string, hideDisplay: () => void, savePrompt: (p: string, t: string) => void }) => {

	const [promptInput, setPromptInput] = useState(props.message);
	const [titleInput, setTitleInput] = useState(props.customTitle);
	
	useEffect(() => {
		if(props.display) setPromptInput(props.message);
	}, [props.display]);

	useEffect(() => {
		setTitleInput(props.customTitle);
	}, [props.customTitle]);
	
	if(!props.display) {
		return <></>;
	}

	return (
		<div className="relative z-10" aria-labelledby="edit-modal" role="dialog" aria-modal="true">
			<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
			<div className="fixed inset-0 z-10 overflow-y-auto">
				<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<div className="relative transform overflow-hidden rounded-lg bg-slate-800sl text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
						<div className="bg-slate-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4 w-full h-full">
							<div className="sm:flex sm:items-start w-full h-full">
								<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full h-full">
									<h3 className="text-xl font-semibold leading-6 text-slate-200" id="modal-title">Edit {props.type}</h3>
									<div className="mt-2 w-full h-full">
										{/* <p className="text-base text-slate-400">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p> */}

										{(props.customTitle !== '') && 
											<input
												type='text' 
												placeholder="New prompt"
												value={titleInput}
												className='text-xl p-2 w-11/12 resize-none text-[#f1f5f9] bg-slate-600 rounded-lg focus:outline-none mb-2'
												onChange={e => setTitleInput(e.target.value)}
											/>
										}
										<textarea 
											placeholder="New prompt"
											value={promptInput}
											className='text-xl p-2 w-11/12 h-64 resize-none text-[#f1f5f9] bg-slate-600 rounded-lg focus:outline-none'
											onChange={e => setPromptInput(e.target.value)}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-slate-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							<button type="button" className="inline-flex w-full justify-center rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 sm:ml-3 sm:w-auto" onClick={() => props.savePrompt(promptInput, titleInput)}>Save</button>
							<button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={props.hideDisplay}>Cancel</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EditModal;