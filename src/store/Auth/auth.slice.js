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
        return nodes.map((node, index) => {
          const newPosition = parentPosition
            ? `${parentPosition}/${index + 1}`
            : `${index + 1}`;
          return {
            ...node,
            position: newPosition,
            children: fixPositions(node.children, newPosition),
          };
        });
      };

      // Remove the branch and adjust positions
      state.UserList = fixPositions(
        removeBranchRecursively(state.UserList, idToRemove)
      );
      console.log("Updated state:", state.UserList);
    },
    deleteThisBranch: (state, action) => {
      const { idToRemove } = action.payload;

      // Recursive function to update positions of nodes
      const updatePositions = (nodes, parentPosition) => {
        let index = 1;
        return nodes.reduce((acc, node) => {
          if (node.id === idToRemove) {
            if (node.children && node.children.length > 0) {
              // If the node to delete has children, move them up to the parent's level
              return [
                ...acc,
                ...node.children.map((child) => ({
                  ...child,
                  position: `${parentPosition}/${index++}`, // Update the position of the child
                })),
              ];
            }
            // If no children, skip this node (effectively deleting it)
            return acc;
          }

          // Recursively handle the children
          const updatedNode = {
            ...node,
            children: updatePositions(
              node.children,
              `${parentPosition}/${index++}`
            ),
          };

          return [...acc, updatedNode];
        }, []);
      };

      // Function to fix position formatting after deletion
      const fixPositions = (nodes, parentPosition = "") => {
        return nodes.map((node, index) => {
          const newPosition = parentPosition
            ? `${parentPosition}/${index + 1}`
            : `${index + 1}`;
          return {
            ...node,
            position: newPosition,
            children: fixPositions(node.children, newPosition),
          };
        });
      };

      // Apply the recursive update logic and fix positions
      state.UserList = fixPositions(updatePositions(state.UserList, ""));
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
