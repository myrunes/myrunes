/** @format */

import request from 'request';

const HOST =
  process.env.NODE_ENV === 'production'
    ? window.location.origin
    : 'http://localhost:8080';

function getMe() {
  return _req({
    url: `${HOST}/api/users/me`,
    method: 'GET',
    withCredentials: true,
  });
}

function checkUsername(uname) {
  return _req({
    url: `${HOST}/api/users/${uname}`,
    method: 'GET',
  });
}

function register(username, password, remember) {
  return _req({
    url: `${HOST}/api/users/me`,
    method: 'POST',
    json: {
      username,
      password,
      remember,
    },
  });
}

function login(username, password, remember) {
  return _req({
    url: `${HOST}/api/login`,
    method: 'POST',
    json: {
      username,
      password,
      remember,
    },
  });
}

function logout() {
  return _req({
    url: `${HOST}/api/logout`,
    method: 'POST',
  });
}

function getChamps() {
  return _req({
    url: `${HOST}/api/resources/champions`,
    method: 'GET',
  });
}

function getRunes() {
  return _req({
    url: `${HOST}/api/resources/runes`,
    method: 'GET',
  });
}

function getPages() {
  return _req({
    url: `${HOST}/api/pages`,
    method: 'GET',
  });
}

function getPage(uid) {
  return _req({
    url: `${HOST}/api/pages/${uid}`,
    method: 'GET',
  });
}

function updatePage(uid, page) {
  return _req({
    url: `${HOST}/api/pages/${uid}`,
    method: 'POST',
    json: page,
  });
}

// ----------------------------

function _req(options) {
  return new Promise((resolve, rejects) => {
    options.withCredentials = true;
    request(options, (err, res, body) => {
      if (err) {
        rejects(err);
        return;
      }

      if (body && typeof body === 'string') body = JSON.parse(body);

      if (res.statusCode >= 400) {
        rejects(body);
        return;
      }
      resolve({ res, body });
    });
  });
}

export default {
  getMe,
  checkUsername,
  register,
  login,
  logout,
  getChamps,
  getRunes,
  getPages,
  getPage,
  updatePage,
};
