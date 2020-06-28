/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const USER_DATA_LOGIN = 'USER_DATA_LOGIN';

export const loginActionAPI = async (email, password) => {
  const apiLogin = '/api/v1/users/login';
  try {
    const res = await axios.post(apiLogin, {
      email,
      password,
    });
    const { data } = res;
    console.log(data);
    if (data && data.Code === 0) {
      showAlert('success', 'Login successfully');
      location.assign('/');
      localStorage.setItem(USER_DATA_LOGIN, JSON.stringify(data));
    }
  } catch (error) {
    console.log(error.response);
    showAlert('error', error.response.data.Message);
    localStorage.removeItem(USER_DATA_LOGIN);
  }
};

export const logoutActionAPI = async () => {
  const apiLogout = '/api/v1/users/logout';
  try {
    const res = await axios.get(apiLogout);

    const { data } = res;
    if (data && data.Code === 0) {
      localStorage.removeItem(USER_DATA_LOGIN);
      showAlert('success', 'Logout successfully');

      if (
        location.pathname === '/account' ||
        location.pathname === '/submit-update-user'
      ) {
        location.assign('/');
      } else location.reload();
    }
  } catch (error) {
    console.log(error.response);
    showAlert('error', error.response.data.Message);
  }
};
