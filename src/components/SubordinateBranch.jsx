import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import BranchMember from "./BranchMember";
import Modal from "./Modal";
import { formatPosition } from "../utils/formatPosition";
import { TreeNode } from "react-organizational-chart";
import { Menu, Transition } from "@headlessui/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  addSubSubordinate,
  deleteBranch,
  deleteThisBranch,
} from "../store/Auth/auth.slice";

// Utility function to group items into columns
const groupItemsIntoColumns = (items, groupSize) => {
  const result = [];
  for (let i = 0; i < items.length; i += groupSize) {
    result.push(items.slice(i, i + groupSize));
  }
  return result;
};

const SubordinateBranch = ({ data, depth, allData }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  // Function to find children nodes recursively
  const findSubordinates = (id) => {
    const findNode = (nodes) => {
      if (!Array.isArray(nodes)) {
        console.error("Expected an array of nodes but got:", nodes);
        return [];
      }

      for (const node of nodes) {
        if (node.id === id) {
          return Array.isArray(node.children) ? node.children : [];
        }
        const childResult = findNode(node.children || []);
        if (childResult.length > 0) return childResult;
      }
      return [];
    };

    return findNode(allData); // Ensure allData is defined and valid
  };

  const subordinates = findSubordinates(data.id);

  const addSubordinateHandler = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleAddSubordinate = (type) => {
    console.log(">>>>subordinate", subordinates, data.position);
    const abc = subordinates?.filter((dt) => dt.type === type);
    const newSubordinate = {
      id: Date.now(),
      type: type,
      position: `${data.position}/${abc.length + 1}`,
      children: [],
    };

    const payload = { parentId: data.id, newSubordinate };

    console.log("Dispatching payload:", payload);

    dispatch(addSubSubordinate(payload));
    setIsModalOpen(false);
  };

  const handleDeleteBranch = () => {
    dispatch(deleteBranch(data.id));
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const handleDeleteSubordinate = () => {
    const payload = { idToRemove: data.id, parentId: null };
    dispatch(deleteThisBranch(payload));
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
            onClick={() => handleAddSubordinate("member")}
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
                      onClick={() => handleAddSubordinate("subordinate")}
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
                      onClick={handleDeleteSubordinate}
                    >
                      Delete This only
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      {/* <TreeNode
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
      /> */}
      <div className="flex gap-10">
        {/* Render member groups */}
        <TreeNode
          className=" flex"
          label={groupItemsIntoColumns(
            subordinates.filter((subordinate) => subordinate.type === "member"),
            3
          ).map((group, groupIndex) => (
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
                      allData={allData}
                    />
                  ))}
                </div>
              }
            />
          ))}
        />

        {/* Render subordinate branches */}
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
                    allData={allData}
                  />
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SubordinateBranch);
