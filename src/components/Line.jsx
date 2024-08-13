// Line.js
import React from "react";

const Line = ({ x1, y1, x2, y2 }) => (
  <svg
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    }}
    className="line-svg"
  >
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" />
  </svg>
);

export default Line;
