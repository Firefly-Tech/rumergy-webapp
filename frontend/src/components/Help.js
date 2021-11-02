import React from "react";
import { FaQuestionCircle } from "react-icons/fa";
import IconButton from "./IconButton";

function Help(props) {
  return (
    <IconButton icon={<FaQuestionCircle />} clickAction={() => {console.log("clicky clik")}}/>
  );
}

export default Help;
