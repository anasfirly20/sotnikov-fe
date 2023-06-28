import React from "react";

const postAmount = [10, 20, 30, 40, 100];

const CustomSelect = ({ value, onChange, className, deletedAmount, label }) => {
  return (
    <div className="flex items-center">
      <h3 className="hover:underline">{label}</h3>
      <select
        value={value}
        onChange={onChange}
        className={`w-fit px-3 bg-transparent outline-none ${className}`}
      >
        {postAmount.map((e, i) => (
          <option key={i} value={e}>
            {deletedAmount ? e - deletedAmount : e}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;
