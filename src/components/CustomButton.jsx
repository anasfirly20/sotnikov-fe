import React from "react";

const CustomButton = (label, className, onClick) => {
  return (
    <button className={className} onClick={onClick}>
      {label}
    </button>
  );
};

export default CustomButton;
//
