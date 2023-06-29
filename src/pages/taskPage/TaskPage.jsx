import React, { useState, useEffect, Fragment } from "react";

// Miscellaneous
import { useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";

// Api
import userApi from "../postPage/api/user.api";
import todoApi from "./api/task.api";

// Utils
import { capitalizeFirstLetter, getTasksDisplayed } from "../../../utils";

// Components
import CustomSelect from "../../components/CustomSelect";
import CustomModal from "../../components/CustomModal";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";

const TaskPage = () => {
  const [selectedId, setSelectedId] = useState();

  const taskAmountDisplayed = getTasksDisplayed();
  const [selectedTaskAmount, setSelectedTaskAmount] = useState(
    taskAmountDisplayed || 10
  );

  const handleSelectChange = (e) => {
    setSelectedTaskAmount(e.target.value);
    localStorage.setItem("displayedTask", e.target.value);
  };

  // GET All todos
  const [data, setData] = useState([]);

  const getAllTodos = async () => {
    try {
      const responseTodo = await todoApi.getAllTodo();
      const todoFalse = responseTodo?.data?.filter(
        (todo) => todo.completed === false
      );
      const todoTrue = responseTodo?.data?.filter(
        (todo) => todo.completed === true
      );
      const filteredTodo = [...todoFalse, ...todoTrue];
      setData(filteredTodo);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <section className="px-longer py-shorter2">
      <CustomSelect
        label="Tasks displayed:"
        value={selectedTaskAmount}
        onChange={handleSelectChange}
        // deletedAmount={deleteAlbumAmount}
        labelButton="Add Task"
        onClick={() => {
          console.log("ADD");
        }}
      />
      <div
        className={`mt-3 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`}
      >
        {data?.slice(0, selectedTaskAmount)?.map((dataInfo, i) => (
          <div
            key={i}
            className={`relative flex flex-col gap-y-2 text-custom-black shadow-lg animate300 bg-yellow-50 rounded-xl hover:shadow-[2px_2px_16px_gray] p-5
            `}
          >
            <h2 className={`${dataInfo?.completed ? "line-through" : ""}`}>
              {dataInfo?.title && capitalizeFirstLetter(dataInfo?.title)}
            </h2>
            <p className="">
              Status:{" "}
              <span
                className={`font-semibold ${
                  dataInfo?.completed ? "text-green-500" : "text-red-500"
                }`}
              >
                {dataInfo?.completed ? "Completed" : "Not completed"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TaskPage;
