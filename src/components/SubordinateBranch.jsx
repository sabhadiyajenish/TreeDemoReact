import React, { Fragment, useEffect, useState } from "react";
import BranchMember from "./BranchMember";
import Modal from "./Modal.jsx";
import { formatPosition } from "../utils/formatPosition.jsx";
import { TreeNode } from "react-organizational-chart";
import { Menu, Transition } from "@headlessui/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";

// Utility function to group items into columns
const groupItemsIntoColumns = (items, groupSize) => {
  const result = [];
  for (let i = 0; i < items.length; i += groupSize) {
    result.push(items.slice(i, i + groupSize));
  }
  return result;
};

const SubordinateBranch = ({ data, depth, onDeleteBranch }) => {
  const [subordinates, setSubordinates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  useEffect(() => {
    if (data.children) {
      setSubordinates(data.children);
    }
  }, [data.children]);
  console.log("this is sub-ordinate", subordinates);

  const addSubordinate = (type) => {
    console.log(">>>>subordinate", subordinates, data.position);
    const abc = subordinates?.filter((dt) => dt.type === type);
    setModalType(type);
    const newSubordinate = {
      id: Date.now(),
      type: type,
      position: `${data.position}/${abc.length + 1}`,
      children: [],
    };
    setSubordinates([...subordinates, newSubordinate]);
    setIsModalOpen(false);
  };
  const removeBranchRecursively = (nodes, idToRemove) => {
    console.log("Starting nodes:", nodes);
    console.log("ID to remove:", idToRemove);

    const filteredNodes = nodes
      .filter((node) => node.id !== idToRemove)
      .map((node) => ({
        ...node,
        children: removeBranchRecursively(node.children, idToRemove),
      }));

    console.log("Filtered nodes:", filteredNodes);
    return filteredNodes;
  };
  const handleDeleteBranch = () => {
    onDeleteBranch(data.id);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  // Calculate the position based on column grouping
  const memberGroups = groupItemsIntoColumns(
    subordinates.filter((subordinate) => subordinate.type === "member"),
    3
  );
  const handleDeleteSubBranchesAndMembers = () => {
    // Remove all subordinates and members but keep the current branch intact
    setSubordinates([]);
  };
  return (
    <div className={`flex flex-col items-center mt-4 ${depth > 1 ? "" : ""}`}>
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
          <Menu as="div" className="relative float-right w-full">
            <Menu.Button>
              <BiDotsHorizontalRounded className="text-[40px] mr-1 cursor-pointer" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute top-[-40px] left-5 right-[-100px] z-50 mt-2 w-80 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? "w-full bg-gray-100" : "",
                        "w-full block md:px-4 px-2 text-center md:py-2 py-1 text-sm text-gray-700"
                      )}
                      onClick={() => addSubordinate("subordinate")}
                    >
                      Add a New Subordinate Branch
                    </button>
                  )}
                </Menu.Item>
                <hr />
                <Menu.Item className="mt-3">
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? "w-full bg-gray-100" : "",
                        "w-full block md:px-4 px-2 text-center md:py-2 py-1 text-sm text-gray-700"
                      )}
                      onClick={handleDeleteBranch}
                    >
                      Delete Branch
                    </button>
                  )}
                </Menu.Item>
                <hr />
                <Menu.Item className="mt-3">
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? "w-full bg-gray-100" : "",
                        "w-full block md:px-4 px-2 text-center md:py-2 py-1 text-sm text-gray-700"
                      )}
                      onClick={handleDeleteSubBranchesAndMembers}
                    >
                      Delete Sub Branches and member
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      <div className="flex gap-10 ">
        {/* Render member groups */}
        <TreeNode
          className=" flex"
          label={memberGroups.map((group, groupIndex) => (
            <TreeNode
              className="mt-4"
              label={
                <div key={groupIndex} className="sub-main">
                  {group.map((subordinate, memberIndex) => (
                    <BranchMember
                      key={subordinate.id}
                      groupIndex={groupIndex}
                      memberIndex={memberIndex}
                      data={subordinate}
                      depth={depth + 1}
                    />
                  ))}
                </div>
              }
            />
          ))}
        />

        {/* Wrapper for non-'member' type subordinates */}
        <div className="flex mt-4 flex-nowrap">
          {subordinates
            .filter((subordinate) => subordinate.type !== "member")
            .map((subordinate) => (
              <TreeNode
                key={subordinate.id}
                label={
                  <SubordinateBranch
                    data={subordinate}
                    depth={depth + 1}
                    onDeleteBranch={onDeleteBranch} // Pass down delete function
                  />
                }
              />
            ))}
        </div>
      </div>

      {/* Modal for adding new member or subordinate */}
      {isModalOpen && (
        <Modal type={modalType} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default React.memo(SubordinateBranch);
