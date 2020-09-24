import API from "../utils/API";

class SupportService {
    
  async createSupportTicket(body) {
    return await API.post(`supports/`, body);
  }
  
}

export default new SupportService();