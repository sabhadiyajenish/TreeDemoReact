import React, { useState } from "react";
import SubordinateBranch from "./SubordinateBranch";
import Modal from "./Modal";
import { formatPosition } from "../utils/formatPosition";
import { TreeNode } from "react-organizational-chart";

const BranchMember = ({ data, depth }) => {
  const [subordinates, setSubordinates] = useState(data.children || []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addSubordinate = () => {
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    const newSubordinate = {
      id: Date.now(),
      type: "subordinate",
      position: `${data.position}/${subordinates.length + 1}`,
      children: [],
    };
    setSubordinates([...subordinates, newSubordinate]);
    setIsModalOpen(false);
  };

  return (
    <div
      className={`flex flex-nowrap  flex-col items-center mt-4 ${
        depth > 1 ? "" : ""
      }`}
    >
      <div className="relative border border-gray-400 p-6 w-60 h-fit bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-2">
          Branch Member {formatPosition(data.position)}
        </h3>
        <button
          onClick={addSubordinate}
          className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mt-2"
          aria-label="Add New Subordinate"
        >
          +
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 ml-2 focus:outline-none text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>
      {isExpanded && (
        <div className="flex flex-nowrap mt-4">
          {subordinates.map((subordinate) => (
            <TreeNode
              label={
                <SubordinateBranch
                  key={subordinate.id}
                  data={subordinate}
                  depth={depth + 1}
                />
              }
            ></TreeNode>
          ))}
        </div>
      )}

      {/* Modal for adding new subordinate */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        type="subordinate"
      />
    </div>
  );
};

export default BranchMember;
