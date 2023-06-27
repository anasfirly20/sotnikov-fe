import React from "react";

// Components
import CustomInput from "../../CustomInput";

// Constants
import {
  FavoriteDeleteIcons,
  ConfirmCancelEditIcons,
} from "../../../pages/postPage/constants";

// Miscellaneous
import { Icon } from "@iconify/react";

// Utils
import { capitalizeFirstLetter } from "../../../../utils";

const CardContent = ({
  isChecked,
  setIsChecked,
  selected,
  setSelected,
  openModal,
  dataInfo,
  dataEdit,
  handleEditPost,
  isEdit,
  i,
  setIsEdit,
  setDataEdit,
  data,
  editPost,
}) => {
  return (
    <div className="space-y-3 px-normal md:px-shorter2 lg:px-shorter3 col-">
      {/* CHECKBOX AND DELETE/FAV ICONS START */}
      <div className="flex justify-between">
        <CustomInput
          type="checkbox"
          checked={isChecked[i]}
          className="accent-custom-cream w-5 h-5 rounded-md"
          onChange={(e) => {
            setIsChecked({
              ...isChecked,
              [i]: e.target.checked,
            });
          }}
        />
        {isChecked[i] && (
          <div className="flex gap-3">
            {FavoriteDeleteIcons.map((e) => (
              <button
                key={i}
                className="flex gap-1 items-center"
                onClick={() => {
                  if (e.name === "Favorite") {
                    setSelected(dataInfo?.id);
                    openModal();
                    console.log("FAVORITE OPEN MODAL");
                  }
                }}
              >
                {" "}
                <Icon icon={e.icon} className="pBigger" />
              </button>
            ))}
          </div>
        )}
      </div>
      {/* CHECKBOX AND DELETE/FAV ICONS END */}

      {/* EDIT INPUT POST START */}
      {selected === dataInfo?.id && isEdit ? (
        <div className="space-y-5">
          <CustomInput
            label="Title"
            value={dataEdit?.title}
            name="title"
            onChange={handleEditPost}
          />
          <CustomInput
            label="Made by"
            value={dataEdit?.user?.name}
            name="name"
            onChange={handleEditPost}
          />
          <CustomInput
            label="Post"
            value={dataEdit?.body}
            name="body"
            onChange={handleEditPost}
          />
          {/* CONFIRM EDIT / CANCEL BUTTONS START  */}
          <div className="flex gap-5 justify-center">
            {ConfirmCancelEditIcons.map((e, i) => (
              <Icon
                key={i}
                icon={e.icon}
                className="text-4xl hover:cursor-pointer"
                color={e.color}
                onClick={() => {
                  if (e.name === "Confirm") {
                    if (selected === dataInfo?.id) {
                      const post = data.find((p) => p.id === dataInfo?.id);
                      editPost(dataInfo?.id, dataEdit);
                      setDataEdit(post);
                      setIsEdit(false);
                    }
                  } else {
                    setIsEdit(false);
                  }
                }}
              />
            ))}
          </div>
          {/* CONFIRM EDIT / CANCEL BUTTONS END  */}
        </div>
      ) : (
        <>
          <h2 className="text-custom-blue-1">
            {capitalizeFirstLetter(dataInfo?.title)}
          </h2>
          <p className="pSmaller">
            Made by:{" "}
            <span className="text-gray-700 font-semibold pSmaller2">
              {capitalizeFirstLetter(dataInfo?.user?.name)}
            </span>
          </p>
          <p className="pSmaller">{dataInfo?.body}</p>
        </>
      )}
      {/* EDIT INPUT POST END */}
    </div>
  );
};

export default CardContent;
