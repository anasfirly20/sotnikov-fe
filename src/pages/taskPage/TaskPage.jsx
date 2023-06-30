import React, { useState, useEffect, Fragment } from "react";

// Miscellaneous
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";
import { Select } from "antd";

// Api
import todoApi from "./api/task.api";

// Utils
import {
  capitalizeFirstLetter,
  getTasksDisplayed,
  getTasks,
} from "../../../utils";

// Components
import CustomSelect from "../../components/CustomSelect";
import CustomModal from "../../components/CustomModal";
import CustomInput from "../../components/CustomInput";
import CustomFilter from "../../components/CustomFilter";
import ModalAddTask from "../../components/ModalAddTask";
import ButtonComponent from "../../components/ButtonComponent";

const TaskPage = () => {
  const [selected, setSelected] = useState();

  const tasks = getTasks();
  const taskAmountDisplayed = getTasksDisplayed();
  const [selectedTaskAmount, setSelectedTaskAmount] = useState(
    taskAmountDisplayed || 10
  );

  const handleSelectChange = (e) => {
    setSelectedTaskAmount(e.target.value);
    localStorage.setItem("displayedTask", e.target.value);
  };

  // GET All todos
  const [data, setData] = useState(tasks || []);

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
      if (data.length === 0) {
        console.log("TRIGGRED");
        setData(filteredTodo);
      }
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
      console.log("ADD TRIGGERED");
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

  // EDIT TASK
  const [isEdit, setIsEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState({});

  const editTodoById = async (id, body) => {
    try {
      if (dataEdit?.title) {
        const res = await todoApi.editTodoById(id, body);
        console.log("RES>>>", res?.data);
        const updateData = data?.map((task) =>
          task?.id === id ? { ...task, ...res?.data } : task
        );
        setData(updateData);
        console.log("updated data>>", updateData);
      } else {
        toast.error("Cannot leave the field empty");
      }
    } catch (err) {
      console.log(err);
    }
    setIsEdit(false);
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setDataEdit({ ...dataEdit, [name]: value });
  };

  const handleClickIsEdit = (index) => {
    if (isEdit) {
      const updateData = [...data];
      setDataEdit(updateData[index]);
      setSelected(index);
      setIsEdit(true);
    } else {
      setIsEdit(!isEdit);
      setSelected(index);
    }
  };

  // GET todo by id
  const getTodoById = async (id) => {
    try {
      const res = await todoApi.getTodoById(id);
      setDataEdit(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE TASK
  const [todoIdToDelete, setTodoIdToDelete] = useState(null);
  const [deleteModalConfirmation, setDeleteModalConfirmation] = useState(false);
  const [deleteTodoAmount, setDeleteTodoAmount] = useState(0);

  const handleDeleteTodo = (todoId) => {
    setTodoIdToDelete(todoId);
    setDeleteModalConfirmation(true);
  };

  const confirmDeleteTodo = async () => {
    try {
      await todoApi.deleteTodoById(todoIdToDelete);
      const updateData = data?.filter((todo) => todo?.id !== todoIdToDelete);
      setData(updateData);
      setSelectedTaskAmount((prev) => prev - 1);
      setDeleteTodoAmount((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    }
    setTodoIdToDelete(null);
    setDeleteModalConfirmation(false);
  };

  const cancelDeleteTodo = () => {
    setDeleteModalConfirmation(false);
  };

  // EDIT TASK STATUS
  const handleChangeCheckBox = (e, i) => {
    const updateData = [...data];
    updateData[i].completed = e.target.checked;
    localStorage.setItem("tasks", JSON.stringify(updateData));
    setData(updateData);
  };

  // FILTER
  const [selectedItemsAntd, setSelectedItemsAntd] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const filteredOptionsAntd = data?.filter(
    (e) => !selectedItemsAntd.includes(e)
  );

  const getTodoByIdFilters = async (ids) => {
    try {
      const promises = ids.map((id) => todoApi.getTodoById(id));
      const responses = await Promise.all(promises);
      const todos = responses.map((res) => res.data);
      setFilteredData(todos);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTodoByIdFilters(selectedItemsAntd);
  }, [selectedItemsAntd]);

  const dataToMap = filteredData.length > 0 ? filteredData : data;

  return (
    <section className="px-longer py-shorter2">
      <CustomFilter
        label="task"
        value={selectedItemsAntd}
        onChange={setSelectedItemsAntd}
        dataToMap={filteredOptionsAntd}
      />
      <CustomSelect
        label="Tasks displayed:"
        value={selectedTaskAmount}
        onChange={handleSelectChange}
        deletedAmount={deleteTodoAmount}
        labelButton="Add Task"
        onClick={() => {
          setIsOpenAddModal(true);
        }}
      />
      <CustomModal
        cancelDeletePost={cancelDeleteTodo}
        confirmDeletePost={confirmDeleteTodo}
        show={deleteModalConfirmation}
        post={selected ? data.find((album) => album.id === selected) : null}
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
        {dataToMap?.slice(0, selectedTaskAmount)?.map((dataInfo, i) => (
          <div
            key={i}
            className={`relative flex flex-col justify-between gap-y-28 lg:gap-y-20 xl:gap-y-10 text-custom-black shadow-lg animate300 rounded-xl hover:shadow-[2px_2px_16px_gray] p-5 animate500 ${
              dataInfo?.completed ? "order-last bg-[#c9f9cd]" : "bg-yellow-50"
            }
            `}
          >
            {selected === i && isEdit ? (
              <>
                <CustomInput
                  type="text"
                  label="Task:"
                  className=""
                  onChange={handleChangeEdit}
                  name="title"
                  value={dataEdit?.title || ""}
                />
              </>
            ) : (
              <div className="flex gap-3">
                <CustomInput
                  type="checkbox"
                  checked={dataInfo?.completed}
                  className="accent-custom-cream w-5 h-5 rounded-md mt-1"
                  onChange={(e) => {
                    handleChangeCheckBox(e, i);
                  }}
                />
                <h2 className={`${dataInfo?.completed ? "line-through" : ""}`}>
                  {dataInfo?.title && capitalizeFirstLetter(dataInfo?.title)}
                </h2>
              </div>
            )}
            <div>
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
                    <ButtonComponent
                      label="Confirm"
                      className="bg-custom-blue-1 text-white hover:bg-custom-blue-2 active:bg-custom-blue-1"
                      onClick={() => {
                        editTodoById(dataInfo?.id, dataEdit);
                      }}
                    />
                    <ButtonComponent
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
                        handleClickIsEdit(i);
                        getTodoById(dataInfo?.id);
                      }}
                    />
                    <Icon
                      icon="material-symbols:delete"
                      color="darkred"
                      className="text-3xl bottom-3 right-3 cursor-pointer"
                      onClick={() => {
                        handleDeleteTodo(dataInfo?.id);
                      }}
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
