// Message.js
import React from "react";
import "./Message.css";

const Message = ({ type, msg }) => {
  return <div className={`message ${type}`}>{msg}</div>;
};

export default Message;
