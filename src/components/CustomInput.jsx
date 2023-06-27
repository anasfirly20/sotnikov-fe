import React from "react";

const CustomInput = ({ label, className, onChange, value, name }) => {
  return label === "Post" ? (
    <div className="flex flex-col">
      <label className="">{label}:</label>
      <textarea
        className={`text-gray-700  bg-transparent scrollbar-thin scrollbar-thumb-custom-blue-1 border-b outline-none focus:border-b-2 border-black ${className}`}
        name={name}
        value={value}
        onChange={onChange}
        cols="30"
        rows="6"
      ></textarea>
    </div>
  ) : (
    <div className="flex flex-col">
      <label className="">{label}:</label>
      <input
        className={`text-gray-700  bg-transparent border-b outline-none focus:border-b-2 border-black ${className}`}
        value={value}
        onChange={onChange}
        name={name}
        type="text"
      />
    </div>
  );
};

export default CustomInput;
