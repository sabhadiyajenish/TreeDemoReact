// utils/formatPosition.js
export const formatPosition = (position) => {
  const segments = position.split("/");
  // Only keep the last two segments
  const formattedPosition = segments.slice(-2).join("/");
  return formattedPosition;
};
