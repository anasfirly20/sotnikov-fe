import React from "react";

const ButtonConfirm = ({ onClick, className, label }) => {
  return (
    <button
      className={`px-3 py-1 font-medium rounded-lg ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ButtonConfirm;
