

const EditModal = (props: { display: boolean }) => {
	if(!props.display) {
		return <></>
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
									<h3 className="text-xl font-semibold leading-6 text-slate-200" id="modal-title">Edit Linkedin Prompt</h3>
									<div className="mt-2 w-full h-full">
										{/* <p className="text-base text-slate-400">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p> */}
										<textarea 
											placeholder="New prompt"
											className='text-xl p-2 w-11/12 h-64 min-h-64 max-h-64 text-[#f1f5f9] bg-slate-600 rounded-lg focus:outline-none'
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-slate-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							<button type="button" className="inline-flex w-full justify-center rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 sm:ml-3 sm:w-auto">Save</button>
							<button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EditModal;