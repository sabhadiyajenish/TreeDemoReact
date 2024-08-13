import React, { useState } from "react";
import BranchMember from "./BranchMember";
import Modal from "./Modal.jsx";
import { formatPosition } from "../utils/formatPosition.jsx";
import { TreeNode } from "react-organizational-chart";

const SubordinateBranch = ({ data, depth }) => {
  const [subordinates, setSubordinates] = useState(data.children || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const addSubordinate = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    const newSubordinate = {
      id: Date.now(),
      type: modalType,
      position: `${data.position}/${subordinates.length + 1}`,
      children: [],
    };
    setSubordinates([...subordinates, newSubordinate]);
    setIsModalOpen(false);
  };

  return (
    <div
      className={`flex flex-nowrap flex-col items-center mt-4 ${
        depth > 1 ? "" : ""
      }`}
    >
      <div className="relative border border-blue-400 ml-6 p-6 w-60 h-fit bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-2">
          {data.type === "member"
            ? `Branch Member ${formatPosition(data.position)}`
            : `Subordinate ${formatPosition(data.position)}`}
        </h2>
        <div className="flex justify-center items-center mt-2">
          <button
            onClick={() => addSubordinate("member")}
            className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
            aria-label="Add New Member"
          >
            +
          </button>
          <button
            onClick={() => addSubordinate("subordinate")}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            aria-label="Add New Subordinate Branch"
          >
            ...
          </button>
        </div>
      </div>
      <div className="flex flex-nowrap mt-4">
        {subordinates.map((subordinate) =>
          subordinate.type === "member" ? (
            <TreeNode
              label={
                <BranchMember
                  key={subordinate.id}
                  data={subordinate}
                  depth={depth + 1}
                />
              }
            ></TreeNode>
          ) : (
            <TreeNode
              label={
                <SubordinateBranch
                  key={subordinate.id}
                  data={subordinate}
                  depth={depth + 1}
                />
              }
            ></TreeNode>
          )
        )}
      </div>

      {/* Modal for adding new member or subordinate */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        type={modalType}
      />
    </div>
  );
};

export default SubordinateBranch;
