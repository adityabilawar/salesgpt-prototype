import React from "react";

const Notification = ({ message, type }) => {
  return (
    <div
      className={`fixed top-0 right-0 bg-${
        type === "error" ? "red-800" : "green-800"
      }-600 text-white bg-green-200 text-green-500 p-4 rounded m-4 shadow-lg`}
    >
      {message}
    </div>
  );
};

export default Notification;
