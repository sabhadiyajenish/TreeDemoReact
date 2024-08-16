import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    UserList: [], // Initial empty list
  },
  reducers: {
    addSubordinate: (state, action) => {
      const { parentId, type } = action.payload || {}; // Extracting properties from payload

      if (!type) {
        console.error("Invalid payload:", action.payload);
        return;
      }

      const newSubordinate = {
        id: Date.now(),
        type,
        position: `${state.UserList.length + 1}`,
        children: [],
      };

      const addRecursively = (nodes, parentId, newSubordinate) => {
        if (parentId === null) {
          // Adding to root level if parentId is null
          return [...nodes, newSubordinate];
        }

        return nodes.map((node) => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...node.children, newSubordinate],
            };
          }
          return {
            ...node,
            children: addRecursively(node.children, parentId, newSubordinate),
          };
        });
      };

      state.UserList = addRecursively(state.UserList, parentId, newSubordinate);
      console.log("state is<<<<", state.UserList);
    },
    addSubSubordinate: (state, action) => {
      const { parentId, newSubordinate } = action.payload || {}; // Extracting properties from payload

      if (!newSubordinate.type) {
        console.error("Invalid payload:", action.payload);
        return;
      }

      const addRecursively = (nodes, parentId, newSubordinate) => {
        if (parentId === null) {
          // Adding to root level if parentId is null
          return [...nodes, newSubordinate];
        }

        return nodes.map((node) => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...node.children, newSubordinate],
            };
          }
          return {
            ...node,
            children: addRecursively(node.children, parentId, newSubordinate),
          };
        });
      };

      state.UserList = addRecursively(state.UserList, parentId, newSubordinate);
      console.log("state is<<<<", state.UserList);
    },
    deleteBranch: (state, action) => {
      const idToRemove = action.payload;

      // Recursive function to remove a branch
      const removeBranchRecursively = (nodes, idToRemove) => {
        return nodes
          .filter((node) => node.id !== idToRemove) // Remove the node with the given id
          .map((node) => ({
            ...node,
            children: removeBranchRecursively(node.children, idToRemove), // Recursively remove from children
          }));
      };

      // Recursive function to fix position formatting
      const fixPositions = (nodes, parentPosition = "") => {
        console.log("Processing nodes:", nodes);

        let memberIndex = 1; // To track positions for "member" type nodes
        let subordinateIndex = 1; // To track positions for "subordinate" type nodes

        return nodes.reduce((acc, node) => {
          // Determine the position index based on node type
          let newIndex;
          if (node.type === "member") {
            newIndex = memberIndex++;
          } else if (node.type === "subordinate") {
            newIndex = subordinateIndex++;
          } else {
            newIndex = 1; // Default index if type is unknown
          }

          // Create the new position based on parent position and type-specific index
          const newPosition = parentPosition
            ? `${parentPosition}/${newIndex}`
            : `${newIndex}`;

          // Add the node with updated position
          const updatedNode = {
            ...node,
            position: newPosition,
            children: fixPositions(node.children, newPosition),
          };

          return [...acc, updatedNode];
        }, []);
      };

      // Remove the branch and adjust positions
      state.UserList = fixPositions(
        removeBranchRecursively(state.UserList, idToRemove)
      );
      console.log("Updated state:", state.UserList);
    },
    deleteThisBranch: (state, action) => {
      const { idToRemove } = action.payload;

      // Helper function to process nodes and remove the target node
      const processNodes = (nodes, idToRemove, parentPosition = "") => {
        const result = [];
        let childrenToMove = [];

        nodes.forEach((node, idx) => {
          if (node.id === idToRemove) {
            // Collect children to move
            childrenToMove = node.children.map((child, childIdx) => ({
              ...child,
              position: `${parentPosition}/${childIdx + 1}`,
            }));
            console.log("childrensame level is <<", childrenToMove);

            // Skip adding the removed node
            return;
          }

          // Recursively process child nodes
          const updatedNode = {
            ...node,
            children: processNodes(
              node.children,
              idToRemove,
              `${parentPosition}/${idx + 1}`
            ),
          };

          result.push(updatedNode);
        });

        // Relocate children
        if (childrenToMove.length > 0) {
          const sameLevelSiblings = result.filter(
            (node) => node.type === "subordinate"
          );

          if (sameLevelSiblings.length > 0) {
            // Move children to the next same-level sibling
            console.log("come here if have same levelsibling level is <<");

            const nextSibling = sameLevelSiblings.find(
              (sibling, siblingIdx) => siblingIdx >= 0
            );

            if (nextSibling) {
              nextSibling.children = [
                ...nextSibling.children,
                ...childrenToMove,
              ];
            } else {
              // If no next sibling, move children to the previous sibling
              const prevSibling = sameLevelSiblings.find(
                (sibling, siblingIdx) => siblingIdx <= 0
              );

              if (prevSibling) {
                prevSibling.children = [
                  ...prevSibling.children,
                  ...childrenToMove,
                ];
              } else {
                // If no siblings, move children to the parent
                result.push(...childrenToMove);
              }
            }
          } else {
            // If no same-level siblings, move children to the parent
            console.log("come here if dont same levelsibling level is <<");

            result.push(...childrenToMove);
          }
        }

        return result;
      };

      // Function to fix positions after deletion and promotion
      const fixPositions = (nodes, parentPosition = "") => {
        let index = 1;

        return nodes.map((node) => {
          const newPosition = parentPosition
            ? `${parentPosition}/${index++}`
            : `${index++}`;

          return {
            ...node,
            position: newPosition,
            children: fixPositions(node.children, newPosition),
          };
        });
      };

      // Process the nodes to remove the target and promote children
      const processedNodes = processNodes(state.UserList, idToRemove);
      state.UserList = fixPositions(processedNodes);

      console.log("Updated state:", state.UserList);
    },
  },
});

export const {
  addSubordinate,
  addSubSubordinate,
  deleteBranch,
  deleteThisBranch,
} = authSlice.actions;
export default authSlice.reducer;
