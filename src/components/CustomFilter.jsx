import { Select } from "antd";

const CustomFilter = ({ label, value, onChange, dataToMap }) => {
  return (
    <div className="flex flex-col mb-6">
      <h3>Filter tasks by title</h3>
      <Select
        mode="multiple"
        placeholder="Filter by title"
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
        }}
        options={dataToMap.map((item) => ({
          value: item?.id,
          label: item?.title,
        }))}
      />
    </div>
  );
};

export default CustomFilter;
