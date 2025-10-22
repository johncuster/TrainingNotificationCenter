import React from "react";
import ReactDOM from "react-dom";

export default function CreateTrainingPopup({ onClose }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-start pt-10">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create Training
        </h2>

        {/* Form */}
        <form className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Assigned Team</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 mt-1 focus:ring focus:ring-blue-200"
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Training Title</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 mt-1 focus:ring focus:ring-blue-200"
              placeholder="Enter training title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Due Date</label>
            <input
              type="date"
              className="w-full border rounded-md p-2 mt-1 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select className="w-full border rounded-md p-2 mt-1">
              <option value="Pending">Pending</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body // 👈 this renders the popup *on top of everything*
  );
}
