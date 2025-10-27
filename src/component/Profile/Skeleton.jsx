// src/components/Skeleton.jsx
import React from "react";
import "./skelenton.css";

function Skeleton({ width, height, borderRadius = "6px", circle = false }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: circle ? "50%" : borderRadius,
      }}
    ></div>
  );
}

export default Skeleton;