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
  className,
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
        handleEditPost={handleEditPost}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        data={data}
        editPost={editPost}
        className={className}
        dataEdit={dataEdit}
        setDataEdit={setDataEdit}
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
