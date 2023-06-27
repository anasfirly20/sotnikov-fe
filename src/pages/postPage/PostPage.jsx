import React, { useEffect, useState, Fragment } from "react";

// Api
import postApi from "./api/post.api";
import userApi from "./api/user.api";
import commentApi from "./api/comment.api";

// Miscellaneous
import { Icon } from "@iconify/react";
import { Dialog, Transition } from "@headlessui/react";

// Constants
import {
  CommentEditIcons,
  FavoriteDeleteIcons,
  ConfirmCancelEditIcons,
} from "./constants";

// Utils
import {
  capitalizeFirstLetter,
  getPostAmount,
  getFavorites,
} from "../../../utils";

// Components
import CustomInput from "../../components/CustomInput";
import Favorites from "./components/Favorites";
import CustomModal from "../../components/CustomModal";

const PostPage = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState();
  const [isChecked, setIsChecked] = useState({});

  // Amount of Posts
  const postAmountSelected = getPostAmount();
  const postAmount = [10, 20, 30, 40, 100];
  const [selectedPostAmount, setSelectedPostAmount] =
    useState(postAmountSelected);

  const handleSelectChange = (e) => {
    setSelectedPostAmount(e.target.value);
    localStorage.setItem("amountOfPost", e.target.value);
  };

  // Comment Button Active
  const [isCommentActive, setIsCommentActive] = useState(false);
  const [comments, setComments] = useState([]);

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

  // GET all posts
  const getAllPosts = async () => {
    try {
      const responsePost = await postApi.getAllPost();
      const responseUser = await userApi.getAllUser();
      const posts = responsePost?.data;
      const users = responseUser?.data;
      const postData = posts?.map((post) => {
        const user = users?.find((u) => u?.id === post?.userId);
        const storageKey = `post-${post.id}`;
        const storedPost = JSON.parse(localStorage.getItem(storageKey)) || {};
        return { ...post, user, isFavorite: storedPost.isFavorite || false };
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

  // EDIT POSTS
  const [isEdit, setIsEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState({});

  const handleEditPost = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setDataEdit({ ...dataEdit, user: { ...dataEdit?.user, [name]: value } });
    } else {
      setDataEdit({ ...dataEdit, [name]: value });
    }
  };

  const editPost = async (id, body) => {
    try {
      if (dataEdit) {
        const res = await postApi.editPostById(id, body);
        // console.log(">>>>", res?.data);
        const updatedData = data.map((post) =>
          post.id === id ? { ...post, ...res?.data } : post
        );
        setData(updatedData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickEdit = (postId) => {
    if (selected === postId) {
      const post = data.find((p) => p.id === postId);
      setDataEdit(post);
      editPost(postId, dataEdit);
      setIsEdit(!isEdit);
    } else {
      setSelected(postId);
      setIsEdit(true);
    }
  };

  // display values immediately on input once edit button is clicked
  useEffect(() => {
    const post = data.find((p) => p.id === selected);
    setDataEdit(post);
  }, [selected, data]);

  // FAVORITES
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [favoritePosts, setFavoritePosts] = useState([]);

  const handleClickFavorite = (postId) => {
    const updatedData = data.map((post) => {
      if (post.id === postId) {
        const updatedPost = { ...post, isFavorite: !post.isFavorite };
        localStorage.setItem(`post-${postId}`, JSON.stringify(updatedPost));
        getFavorites(postId);
        if (updatedPost.isFavorite) {
          setFavoritePosts((prev) => [...prev, postId]); // add post ID to favoritePosts array
        } else {
          setFavoritePosts((prev) => prev.filter((id) => id !== postId)); // remove post ID from favoritePosts array
        }
        return updatedPost;
      }
      return post;
    });
    setData(updatedData);
  };

  useEffect(() => {
    console.log("CALLED");
    getFavorites(selected);
  }, [selected]);

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
        className={`mt-3 grid md:grid-cols-2 xl:grid-cols-3 gap-5 ${isCommentActive}`}
      >
        {/* <CustomModal
          onClose={closeModal}
          onConfirm={addToFav}
          show={isOpen}
          post={selected ? data.find((post) => post.id === selected) : null}
        /> */}
        {data?.slice(0, selectedPostAmount)?.map((dataInfo, i) => (
          <div
            key={i}
            className={`pt-shorter2 lg:pt-shorter3 flex flex-col justify-between gap-y-2 rounded-t-md bg-custom-blue-3 text-custom-black shadow-lg hover:-translate-y-1 animate300 ${
              selected === dataInfo?.id && isCommentActive && "row-span-2"
            }
            ${dataInfo?.isFavorite && "bg-blue-400 shadow-[3px_3px_18px_gray]"}
            `}
          >
            <div className="space-y-3 px-normal md:px-shorter2 lg:px-shorter3 col-">
              <div className="flex flex-col gap-2">
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
                      {FavoriteDeleteIcons.map((e, i) => (
                        <button
                          key={i}
                          className="flex gap-1 items-center"
                          onClick={() => {
                            if (
                              e.name === "Favorite" ||
                              selected === dataInfo?.id
                            ) {
                              setSelected(dataInfo?.id);
                              handleClickFavorite(dataInfo?.id);
                            }
                          }}
                        >
                          {" "}
                          <Icon
                            icon={e.icon}
                            className={`pBigger animate300 ${
                              e.name === "Favorite" && dataInfo?.isFavorite
                                ? "text-red-500 scale-150"
                                : ""
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selected === dataInfo?.id && isEdit ? (
                  <>
                    {/* EDIT INPUT POST START */}
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
                                  const post = data.find(
                                    (p) => p.id === dataInfo?.id
                                  );
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
                    {/* EDIT INPUT POST END */}
                  </>
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
              </div>
            </div>

            {/* COMMENT EDIT BUTTONS START */}
            <div className="">
              <div className="mt-shorter4 px-shorter4 bg-gray-400 flex justify-evenly gap-3 p-3 border border-gray-500">
                {CommentEditIcons.map((social, i) => (
                  <button
                    key={i}
                    className="flex gap-1 items-center"
                    onClick={() => {
                      social.name === "Comment" &&
                        handleClickComment(dataInfo?.id);
                      social.name === "Edit" && handleClickEdit(dataInfo?.id);
                    }}
                  >
                    <Icon icon={social.icon} className="pBigger" />
                  </button>
                ))}
              </div>
              {/* COMMENT EDIT BUTTONS END */}

              {/* ALL COMMENTS OF A POST START */}
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
              {/* ALL COMMENTS OF A POST END */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PostPage;
