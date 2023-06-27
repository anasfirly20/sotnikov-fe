import React, { useEffect, useState } from "react";

// Api
import postApi from "./api/post.api";
import userApi from "./api/user.api";
import commentApi from "./api/comment.api";

// Miscellaneous
import { Icon } from "@iconify/react";

// Constants
import { socialActions } from "./constants";

// Utils
import { capitalizeFirstLetter, getPostAmount } from "../../../utils";

const PostPage = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState();
  const [isChecked, setIsChecked] = useState({});
  const postAmountSelected = getPostAmount();

  // Posts
  const postAmount = [10, 20, 30, 40, 100];
  const [selectedPostAmount, setSelectedPostAmount] =
    useState(postAmountSelected);

  const handleSelectChange = (e) => {
    setSelectedPostAmount(e.target.value);
    localStorage.setItem("amountOfPost", e.target.value);
  };

  // Comments
  const [isCommentActive, setIsCommentActive] = useState(false);
  const [comments, setComments] = useState([]);

  // GET all posts
  const getAllPosts = async () => {
    try {
      const responsePost = await postApi.getAllPost();
      const responseUser = await userApi.getAllUser();
      const posts = responsePost?.data;
      const users = responseUser?.data;
      const postData = posts?.map((post) => {
        const user = users?.find((u) => u?.id === post?.userId);
        return { ...post, user };
      });
      setData(postData);
    } catch (err) {
      console.log(err);
    }
  };

  // Get comment by PostId
  const getCommentByPostId = async (postId) => {
    try {
      const res = await commentApi.getCommentByPostId(postId);
      setComments(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  // Handleclick Comment
  const handleClickComment = (postId) => {
    if (selected === postId) {
      setIsCommentActive(!isCommentActive);
    } else {
      setSelected(postId);
      setIsCommentActive(true);
      getCommentByPostId(postId);
    }
  };

  return (
    <section className="px-longer py-shorter2 ">
      <div className="flex items-center">
        <h3 className="hover:underline">Post displayed:</h3>
        <select
          value={selectedPostAmount}
          onChange={handleSelectChange}
          className="w-fit px-3 bg-transparent outline-none"
        >
          {postAmount.map((e, i) => (
            <option key={i} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div
        className={`mt-3 grid md:grid-cols-2 lg:grid-cols-3 gap-5 ${isCommentActive}`}
      >
        {data?.slice(0, selectedPostAmount)?.map((dataInfo, i) => (
          <div
            key={i}
            className={`pt-shorter2 lg:pt-shorter3 flex flex-col justify-between gap-y-2 rounded-t-md bg-custom-blue-3 text-custom-black shadow-lg hover:-translate-y-1 animate300 ${
              selected === dataInfo?.id && isCommentActive && "row-span-2"
            }`}
          >
            <div className="space-y-3 px-normal md:px-shorter2 lg:px-shorter3 col-">
              <div className="flex flex-col gap-2">
                <input
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
                <div className="flex text-custom-blue-1 justify-between">
                  <h2>{dataInfo?.title}</h2>
                </div>
                <p className="pSmaller">
                  Made by:{" "}
                  <span className="text-gray-700 font-semibold pSmaller2">
                    {capitalizeFirstLetter(dataInfo?.user?.name)}
                  </span>
                </p>
              </div>
              <p className="pSmaller">{dataInfo?.body}</p>
            </div>
            <div className="">
              <div className="mt-shorter4 px-shorter4 bg-gray-400 flex justify-evenly gap-3 p-3 border border-gray-500">
                {socialActions.map((social, i) => (
                  <button
                    key={i}
                    className="flex gap-1 items-center"
                    onClick={() => {
                      social.name === "Comment" &&
                        handleClickComment(dataInfo?.id);
                    }}
                  >
                    <Icon icon={social.icon} className="pBigger" />
                  </button>
                ))}
              </div>
              {selected === dataInfo?.id && isCommentActive && (
                <div className="bg-gray-400 overflow-y-scroll scrollbar-thumb-gray-500 h-[30rem] space-y-5 scrollbar-thin">
                  {comments?.map((comment, i) => (
                    <React.Fragment key={i}>
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
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PostPage;
