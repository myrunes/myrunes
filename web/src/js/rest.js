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
    url: `${HOST}/api/users`,
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

function createPage(page) {
  return _req({
    url: `${HOST}/api/pages`,
    method: 'POST',
    json: page,
  });
}

function deletePage(uid) {
  return _req({
    url: `${HOST}/api/pages/${uid}`,
    method: 'DELETE',
  });
}

function updateUser(update) {
  return _req({
    url: `${HOST}/api/users/me`,
    method: 'POST',
    json: update,
  });
}

function deleteUser(currpassword) {
  return _req({
    url: `${HOST}/api/users/me`,
    method: 'DELETE',
    json: { currpassword },
  });
}

function getSessions() {
  return _req({
    url: `${HOST}/api/sessions`,
    method: 'GET',
  });
}

function deleteSession(sessionid) {
  return _req({
    url: `${HOST}/api/sessions/${sessionid}`,
    method: 'DELETE',
  });
}

function getFavorites() {
  return _req({
    url: `${HOST}/api/favorites`,
    method: 'GET',
  });
}

function setFavorites(favorites) {
  return _req({
    url: `${HOST}/api/favorites`,
    method: 'POST',
    json: { favorites },
  });
}

function getShare(ident) {
  return _req({
    url: `${HOST}/api/shares/${ident}`,
    method: 'GET',
  });
}

function createShare(share) {
  console.log(share);
  return _req({
    url: `${HOST}/api/shares`,
    method: 'POST',
    json: share,
  });
}

function updateShare(share) {
  return _req({
    url: `${HOST}/api/shares/${share.uid}`,
    method: 'POST',
    json: share,
  });
}

function deleteShare(share) {
  return _req({
    url: `${HOST}/api/shares/${share.uid}`,
    method: 'DELETE',
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
  createPage,
  deletePage,
  updateUser,
  deleteUser,
  getSessions,
  deleteSession,
  getFavorites,
  setFavorites,
  getShare,
  createShare,
  updateShare,
  deleteShare,
};
