import React, { Fragment, useEffect, useState } from "react";

import BranchMember from "./BranchMember";
import Modal from "./Modal.jsx";
import { formatPosition } from "../utils/formatPosition.jsx";
import { TreeNode } from "react-organizational-chart";
import { Menu, Transition } from "@headlessui/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";

const SubordinateBranch = ({ data, depth }) => {
  const [subordinates, setSubordinates] = useState(data.children || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const addSubordinate = (type) => {
    setModalType(type);
    const newSubordinate = {
      id: Date.now(),
      type: type,
      position: `${data.position}/${subordinates.length + 1}`,
      children: [],
    };
    setSubordinates([...subordinates, newSubordinate]);
    setIsModalOpen(false);
  };
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
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
          <Menu as="div" className="relative float-right w-full  ">
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
                      onClick={() => addSubordinate("subordinate")}
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
    </div>
  );
};

export default SubordinateBranch;
