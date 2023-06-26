import api from "../../../api";

export default class postApi {
  // GET All posts
  static async getAllPost() {
    return await api.get(`/posts`);
  }

  // GET post by Id
  static async getPostById(Id) {
    return await api.get(`/posts/${Id}`);
  }
}
