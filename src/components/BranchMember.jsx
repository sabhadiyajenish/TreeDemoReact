import React, { Fragment, useEffect, useState } from "react";

import SubordinateBranch from "./SubordinateBranch";
import Modal from "./Modal";
import { formatPosition } from "../utils/formatPosition";
import { TreeNode } from "react-organizational-chart";
import { Menu, Transition } from "@headlessui/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";

const BranchMember = ({ data, depth }) => {
  const [subordinates, setSubordinates] = useState(data.children || []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addSubordinate = () => {
    const newSubordinate = {
      id: Date.now(),
      type: "subordinate",
      position: `${data.position}/${subordinates.length + 1}`,
      children: [],
    };
    setSubordinates([...subordinates, newSubordinate]);
  };
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
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

        <Menu as="div" className="relative  float-right ">
          <Menu.Button>
            <BiDotsHorizontalRounded
              className={` text-[40px]  mr-1   cursor-pointer  `}
            />
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
            <Menu.Items className="absolute  top-[-40px] left-5 right-[-100px] z-50 mt-2 w-80 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={classNames(
                      active ? "w-full bg-gray-100" : "",
                      "w-full block md:px-4 px-2 text-center md:py-2 py-1 text-sm text-gray-700"
                    )}
                    onClick={addSubordinate}
                  >
                    Add a New Subordinate Brance
                  </button>
                )}
              </Menu.Item>
              <hr />
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

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
    </div>
  );
};

export default BranchMember;
