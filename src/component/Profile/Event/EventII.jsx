import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Eventt from "./Event";
import RenderAll from "../../renderAll/RenderAll";

const EventII = () => {
  return (
    <Routes>
      <Route path="/" element={<RenderAll />} />
      <Route path=":postId" element={<UserProWrap />} /> {/* fixed param name */}
    </Routes>
  );
};

function UserProWrap() {
  const { postId } = useParams(); // Extract post ID from URL
  console.log("Extracted postId:", postId); // Helpful debug log
  return <Eventt postId={postId} />;
}

export default EventII;