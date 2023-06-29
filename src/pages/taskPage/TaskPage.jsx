import React, { useState, useEffect, Fragment } from "react";

// Miscellaneous
import { useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";

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
import ModalAddTask from "../../components/ModalAddTask";
import ButtonConfirm from "../../components/ButtonConfirm";

const TaskPage = () => {
  const [selected, setSelected] = useState();

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

  // ADD NEW TASK
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    completed: false,
  });

  const cancelAddTask = () => {
    setIsOpenAddModal(false);
  };

  const addNewTodo = async () => {
    try {
      if (newTask?.title) {
        const res = await todoApi.addNewTodo(newTask);
        const updateData = [res?.data, ...data];
        setData(updateData);
      } else {
        toast.error("Failed to add, cannot leave field empty");
      }
    } catch (err) {
      console.log(err);
    }
    setIsOpenAddModal(false);
    setNewTask({
      title: "",
    });
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  useEffect(() => {
    console.log("SELECTED >>", selected);
    // console.log("data>>", data);
  }, [selected]);

  // EDIT TASK
  const [isEdit, setIsEdit] = useState(false);

  const editTodoById = async (id, body) => {
    try {
      const res = await todoApi.editTodoById(id, body);
      console.log("RES>>>", res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="px-longer py-shorter2">
      <CustomSelect
        label="Tasks displayed:"
        value={selectedTaskAmount}
        onChange={handleSelectChange}
        // deletedAmount={deleteAlbumAmount}
        labelButton="Add Task"
        onClick={() => {
          setIsOpenAddModal(true);
        }}
      />
      <ModalAddTask
        cancelAdd={cancelAddTask}
        confirmAdd={addNewTodo}
        show={isOpenAddModal}
        handleChange={handleAddChange}
        nameTitle="title"
        valueTitle={newTask?.title}
      />
      <div
        className={`mt-3 sm:mt-6 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`}
      >
        {data?.slice(0, selectedTaskAmount)?.map((dataInfo, i) => (
          <div
            key={i}
            className={`relative flex flex-col justify-between gap-y-28 lg:gap-y-20 xl:gap-y-10 text-custom-black shadow-lg animate300 bg-yellow-50 rounded-xl hover:shadow-[2px_2px_16px_gray] p-5
            `}
          >
            {selected === i && isEdit ? (
              "ENTAR"
            ) : (
              <h2 className={`${dataInfo?.completed ? "line-through" : ""}`}>
                {dataInfo?.title && capitalizeFirstLetter(dataInfo?.title)}
              </h2>
            )}
            <div className="flex flex-col">
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
              <div className="flex justify-end gap-2 mt-1">
                {selected === i && isEdit ? (
                  <>
                    <ButtonConfirm
                      label="Confirm"
                      className="bg-custom-blue-1 text-white hover:bg-custom-blue-2 active:bg-custom-blue-1"
                    />
                    <ButtonConfirm
                      label="Cancel"
                      className="bg-transparent text-black border border-black hover:opacity-60"
                      onClick={() => setIsEdit(false)}
                    />
                  </>
                ) : (
                  <>
                    <Icon
                      icon="bxs:edit"
                      className="text-3xl bottom-3 right-3 cursor-pointer"
                      onClick={() => {
                        if (isEdit) {
                          setSelected(i);
                          setIsEdit(true);
                        } else {
                          setIsEdit(!isEdit);
                          setSelected(i);
                        }
                      }}
                    />
                    <Icon
                      icon="material-symbols:delete"
                      color="darkred"
                      className="text-3xl bottom-3 right-3 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TaskPage;
