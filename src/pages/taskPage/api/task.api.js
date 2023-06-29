import api from "../../../api";

export default class todoApi {
  // GET all todos
  static async getAllTodo() {
    return await api.get(`/todos`);
  }

  // ADD new todo
  static async addNewTodo(body) {
    console.log("ADDED ORIGIN TASK>>", body);
    return await api.post(`/todos`, body);
  }
}
