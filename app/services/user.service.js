import API from "../utils/API";

class UserService {
  async getAll() {
    return await API.get(`users`);
  }

  async updateUserInfo(userId, userData) {
    return await API.put(`users/${userId}`, userData);
  }
}

export default new UserService();