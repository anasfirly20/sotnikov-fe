import api from "../../../api";

export default class todoApi {
  // GET all todos
  static async getAllTodo() {
    return await api.get(`/todos`);
  }
}
