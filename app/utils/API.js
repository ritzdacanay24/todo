import Axios from "axios";

const fetchClient = () => {
  const defaultOptions = {
    baseURL: "http://localhost:5000/api/",
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Create instance
  let instance = Axios.create(defaultOptions);

  // Set the x-auth-token token for any request
  instance.interceptors.request.use(function (config) {
    const token = JSON.parse(localStorage.getItem('user'));
    if (token) config.headers['x-auth-token'] = token.appToken;
    return config;
  });

  return instance;
};

export default fetchClient();