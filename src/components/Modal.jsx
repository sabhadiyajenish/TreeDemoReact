// Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, onConfirm, type }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          {type === "member"
            ? "Add New Branch Member"
            : "Add New Subordinate Branch"}
        </h2>
        <button
          onClick={handleConfirm}
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mb-2"
        >
          Confirm
        </button>
        <button
          onClick={onClose}
          className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
