import api from "../../../api";

export default class todoApi {
  // GET all todos
  static async getAllTodo() {
    return await api.get(`/todos`);
  }

  // GET todo by Id
  static async getTodoById(id) {
    return await api.get(`/todos/${id}`);
  }

  // ADD new todo
  static async addNewTodo(body) {
    return await api.post(`/todos`, body);
  }

  // EDIT todo by Id
  static async editTodoById(id, body) {
    return await api.put(`/todos/${id}`, body);
  }
}
