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
    resolve(div);
  };

  document.addEventListener('click', onClick);

  const timer = setTimeout(() => {
    reject(div);
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
  resolveThird = resolve;
});

/* ---------- EVENTS ---------- */
document.addEventListener('click', () => {
  if (step === 2) {
    resolveSecond?.();
  }

  if (step === 3) {
    leftClicked = true;
    checkThird();
  }
});

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();

  if (step === 2) {
    resolveSecond?.();
  }

  if (step === 3) {
    rightClicked = true;
    checkThird();
  }
});

/* ---------- CHECK THIRD PROMISE ---------- */
function checkThird() {
  if (leftClicked && rightClicked) {
    resolveThird?.();
  }
}

/* ---------- HANDLERS ---------- */
function successHandler() {
  step = 2;

  div.className = 'success';
  div.textContent = 'First promise was resolved';
  document.body.appendChild(div);

  return secondPromise;
}

function successHandler2() {
  step = 3;

  leftClicked = false;
  rightClicked = false;

  div.className = 'success';
  div.textContent = 'Second promise was resolved';
  document.body.appendChild(div);

  return thirdPromise;
}

function successHandler3() {
  div.className = 'success';
  div.textContent = 'Third promise was resolved';
  document.body.appendChild(div);
}

function errorHandler() {
  step = 2;

  div.className = 'error';
  div.textContent = 'First promise was rejected';
  document.body.appendChild(div);

  return secondPromise;
}

/* ---------- PROMISE CHAIN ---------- */
firstPromise
  .then(successHandler)
  .catch(errorHandler)
  .then(successHandler2)
  .then(successHandler3);
