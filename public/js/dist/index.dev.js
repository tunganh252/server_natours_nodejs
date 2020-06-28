"use strict";

require("@babel/polyfill");

var _loginAndLogout = require("./loginAndLogout");

var _mapBox = require("./mapBox");

var _updateSettings = require("./updateSettings");

/* eslint-disable */
// DOM ELEMENTS
var DOM_Map = document.getElementById('map');
var DOM_Login_Form = document.querySelector('.form--login');
var DOM_Logout_btn = document.querySelector('.nav__el--logout');
var DOM_Update_User_Info_Form = document.querySelector('.form-user-data');
var DOM_Update_User_Password_Form = document.querySelector('.form-user-settings'); // DELEGATION

if (DOM_Map) {
  var locations = JSON.parse(DOM_Map.dataset.locations);
  (0, _mapBox.displayMap)(locations);
}

if (DOM_Login_Form) {
  DOM_Login_Form.addEventListener('submit', function (e) {
    e.preventDefault(); // VALUES

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    (0, _loginAndLogout.loginActionAPI)(email, password);
  });
}

if (DOM_Logout_btn) DOM_Logout_btn.addEventListener('click', function () {
  return (0, _loginAndLogout.logoutActionAPI)();
});

if (DOM_Update_User_Info_Form) {
  DOM_Update_User_Info_Form.addEventListener('submit', function _callee(e) {
    var formData;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.preventDefault();
            document.querySelector('.btn--save-info').textContent = 'Updating...'; // Values

            formData = new FormData();
            formData.append('name', document.getElementById('name').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('photo', document.getElementById('photo').files[0]);
            _context.next = 8;
            return regeneratorRuntime.awrap((0, _updateSettings.updateUserActionApi)('info', formData));

          case 8:
            document.querySelector('.btn--save-info').textContent = 'Save settings';

          case 9:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}

if (DOM_Update_User_Password_Form) {
  DOM_Update_User_Password_Form.addEventListener('submit', function _callee2(e) {
    var passwordCurrent, password, passwordConfirm;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            e.preventDefault(); // Values

            passwordCurrent = document.getElementById('password-current').value;
            password = document.getElementById('password').value;
            passwordConfirm = document.getElementById('password-confirm').value;
            document.querySelector('.btn--save-password').textContent = 'Updating...';
            _context2.next = 7;
            return regeneratorRuntime.awrap((0, _updateSettings.updateUserActionApi)('password', {
              passwordCurrent: passwordCurrent,
              password: password,
              passwordConfirm: passwordConfirm
            }));

          case 7:
            document.querySelector('.btn--save-password').textContent = 'Save Password';
            document.getElementById('password-current').value = '';
            document.getElementById('password').value = '';
            document.getElementById('password-confirm').value = '';

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
}