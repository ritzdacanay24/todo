import API from "../utils/API";

class AuthService {
  login(email, password) {
    return API
      .post('users/login', {
        email,
        password
      })
      .then(response => {
        if (response.data.appToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(firstName, lastName, email, password) {
    return API.post('users/', {
      firstName,
      lastName,
      email,
      password
    });
  }

  getCurrentUserStorage() {
    return JSON.parse(localStorage.getItem('user'));;
  }

  async getCurrentUser() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      let res = await API.get(`users/${user.userId}`);
      return res.data;
    } else {
      return false
    }
  }
}

export default new AuthService();