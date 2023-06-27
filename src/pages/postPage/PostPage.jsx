import React, { useEffect, useState } from "react";

// Api
import postApi from "./api/post.api";
import userApi from "./api/user.api";
import commentApi from "./api/comment.api";

// Miscellaneous
import { Icon } from "@iconify/react";

// Constants
import { socialActions } from "./constants";

const PostPage = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState();

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
      console.log("COMMENT >", res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <section className="px-longer py-shorter2">
      <div
        className={`grid aspect-square md:grid-cols-2 lg:grid-cols-3 gap-5 ${isCommentActive}`}
      >
        {data?.slice(0, 10)?.map((dataInfo) => (
          <div
            key={dataInfo?.id}
            className="pt-shorter2 lg:pt-shorter3 flex flex-col justify-between gap-y-2 rounded-t-md bg-custom-blue-3 text-custom-black shadow-lg hover:-translate-y-1 animate300"
          >
            <div className="space-y-3 px-normal md:px-shorter2 lg:px-shorter3">
              <div className="flex text-custom-blue-1 justify-between">
                <h2>{dataInfo?.user?.username}</h2>
                <input
                  type="checkbox"
                  className="accent-custom-cream w-6 rounded-md"
                />
              </div>
              <h3 className="tracking-wider text-custom-blue-">
                {dataInfo?.title}
              </h3>
              <p className="pSmaller2">{dataInfo?.body}</p>
            </div>
            <div className="mt-shorter4 px-shorter4 bg-gray-400 flex justify-evenly gap-3 p-3 w-full">
              {socialActions.map((social, i) => (
                <button
                  key={i}
                  className="flex gap-1 items-center"
                  onClick={() => {
                    if (social.name === "Comment") {
                      getCommentByPostId(dataInfo?.id);
                      setSelected(dataInfo?.id);
                      if (selected === dataInfo?.id) {
                        setIsCommentActive(!isCommentActive);
                      }
                    }
                  }}
                >
                  <Icon icon={social.icon} className="pBigger" />
                </button>
              ))}
            </div>
            {dataInfo?.id === selected && isCommentActive && (
              <div className="bg-gray-400 px-normal md:px-shorter2 lg:px-shorter3">
                {comments?.map((e) => (
                  <p className="pSmaller">{e?.email}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PostPage;
