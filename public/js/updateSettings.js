/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

/**
 * @param {*object} data
 * @param {*string} type
 * @enum {info, password} for type
 */
export const updateUserActionApi = async (type, dataUpdate) => {
  const apiUpdateUserInfo = '/api/v1/users/updateCurrentUser';
  const apiUpdateCurrentPassword = '/api/v1/users/updatePassword';

  const apiUrl =
    type === 'password'
      ? apiUpdateCurrentPassword
      : type === 'info' && apiUpdateUserInfo;

  try {
    const res = await axios({
      method: 'PATCH',
      url: apiUrl,
      data: dataUpdate,
    });

    const { data } = res;

    if (data && data.Code === 0) {
      location.reload();
      showAlert('success', `${type.toUpperCase()} Updated Successfully`);
    } else showAlert('error', 'Something Went Wrong !!!');
  } catch (error) {
    console.log(error.response);

    showAlert('error', error.response.data.Message);
  }
};
