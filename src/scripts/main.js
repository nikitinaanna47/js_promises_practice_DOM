'use strict';

let leftClicked = false;
let rightClicked = false;
let step = 1; // 1 → firstPromise, 2 → secondPromise, 3 → thirdPromise

/* ---------- FIRST PROMISE ---------- */
const firstPromise = new Promise((resolve, reject) => {
  const onClick = () => {
    document.removeEventListener('click', onClick);
    clearTimeout(timer);
    resolve('First promise was resolved');
  };

  document.addEventListener('click', onClick);

  const timer = setTimeout(() => {
    // eslint-disable-next-line prefer-promise-reject-errors
    reject('First promise was rejected');
  }, 3000);
});

/* ---------- SECOND PROMISE ---------- */
let resolveSecond;
const secondPromise = new Promise((resolve) => {
  resolveSecond = resolve;
});

/* ---------- THIRD PROMISE ---------- */
let resolveThird;
const thirdPromise = new Promise((resolve) => {
  resolveThird = (msg) => resolve(msg);
});

/* ---------- EVENTS ---------- */

function handleSecondClick(e) {
  if (step !== 2) {
    return;
  }

  if (e.button === 0 || e.button === 2) {
    resolveSecond('Second promise was resolved');
    document.removeEventListener('click', handleSecondClick);
    document.removeEventListener('contextmenu', handleSecondClick);
  }
}

document.addEventListener('click', handleSecondClick);

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  handleSecondClick(e);
});

/* ---------- THIRD PROMISE EVENTS (MISSING PART ADDED) ---------- */

document.addEventListener('click', (e) => {
  if (step !== 3) {
    return;
  }

  if (e.button === 0) {
    leftClicked = true;
    checkThird();
  }
});

document.addEventListener('contextmenu', (e) => {
  if (step !== 3) {
    return;
  }

  e.preventDefault();

  if (e.button === 2) {
    rightClicked = true;
    checkThird();
  }
});

/* ---------- CHECK THIRD PROMISE ---------- */
function checkThird() {
  if (leftClicked && rightClicked) {
    resolveThird('Third promise was resolved');
  }
}

/* ---------- HANDLERS ---------- */
function successHandler(message) {
  step = 2;

  const div = document.createElement('div');

  div.dataset.qa = 'notification';
  div.className = 'success';
  div.textContent = message;
  document.body.appendChild(div);

  return secondPromise;
}

function successHandler2(message) {
  leftClicked = false;
  rightClicked = false;
  step = 3;

  const div = document.createElement('div');

  div.dataset.qa = 'notification';
  div.className = 'success';
  div.textContent = message;
  document.body.appendChild(div);

  return thirdPromise;
}

function successHandler3(message) {
  const div = document.createElement('div');

  div.dataset.qa = 'notification';
  div.className = 'success';
  div.textContent = message;
  document.body.appendChild(div);
}

function errorHandler(message) {
  step = 2;

  const div = document.createElement('div');

  div.dataset.qa = 'notification';
  div.className = 'error';
  div.textContent = message;
  document.body.appendChild(div);

  return secondPromise;
}

/* ---------- PROMISE CHAIN ---------- */
firstPromise
  .then(successHandler)
  .catch(errorHandler)
  .then(successHandler2)
  .then(successHandler3);
