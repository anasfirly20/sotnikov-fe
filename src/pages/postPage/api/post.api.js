import api from "../../../api";

export default class postApi {
  // GET All posts
  static async getAllPost() {
    return await api.get(`/posts`);
  }

  // GET post by Id
  static async getPostById(id) {
    return await api.get(`/posts/${id}`);
  }

  // Edit Post by Id
  static async EditPostById(id, body) {
    return await api.put(`posts/${(id, body)}`);
  }
}
