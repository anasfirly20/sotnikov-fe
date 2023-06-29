import React from "react";

const postAmount = [10, 20, 30, 40, 100, 200];

const CustomSelect = ({
  value,
  onChange,
  className,
  deletedAmount,
  label,
  onClick,
  labelButton,
}) => {
  return (
    <div className="flex justify-between">
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
      <button
        className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700`}
        onClick={onClick}
      >
        {labelButton}
      </button>
    </div>
  );
};

export default CustomSelect;
