import API from "../utils/API";

class ListService {
    
  async createNewList(data) {
    return await API.post(`lists/`, data);
  }

  async updateList(list) {
    return await API.put(`lists/${list._id}`, list);
  }

  async deleteListById(listId) {
    return await API.delete(`lists/${listId}`);
  }

  async getListByUserId(userId) {
    return await API.get(`lists/${userId}`);
  }

  async listInvite(params) {
    return await API.post(`lists/listInvite`, params);
  }

  async saveSubscribers(lsitId, toUser) {
    return await API.put(`lists/subscribers/${lsitId}/${toUser}`);
  }

  async getSubscribers(userId, listId) {
    return await API.get(`lists/getSubscribers/${userId}/${listId}`);
  }
  
}

export default ListService;