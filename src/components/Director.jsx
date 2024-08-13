// Director.js
import React, { Fragment, useEffect, useState } from "react";

import SubordinateBranch from "./SubordinateBranch";
import { Tree, TreeNode } from "react-organizational-chart";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Menu, Transition } from "@headlessui/react";

const Director = () => {
  const [subordinates, setSubordinates] = useState([]);

  const addSubordinate = () => {
    const newSubordinate = {
      id: Date.now(),
      type: "subordinate",
      position: `${subordinates.length + 1}`,
      children: [],
    };
    setSubordinates([...subordinates, newSubordinate]);
  };
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <div className="flex  flex-nowrap  p-6 bg-gray-100 w-full min-h-screen overflow-auto">
      <Tree
        label={
          <div className=" border border-red-400 p-6 w-auto rounded-lg  mb-6">
            <h1 className="text-3xl font-bold mb-4 text-center">Director</h1>

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
        }
      >
        <div className="flex flex-nowrap justify-center">
          {subordinates.map((subordinate) => (
            <TreeNode
              label={
                <SubordinateBranch
                  key={subordinate.id}
                  data={subordinate}
                  depth={1}
                />
              }
            ></TreeNode>
          ))}
        </div>
      </Tree>
    </div>
  );
};

export default Director;
