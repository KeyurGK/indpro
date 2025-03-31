import React from "react";

const SearchModal = ({ isOpen, onClose, searchQuery, setSearchQuery }) => {
    if (!isOpen) return null;


    return (
        <div className="absolute top-16 right-10 bg-white p-4 rounded-lg shadow-lg w-72">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Task" className="w-full p-2 border rounded-md" />
          <button onClick={onClose} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 w-full">Close</button>
        </div>
      )}
    
    

export default SearchModal;