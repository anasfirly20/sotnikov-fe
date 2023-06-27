import React, { Fragment } from "react";

// Components
import CardContent from "./components/CardContent";
import CardCommentEdit from "./components/CardCommentEdit";

const CardPost = ({
  i,
  isChecked,
  setIsChecked,
  selected,
  setSelected,
  openModal,
  dataInfo,
  dataEdit,
  handleEditPost,
  isEdit,
  setIsEdit,
  setDataEdit,
  data,
  editPost,
  isCommentActive,
  handleClickEdit,
  handleClickComment,
  comments,
}) => {
  return (
    <Fragment>
      <CardContent
        i={i}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        selected={selected}
        setSelected={setSelected}
        openModal={openModal}
        dataInfo={dataInfo}
        dataEdit={dataEdit}
        handleEditPost={handleEditPost}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setDataEdit={setDataEdit}
        data={data}
        editPost={editPost}
      />

      <CardCommentEdit
        selected={selected}
        dataInfo={dataInfo}
        isCommentActive={isCommentActive}
        handleClickEdit={handleClickEdit}
        handleClickComment={handleClickComment}
        comments={comments}
      />
    </Fragment>
  );
};

export default CardPost;
