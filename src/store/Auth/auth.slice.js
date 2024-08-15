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

      // Recursive function to remove a node and promote its children
      const removeAndPromote = (nodes, parentPosition = "") => {
        let index = 1;
        return nodes.reduce((acc, node) => {
          if (node.id === idToRemove) {
            if (node.children && node.children.length > 0) {
              // Promote children of the node to delete
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
            children: removeAndPromote(
              node.children,
              `${parentPosition}/${index++}`
            ),
          };

          return [...acc, updatedNode];
        }, []);
      };

      // Function to fix position formatting after deletion
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

      // Apply the recursive removal and position fixing
      state.UserList = fixPositions(removeAndPromote(state.UserList, ""));
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
