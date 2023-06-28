import api from "../../../api";

export default class albumApi {
  // GET All albums
  static async getAllAlbum() {
    return await api.get(`/albums`);
  }
}
