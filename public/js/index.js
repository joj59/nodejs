/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { bookTour } from './stripe';
import { updateSettings } from './updateSettings';
import { displayMap } from './mapbox';

const mapBox = document.getElementById('map');
const bookBtn = document.getElementById('book-tour');
const loginForm = document.querySelector('.form--login');
const userDetails = document.querySelector('.form-user-data');
const passwordUpdate = document.querySelector('.form-user-password');
const logoutButton = document.querySelector('.nav__el--logout');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (userDetails) {
  userDetails.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);

    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });
}

if (passwordUpdate) {
  passwordUpdate.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save--password').textContent = 'updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save--password').textContent =
      'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

if (bookBtn) {
  bookBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'processing...';
    const tourID = e.target.dataset.tourId;
    console.log(tourID);

    await bookTour(tourID);
  });
}
