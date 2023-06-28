import React from "react";

const CustomSelect = ({
  value,
  onChange,
  className,
  dataToMap,
  deletedAmount,
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-fit px-3 bg-transparent outline-none ${className}`}
    >
      {dataToMap.map((e, i) => (
        <option key={i} value={e}>
          {e - deletedAmount}
        </option>
      ))}
    </select>
  );
};

export default CustomSelect;
