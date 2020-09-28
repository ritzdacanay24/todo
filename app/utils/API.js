import Axios from "axios";
import { NotificationManager } from 'react-notifications';

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

  instance.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
      NotificationManager.error('Network error - Please make sure API is running');
    }
    const { status, data, config } = error.response;

    if (status == 500) {
      NotificationManager.error('Server error - Check the terminal for more info.');
    }
    if (status == 404) {
      NotificationManager.error('Server error - API end point cannot be found. ');
    }
  })

  return instance;
};

export default fetchClient();