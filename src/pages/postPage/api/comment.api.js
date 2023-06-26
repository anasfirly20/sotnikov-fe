import api from "../../../api";

export default class commentApi {
  // GET All comments
  static async getAllUser() {
    return await api.get(`/comments`);
  }

  //   GET user by Id
  static async getUserById(id) {
    return await api.get(`/comments/${id}`);
  }
}
