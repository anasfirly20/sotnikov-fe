import React, { useEffect, useState, Fragment } from "react";

// Api
import postApi from "./api/post.api";
import userApi from "./api/user.api";
import commentApi from "./api/comment.api";

// Miscellaneous
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";

// Constants
import { CommentEditIcons, ConfirmCancelEditIcons } from "./constants";

// Utils
import { capitalizeFirstLetter, getPostAmount } from "../../../utils";

// Components
import CustomInput from "../../components/CustomInput";
import CustomModal from "../../components/CustomModal";
import CustomFilter from "../../components/CustomFilter";
import CustomSelect from "../../components/CustomSelect";
import ButtonDelete from "../../components/ButtonDelete";
import ButtonFavorite from "../../components/ButtonFavorite";
import ModalAddPost from "../../components/ModalAddPost";

const PostPage = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState();
  const [isChecked, setIsChecked] = useState({});

  // Amount of Posts
  const postAmountSelected = getPostAmount();
  const [selectedPostAmount, setSelectedPostAmount] = useState(
    postAmountSelected || 10
  );

  const handleSelectChange = (e) => {
    setSelectedPostAmount(e.target.value);
    localStorage.setItem("displayedPost", e.target.value);
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

  const handleChangeEditPost = (e) => {
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
        console.log("CHECKKKK>>>", res?.data);
        const updatedData = data?.map((post) =>
          post.id === id ? { ...post, ...res?.data } : post
        );
        console.log("UPDATED>>>>>>", updatedData);
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
  const handleClickFavorite = (postId) => {
    const updatedData = data.map((post) => {
      if (post.id === postId) {
        const updatedPost = { ...post, isFavorite: !post.isFavorite };
        localStorage.setItem(`post-${postId}`, JSON.stringify(updatedPost));
        return updatedPost;
      }
      return post;
    });
    setData(updatedData);
  };

  // DELETE post by Id
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [deleteModalConfirmation, setDeleteModalConfirmation] = useState(false);
  const [deletedPostAmount, setDeletedPostAmount] = useState(0);

  const handleDeletePost = (postId) => {
    setPostIdToDelete(postId);
    setDeleteModalConfirmation(true);
  };

  const confirmDeletePost = async () => {
    try {
      await postApi.deletePostById(postIdToDelete);
      const updatedData = data.filter((post) => post.id !== postIdToDelete);
      setData(updatedData);
      setSelectedPostAmount((prev) => prev - 1);
      setDeletedPostAmount((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    }
    setPostIdToDelete(null);
    setDeleteModalConfirmation(false);
  };

  const cancelDeletePost = () => {
    setPostIdToDelete(null);
    setDeleteModalConfirmation(false);
  };

  // ADD NEW POST
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
    user: {
      name: "New User",
    },
  });

  const cancelAddPost = () => {
    setIsOpenAddModal(false);
  };

  const addNewPost = async () => {
    try {
      if (newPost?.title && newPost?.body) {
        const res = await postApi.addNewPost(newPost);
        const updateData = [res?.data, ...data];
        setData(updateData);
      } else {
        toast.error("Failed to add, all fields are required");
      }
    } catch (err) {
      console.log(err);
    }
    setIsOpenAddModal(false);
    setNewPost({
      title: "",
      body: "",
    });
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  useEffect(() => {
    console.log("NEW POST TO ADD>>", newPost);
  }, [newPost]);

  return (
    <section className="px-longer py-shorter2">
      <CustomFilter />
      <CustomSelect
        label="Post displayed:"
        value={selectedPostAmount}
        onChange={handleSelectChange}
        deletedAmount={deletedPostAmount}
        labelButton="Add Post"
        onClick={() => {
          setIsOpenAddModal(true);
        }}
      />
      <div className={`mt-3 sm:mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-5`}>
        <CustomModal
          cancelDeletePost={cancelDeletePost}
          confirmDeletePost={confirmDeletePost}
          show={deleteModalConfirmation}
          post={selected ? data.find((post) => post.id === selected) : null}
        />
        <ModalAddPost
          cancelAdd={cancelAddPost}
          confirmAdd={addNewPost}
          show={isOpenAddModal}
          handleChange={handleAddChange}
          nameTitle="title"
          valueTitle={newPost?.title}
          namePost="body"
          valuePost={newPost?.body}
        />
        {data?.slice(0, selectedPostAmount)?.map((dataInfo, i) => (
          <div
            key={i}
            className={`pt-shorter2 lg:pt-shorter3 flex flex-col justify-between gap-y-5 rounded-t-md bg-custom-blue-3 text-custom-black shadow-lg animate300 ${
              selected === dataInfo?.id && isCommentActive && "row-span-2"
            }
            ${
              dataInfo?.isFavorite &&
              "bg-blue-400 shadow-[3px_3px_18px_gray] -translate-y-3"
            }
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
                  <div className="flex gap-3">
                    {isChecked[i] && (
                      <>
                        <ButtonFavorite
                          onClick={() => {
                            setSelected(dataInfo?.id);
                            handleClickFavorite(dataInfo?.id);
                          }}
                          className={`pBigger animate300 ${
                            dataInfo?.isFavorite ? "text-red-500 scale-150" : ""
                          }`}
                        />
                        <ButtonDelete
                          onClick={() => {
                            handleDeletePost(dataInfo?.id);
                            setIsChecked(!isChecked[i]);
                          }}
                          className={`pBigger`}
                        />
                      </>
                    )}
                    {!isChecked[i] && dataInfo?.isFavorite && (
                      <ButtonFavorite
                        onClick={() => {
                          setSelected(dataInfo?.id);
                          handleClickFavorite(dataInfo?.id);
                        }}
                        className={`pBigger animate300 text-red-500 scale-150`}
                      />
                    )}
                  </div>
                </div>

                {selected === dataInfo?.id && isEdit ? (
                  <>
                    {/* EDIT INPUT POST START */}
                    <div className="space-y-5">
                      <CustomInput
                        label="Title"
                        value={dataEdit?.title}
                        name="title"
                        onChange={handleChangeEditPost}
                      />
                      <CustomInput
                        label="Post by"
                        value={dataEdit?.user?.name}
                        name="name"
                        onChange={handleChangeEditPost}
                      />
                      <CustomInput
                        label="Post"
                        value={dataEdit?.body}
                        name="body"
                        onChange={handleChangeEditPost}
                      />
                      {/* CONFIRM EDIT / CANCEL BUTTONS START  */}
                      <div className="flex gap-5 justify-center">
                        {ConfirmCancelEditIcons.map((e, i) => (
                          <Icon
                            key={i}
                            icon={e.icon}
                            className="text-4xl hover:cursor-pointer hover:scale-110 animate500"
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
                    <p className="pSmaller2 text-gray-700">
                      Post made by{" "}
                      <span className="text-gray-700 font-semibold pSmaller2 hover:underline">
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
                      if (social.name === "Comment") {
                        handleClickComment(dataInfo?.id);
                      } else if (social.name === "Edit") {
                        handleClickEdit(dataInfo?.id);
                      }
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
                    <Fragment key={i}>
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default PostPage;
