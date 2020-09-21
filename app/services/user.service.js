import API from "../utils/API";

class UserService {
  async getAll() {
    return await API.get(`users`);
  }
}

export default new UserService();