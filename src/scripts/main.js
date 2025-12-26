'use strict';

const div = document.createElement('div');

div.setAttribute('data-qa', 'notification');

/* ---------- Флаги ---------- */
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
    reject(new Error('First promise was rejected'));
  }, 3000);
});

/* ---------- SECOND PROMISE ---------- */
let resolveSecond;
const secondPromise = new Promise((resolve) => {
  resolveSecond = (msg) => resolve(msg);
});

/* ---------- THIRD PROMISE ---------- */
let resolveThird;
const thirdPromise = new Promise((resolve) => {
  resolveThird = (msg) => resolve(msg);
});

/* ---------- EVENTS ---------- */
document.addEventListener('click', () => {
  if (step === 2) {
    resolveSecond?.('Second promise was resolved');
  }

  if (step === 3) {
    leftClicked = true;
    checkThird();
  }
});

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();

  if (step === 2) {
    resolveSecond?.('Second promise was resolved');
  }

  if (step === 3) {
    rightClicked = true;
    checkThird();
  }
});

/* ---------- CHECK THIRD PROMISE ---------- */
function checkThird() {
  if (leftClicked && rightClicked) {
    resolveThird?.('Third promise was resolved');
  }
}

/* ---------- HANDLERS ---------- */
function successHandler(message) {
  step = 2;

  div.className = 'success';
  div.textContent = message;
  document.body.appendChild(div);

  return secondPromise;
}

function successHandler2(message) {
  step = 3;

  leftClicked = false;
  rightClicked = false;

  div.className = 'success';
  div.textContent = message;
  document.body.appendChild(div);

  return thirdPromise;
}

function successHandler3(message) {
  div.className = 'success';
  div.textContent = message;
  document.body.appendChild(div);
}

function errorHandler(message) {
  step = 2;

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
