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

  // EDIT album by Id
  static async editAlbumById(id, body) {
    return await api.put(`albums/${id}`, body);
  }

  // GET photos by albumId
  static async getPhotosByAlbumId(id) {
    return await api.get(`albums/${id}/photos`);
  }

  // GET photos by id
  static async getPhotoById(id) {
    return await api.get(`/photos/${id}`);
  }

  // ADD new album>
  static async addNewAlbum(body) {
    console.log("ADDED ORIGIN >>", body);
    return await api.post(`/albums`, body);
  }
}
