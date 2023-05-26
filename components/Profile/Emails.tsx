import React, { useState } from 'react'

const Emails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [emailContent, setEmailContent] = useState('');

  const handleGenerateEmail = () => {
    setEmailContent('Generated email content goes here');
  };

  return (
    <div>
      {isModalOpen ? (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="text-2xl mb-2">Create New Email</h2>
            <div className="flex flex-col">
              <label htmlFor="purpose">Purpose:</label>
              <input
                type="text"
                className="bg-white"
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />

              <label htmlFor="wordCount">Word Count:</label>
              <input
                type="range"
                id="wordCount"
                min="0"
                max="700"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
              />
              <span>{wordCount} words</span>

              <button className="border-[1px] py-3 my-5" onClick={handleGenerateEmail}>
                Generate
              </button>

              <textarea
                className="text-black p-5"
                value={emailContent}
                readOnly
              />
            </div>
            <button
              className="px-6 py-2 border-[1px] mt-4"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="border-[1px] p-5 flex justify-center items-center">
          <button onClick={() => setIsModalOpen(true)}>Create new email</button>
        </div>
      )}
    </div>
  )
}

export default Emails
