import React, { useState, useEffect, Fragment } from "react";

// Miscellaneous
import { useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";

// Api

// Utils
import { capitalizeFirstLetter, getTasksDisplayed } from "../../../utils";

// Components
import CustomSelect from "../../components/CustomSelect";
import CustomModal from "../../components/CustomModal";
import CustomInput from "../../components/CustomInput";

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

  return (
    <section className="px-longer py-shorter2">
      <CustomSelect
        label="Tasks displayed:"
        value={selectedTaskAmount}
        onChange={handleSelectChange}
        // deletedAmount={deleteAlbumAmount}
      />
    </section>
  );
};

export default TaskPage;
