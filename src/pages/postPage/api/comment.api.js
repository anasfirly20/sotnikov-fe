import api from "../../../api";

export default class commentApi {
  // GET All comments
  static async getAllComments() {
    return await api.get(`/comments`);
  }

  //   GET comment by Id
  static async getCommentById(id) {
    return await api.get(`/comments/${id}`);
  }

  //   GET comment by PostId
  static async getCommentByPostId(postId) {
    return await api.get(`/posts/${postId}/comments`);
  }
}
