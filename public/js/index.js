/* eslint-disable */
import '@babel/polyfill';
import { loginActionAPI, logoutActionAPI } from './loginAndLogout';
import { displayMap } from './mapBox';
import { updateUserActionApi } from './updateSettings';
import { bookTour } from './stripe';

// DOM ELEMENTS
const DOM_Map = document.getElementById('map');
const DOM_Login_Form = document.querySelector('.form--login');
const DOM_Logout_btn = document.querySelector('.nav__el--logout');
const DOM_Update_User_Info_Form = document.querySelector('.form-user-data');
const DOM_Update_User_Password_Form = document.querySelector(
  '.form-user-settings'
);
const BOOK_TOUR_BTN = document.getElementById('book-tour');

if (DOM_Logout_btn) {
  DOM_Logout_btn.addEventListener('click', async () => await logoutActionAPI());
}

if (DOM_Login_Form) {
  DOM_Login_Form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginActionAPI(email, password);
  });
}

if (BOOK_TOUR_BTN) {
  BOOK_TOUR_BTN.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (DOM_Update_User_Info_Form) {
  DOM_Update_User_Info_Form.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-info').textContent = 'Updating...';

    // Values
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('photo', document.getElementById('photo').files[0]);

    await updateUserActionApi('info', formData);

    document.querySelector('.btn--save-info').textContent = 'Save settings';
  });
}

if (DOM_Update_User_Password_Form) {
  DOM_Update_User_Password_Form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Values
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    document.querySelector('.btn--save-password').textContent = 'Updating...';

    await updateUserActionApi('password', {
      passwordCurrent,
      password,
      passwordConfirm,
    });

    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

// DELEGATION
if (DOM_Map) {
  const locations = JSON.parse(DOM_Map.dataset.locations);
  displayMap(locations);
}
