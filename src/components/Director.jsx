import React, { Fragment, useState } from "react";
import SubordinateBranch from "./SubordinateBranch";
import { Tree, TreeNode } from "react-organizational-chart";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Menu, Transition } from "@headlessui/react";

const Director = () => {
  const [subordinates, setSubordinates] = useState([]);
  console.log("this is director", subordinates);

  // Add a new subordinate branch
  const addSubordinate = () => {
    const newSubordinate = {
      id: Date.now(),
      type: "subordinate",
      position: `${subordinates.length + 1}`,
      children: [],
    };
    setSubordinates([...subordinates, newSubordinate]);
  };

  // Recursive function to remove a branch by ID
  const removeBranchRecursively = (nodes, idToRemove) => {
    return nodes
      .filter((node) => node.id !== idToRemove)
      .map((node) => ({
        ...node,
        children: removeBranchRecursively(node.children, idToRemove),
      }));
  };

  // Function to delete a branch
  const deleteBranch = (branchId) => {
    const updatedSubordinates = removeBranchRecursively(subordinates, branchId);
    setSubordinates(updatedSubordinates);
  };

  return (
    <div className="flex flex-nowrap p-6 bg-gray-100 w-full min-h-screen overflow-auto">
      <Tree
        label={
          <div className="border border-red-400 p-6 w-auto rounded-lg mb-6">
            <h1 className="text-3xl font-bold mb-4 text-center">Director</h1>
            <Menu as="div" className="relative float-right">
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
                        className={`w-full ${
                          active ? "bg-gray-100" : ""
                        } block md:px-4 px-2 text-center md:py-2 py-1 text-sm text-gray-700`}
                        onClick={addSubordinate}
                      >
                        Add a New Subordinate Branch
                      </button>
                    )}
                  </Menu.Item>
                  <hr />
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        }
      >
        <div className="flex flex-nowrap justify-center">
          {subordinates.map((subordinate) => (
            <TreeNode
              key={subordinate.id}
              label={
                <TreeNode
                  label={
                    <SubordinateBranch
                      data={subordinate}
                      depth={1}
                      onDeleteBranch={deleteBranch} // Pass delete function as prop
                      tree={subordinates}
                    />
                  }
                />
              }
            />
          ))}
        </div>
      </Tree>
    </div>
  );
};

export default Director;
