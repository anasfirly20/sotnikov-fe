import api from "../../../api";

export default class albumApi {
  // GET All albums
  static async getAllAlbum() {
    return await api.get(`/albums`);
  }

  // DELETE album by Id
  static async deleteAlbumById(id) {
    return await api.delete(`/albums/${id}`);
  }

  //   EDIT album by Id
  static async editAlbumById(id, body) {
    return await api.put(`albums/${id}`, body);
  }
}
