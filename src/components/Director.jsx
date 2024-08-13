// Director.js
import React, { useState } from "react";
import SubordinateBranch from "./SubordinateBranch";
import { Tree, TreeNode } from "react-organizational-chart";

const Director = () => {
  const [subordinates, setSubordinates] = useState([]);

  const addSubordinate = () => {
    const newSubordinate = {
      id: Date.now(),
      type: "subordinate",
      position: `1/${subordinates.length + 1}`,
      children: [],
    };
    setSubordinates([...subordinates, newSubordinate]);
  };

  return (
    <div className="flex  flex-nowrap  p-6 bg-gray-100 w-full min-h-screen overflow-auto">
      <Tree
        label={
          <div className=" border border-red-400 p-6 w-auto rounded-lg  mb-6">
            <h1 className="text-3xl font-bold mb-4 text-center">Director</h1>
            <button
              onClick={addSubordinate}
              className="focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Add a New Subordinate Branch
            </button>
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
