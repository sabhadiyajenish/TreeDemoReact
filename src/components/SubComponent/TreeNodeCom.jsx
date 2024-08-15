import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import SubordinateBranch from "../SubordinateBranch";

// TreeNode component to handle rendering and recursion
const TreeNodeCom = ({ label, children }) => {
  return (
    <div className="tree-node">
      {label}
      {children && children.length > 0 && (
        <div className="children-container">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              label={<SubordinateBranch data={child} />}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNodeCom;
