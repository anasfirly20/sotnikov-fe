import api from "../../../api";

export default class postApi {
  // GET All posts
  static async getAllPost() {
    return await api.get(`/posts`);
  }
}
