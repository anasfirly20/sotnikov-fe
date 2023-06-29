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
  static async editPostById(id, body) {
    return await api.put(`/posts/${id}`, body);
  }

  // Delete Post by Id
  static async deletePostById(id) {
    return await api.delete(`/posts/${id}`);
  }

  // ADD new post
  static async addNewPost(body) {
    console.log("ADDED ORIGIN POST>>", body);
    return await api.post(`/posts`, body);
  }
}
