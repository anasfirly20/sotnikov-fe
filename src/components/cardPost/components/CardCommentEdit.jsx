import React, { Fragment } from "react";

// Miscellaneous
import { Icon } from "@iconify/react";

// Constants
import { CommentEditIcons } from "../../../pages/postPage/constants";

const CardCommentEdit = ({
  selected,
  dataInfo,
  isCommentActive,
  handleClickEdit,
  handleClickComment,
  comments,
}) => {
  return (
    <div>
      {/* COMMENT / EDIT BUTTONS START */}
      <div className=" mt-shorter4 px-shorter4 bg-gray-400 flex justify-evenly gap-3 p-3 border border-gray-500">
        {CommentEditIcons.map((social, index) => (
          <button
            key={index}
            className="flex gap-1 items-center"
            onClick={() => {
              social.name === "Comment" && handleClickComment(dataInfo?.id);
              social.name === "Edit" && handleClickEdit(dataInfo?.id);
            }}
          >
            <Icon icon={social.icon} className="pBigger" />
          </button>
        ))}
      </div>
      {/* COMMENT / EDIT BUTTONS END */}

      {/* ALL COMMENTS OF A POST START */}
      {selected === dataInfo?.id && isCommentActive && (
        <div className="bg-gray-400 overflow-y-scroll scrollbar-thumb-gray-500 h-[30rem] space-y-5 scrollbar-thin">
          {comments?.map((comment, index) => (
            <Fragment key={index}>
              <div
                className={`flex flex-col md:px-shorter2 lg:px-shorter3 border-b border-gray-500 p-5 ${
                  i === comments.length - 1 && "border-b-0"
                }`}
              >
                <p className="font-semibold">
                  {comment?.name?.substring(0, 5)}
                </p>
                <p className="pSmaller">{comment?.email}</p>
                <p className="pSmaller2">{comment?.body}</p>
              </div>
            </Fragment>
          ))}
        </div>
      )}
      {/* ALL COMMENTS OF A POST END */}
    </div>
  );
};

export default CardCommentEdit;
