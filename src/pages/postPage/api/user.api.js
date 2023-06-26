import api from "../../../api";

export default class userApi {
  // GET All users
  static async getAllUser() {
    return await api.get(`/users`);
  }

  //   GET user by Id
  static async getUserById(id) {
    return await api.get(`/users/${id}`);
  }
}
